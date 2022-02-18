const ReturningGuest = require("../models/ReturningVisitors");

exports.findGuest = async (req, res) => {
  try {
    //find a guest
    const { fullname } = req.query;

    const guest = await ReturningGuest.find({}).populate({
      path: "user",
      select: "fullname company email mobile",
    });

    if (!fullname) {
      return res.status(200).json({
        success: true,
        guest,
      });
    }

    const guestFound = guest.filter(({ user }) =>
      user.fullname.toLowerCase().includes(fullname.toLowerCase())
    );

    return res.status(200).json({
      success: true,
      guest: guestFound,
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
    const returningVisitor = await ReturningGuest.create(req.body);
    return res.status(200).json({
      success: true,
      returningVisitor,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
