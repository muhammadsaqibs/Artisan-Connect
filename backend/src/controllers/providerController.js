import Provider from "../models/Provider.js";

export const createProvider = async (req, res) => {
  try {
    const body = { ...req.body };

    // Validate required fields
    if (!body.name || !body.category || !body.hourlyRate) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, category, and hourly rate are required" 
      });
    }

    // Convert hourlyRate to number if it's a string
    if (body.hourlyRate !== undefined) {
      body.hourlyRate = Number(body.hourlyRate);
      if (isNaN(body.hourlyRate)) {
        return res.status(400).json({ 
          success: false, 
          message: "Hourly rate must be a valid number" 
        });
      }
    }

    // Remove empty string values for optional fields
    if (body.subCategory === "") {
      delete body.subCategory;
    }

    // Normalize input: allow comma-separated skills string
    if (typeof body.skills === "string") {
      body.skills = body.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (req.file) {
      body.profilePicture = `/uploads/${req.file.filename}`;
    }

    const provider = new Provider(body);
    await provider.save();
    res.status(201).json({ success: true, data: provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviders = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      city,
      skills,
      q,
      lat,
      lng,
      radius = 20,
      availableNow, // Filter for Available Now providers
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (city) filter["location.city"] = city;
    if (skills) filter.skills = { $in: skills.split(",").map((s) => s.trim()) };
    if (q) filter.name = { $regex: q, $options: "i" };
    
    // Filter by availability - show only Available Now providers
    if (availableNow === "true" || availableNow === true) {
      filter.isAvailable = true;
    }

    let query = Provider.find(filter);

    // Optional geo filter
    if (lat && lng) {
      query = Provider.find({
        ...filter,
        "location.geo": {
          $near: {
            $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
            $maxDistance: Number(radius) * 1000,
          },
        },
      });
    }

    const providers = await query.sort({ rating: -1, numReviews: -1 }).limit(100);
    res.json({ success: true, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviderById = async (req, res) => {
  try {
    const doc = await Provider.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Provider not found" });
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProviderMe = async (req, res) => {
  try {
    // Upsert provider profile for self-onboarding
    let provider = null;
    if (req.user?.providerProfileId) {
      provider = await Provider.findById(req.user.providerProfileId);
    }
    if (!provider) {
      provider = new Provider();
    }

    const updatable = [
      "name",
      "hourlyRate",
      "skills",
      "category",
      "subCategory",
      "bio",
      "phone",
      "cnic",
      "age",
      "workExperienceYears",
      "isAvailable",
      "availability",
    ];

    updatable.forEach((k) => {
      if (req.body[k] !== undefined) provider[k] = req.body[k];
    });

    // Handle location separately to avoid invalid geo object
    if (req.body.location) {
      if (req.body.location.city || req.body.location.area) {
        provider.location = {
          city: req.body.location.city || "",
          area: req.body.location.area || "",
        };
        // Only add geo if both coordinates are provided
        if (req.body.location.geo && req.body.location.geo.coordinates && req.body.location.geo.coordinates.length === 2) {
          provider.location.geo = {
            type: "Point",
            coordinates: req.body.location.geo.coordinates,
          };
        }
      }
    }

    if (req.file) {
      const field = req.body._uploadField === 'cover' ? 'coverPhoto' : 'profilePicture';
      provider[field] = `/uploads/${req.file.filename}`;
    }

    const saved = await provider.save();
    // Link to user if not set
    if (!req.user?.providerProfileId) {
      // Lazy import to avoid circular imports
      const { default: User } = await import("../models/User.js");
      const user = await User.findById(req.user._id);
      if (user) {
        user.providerProfileId = saved._id;
        user.role = 'provider';
        user.status = user.status || 'pending';
        await user.save();
      }
    }
    res.json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadProviderDocument = async (req, res) => {
  try {
    const providerId = req.user?.providerProfileId || req.params.id;
    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    provider.documents = provider.documents || [];
    provider.documents.push({ name: req.file.originalname, url: `/uploads/${req.file.filename}` });
    await provider.save();
    res.status(201).json({ success: true, data: provider.documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminVerifyProvider = async (req, res) => {
  try {
    const { status, note } = req.body; // pending | verified | unverified
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    if (status) provider.verificationStatus = status;
    if (note !== undefined) provider.verificationNote = note;
    if (status === "verified") provider.isVerified = true;
    if (status === "unverified" || status === "pending") provider.isVerified = false;
    await provider.save();
    res.json({ success: true, data: provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Live Availability for Service Provider
export const toggleAvailability = async (req, res) => {
  try {
    const providerId = req.user?.providerProfileId || req.params.id;
    const provider = await Provider.findById(providerId);
    
    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: "Provider not found" 
      });
    }

    // Check if user owns this provider profile
    if (req.user?.providerProfileId?.toString() !== providerId.toString() && !req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    provider.isAvailable = !provider.isAvailable;
    await provider.save();

    res.json({ 
      success: true, 
      data: { 
        isAvailable: provider.isAvailable,
        message: provider.isAvailable ? "You are now available for work" : "You are now unavailable"
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


