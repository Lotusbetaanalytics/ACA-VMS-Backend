const Office = require("../models/Company");

exports.findLogsByOffice = async (req, res) => {
  try {
    const { q } = req.query;
    const office = await Office.find({})
      .populate({
        path: "visitor",
        populate: { path: "host", model: "Employee", select: "fullname" },
      })
      .sort({ _id: -1 });

    if (!q) {
      return res.status(200).json({
        success: true,
        data: office,
      });
    }

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
