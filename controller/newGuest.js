const Visitor = require("../models/Visitors");
const Office = require("../models/Company");
const PreBook = require("../models/PreBook");

exports.findAllGuest = async (req, res) => {
  try {
    //find all visitors
    const allGuest = await Visitor.find({}).populate({
      path: "user",
      select: "fullname company email mobile",
    });

    return res.status(200).json({
      success: true,
      allVisitors: allGuest,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.createVisitor = async (req, res) => {
  try {
    const newVisitor = await Visitor.create(req.body);

    await Office.findOneAndUpdate(
      { office: req.body.office },
      { $push: { visitor: newVisitor._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully created",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPrebookVisitorByToken = async (req, res) => {
  try {
    const { token } = req.query;
    const foundPreBooked = await PreBook.findOne({ token }).populate({
      path: "host",
      select: "fullname",
      model: "Employee",
    });
    if (!foundPreBooked) {
      return res.status(401).json({
        success: false,
        message: "Wrong token",
      });
    }
    if (!foundPreBooked.isActive) {
      return res.status(404).json({
        success: false,
        message: "Prebook checked out or expired!",
      });
    }
    foundPreBooked.isActive = false;
    await foundPreBooked.save();
    return res.status(200).json({
      success: true,
      data: foundPreBooked,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
