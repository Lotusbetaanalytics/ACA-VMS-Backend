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
