const ReturningGuest = require("../models/ReturningVisitors");
const Visitors = require("../models/Visitors");

exports.findGuest = async (req, res) => {
  try {
    //find a guest
    const { phone } = req.query;

    const guest = await Visitors.find({ mobile: phone }).populate({
      path: "user",
      select: "fullname",
    });

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }

    return res.status(200).json({
      success: true,
      guest,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.createReturningGuest = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "No data sent",
      });
    }
    await ReturningGuest.create(req.body);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
