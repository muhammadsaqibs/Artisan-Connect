import ServiceRequest from "../models/ServiceRequest.js";

export const createRequest = async (req, res) => {
  try {
    const body = { ...req.body };
    const doc = new ServiceRequest({
      ...body,
      customerId: req.user._id,
      status: "requested",
      timestampsMap: { requestedAt: new Date() },
    });
    await doc.save();
    res.status(201).json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const docs = await ServiceRequest.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: docs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getIncomingForProvider = async (req, res) => {
  try {
    const docs = await ServiceRequest.find({ providerId: req.query.providerId, status: { $in: ["requested", "accepted", "in_progress"] } }).sort({ createdAt: -1 });
    res.json({ success: true, data: docs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { action } = req.body; // accept | start | complete | cancel
    const doc = await ServiceRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Request not found" });

    const now = new Date();
    if (action === "accept") {
      doc.status = "accepted";
      doc.timestampsMap.acceptedAt = now;
    } else if (action === "start") {
      doc.status = "in_progress";
      doc.timestampsMap.startedAt = now;
    } else if (action === "complete") {
      doc.status = "completed";
      doc.timestampsMap.completedAt = now;
    } else if (action === "cancel") {
      doc.status = "cancelled";
      doc.timestampsMap.cancelledAt = now;
    }

    await doc.save();
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


