const Office = require("../models/Company");
const Visitors = require("../models/Visitors");

exports.findLogsByOffice = async (req, res) => {
  try {
    const { q } = req.query;
    const office = await Office.find({})
      .populate({
        path: "visitor",
        populate: { path: "host", model: "Employee", select: "fullname" },
      })
      .sort({ _id: -1 });

    const filtered = office
      .filter(({ office }) => office === q)
      .sort((a, b) => {
        return a - b;
      });

    const { visitor } = filtered[0];

    return res.status(200).json({ data: visitor, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
exports.allLogs = async (req, res) => {
  try {
    const allVisitors = await Visitors.find({})
      .populate({
        path: "host",
        model: "Employee",
        select: "fullname",
      })
      .sort({ _id: -1 });

    return res.status(200).json({ data: allVisitors, success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
