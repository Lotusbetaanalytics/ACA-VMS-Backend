const Visitors = require("../../models/Visitors");

exports.findStaffGuests = async (req, res) => {
  try {
    const allVisitors = await Visitors.find({}).sort({ _id: -1 });

    const staffGuest = allVisitors.filter((visitor) => {
      return visitor.host == req.user;
    });

    return res.status(200).json({
      success: true,
      data: staffGuest,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.guestApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await Visitors.findById(id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }
    visitor.status = "Approved";
    await visitor.save();

    return res.status(200).json({
      success: true,
      data: "Approved",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
exports.guestDecline = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await Visitors.findById(id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }
    visitor.status = "Rejected";
    await visitor.save();

    return res.status(200).json({
      success: true,
      data: "Rejected",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
