import QuoteRequest from "../models/QuoteRequest.js";
import Provider from "../models/Provider.js";

// Create a new quote request (Customer)
export const createQuoteRequest = async (req, res) => {
  try {
    const { category, subCategory, jobDescription, preferredTime, location } = req.body;
    
    if (!category || !jobDescription) {
      return res.status(400).json({ 
        success: false, 
        message: "Category and job description are required" 
      });
    }

    const photos = req.files?.map(file => `/uploads/${file.filename}`) || [];

    const quoteRequest = new QuoteRequest({
      customerId: req.user._id,
      category,
      subCategory,
      jobDescription,
      photos,
      preferredTime,
      location,
      status: "pending",
    });

    await quoteRequest.save();
    res.status(201).json({ success: true, data: quoteRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get customer's quote requests
export const getMyQuoteRequests = async (req, res) => {
  try {
    const quoteRequests = await QuoteRequest.find({ customerId: req.user._id })
      .populate("quotes.providerId", "name avatar rating reliabilityScore")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: quoteRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Provider: Get quote requests matching their category within radius
export const getAvailableQuoteRequests = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // Default 5km radius
    
    // Get provider's profile
    const provider = await Provider.findById(req.user.providerProfileId);
    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: "Provider profile not found" 
      });
    }

    const filter = {
      status: "pending",
      category: provider.category,
    };

    // Optional location filter
    if (lat && lng && provider.location?.geo?.coordinates) {
      const [userLng, userLat] = provider.location.geo.coordinates;
      // Simple distance calculation (approximate)
      // In production, use proper geospatial query
      filter.$expr = {
        $lt: [
          {
            $sqrt: {
              $add: [
                { $pow: [{ $subtract: ["$location.lat", Number(lat)] }, 2] },
                { $pow: [{ $subtract: ["$location.lng", Number(lng)] }, 2] }
              ]
            }
          },
          Number(radius) / 111 // Rough km to degree conversion
        ]
      };
    }

    const quoteRequests = await QuoteRequest.find(filter)
      .populate("customerId", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: quoteRequests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Provider: Submit a quote for a request
export const submitQuote = async (req, res) => {
  try {
    const { quoteRequestId } = req.params;
    const { quoteAmount, message } = req.body;

    if (!quoteAmount) {
      return res.status(400).json({ 
        success: false, 
        message: "Quote amount is required" 
      });
    }

    const quoteRequest = await QuoteRequest.findById(quoteRequestId);
    if (!quoteRequest) {
      return res.status(404).json({ 
        success: false, 
        message: "Quote request not found" 
      });
    }

    if (quoteRequest.status !== "pending") {
      return res.status(400).json({ 
        success: false, 
        message: "Quote request is no longer available" 
      });
    }

    const quote = {
      providerId: req.user.providerProfileId,
      quoteAmount: Number(quoteAmount),
      message: message || "",
      quotedAt: new Date(),
      status: "pending",
    };

    quoteRequest.quotes.push(quote);
    quoteRequest.status = "quoted";
    await quoteRequest.save();

    res.json({ success: true, data: quoteRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Provider: Reject a quote request
export const rejectQuoteRequest = async (req, res) => {
  try {
    const { quoteRequestId } = req.params;
    
    const quoteRequest = await QuoteRequest.findById(quoteRequestId);
    if (!quoteRequest) {
      return res.status(404).json({ 
        success: false, 
        message: "Quote request not found" 
      });
    }

    // Just return success - rejection doesn't need to be tracked
    res.json({ success: true, message: "Quote request rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Customer: Accept a quote
export const acceptQuote = async (req, res) => {
  try {
    const { quoteRequestId, quoteId } = req.params;

    const quoteRequest = await QuoteRequest.findById(quoteRequestId);
    if (!quoteRequest) {
      return res.status(404).json({ 
        success: false, 
        message: "Quote request not found" 
      });
    }

    if (quoteRequest.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized" 
      });
    }

    const quote = quoteRequest.quotes.id(quoteId);
    if (!quote) {
      return res.status(404).json({ 
        success: false, 
        message: "Quote not found" 
      });
    }

    quote.status = "accepted";
    quoteRequest.status = "accepted";
    quoteRequest.acceptedQuoteId = quoteId;

    await quoteRequest.save();

    res.json({ success: true, data: quoteRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


