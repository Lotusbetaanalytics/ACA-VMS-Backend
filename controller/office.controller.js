const Office = require("../models/Company");

exports.createOffice = async (req, res) => {
  try {
    const office = await Office.create({ office: req.body.office });
    return res.status(201).json({
      success: true,
      data: office,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getAllOfficeData = async (req, res) => {
  try {
    const office = await Office.find({})
      .populate({
        path: "frontdesk",
        model: "Frontdesk",
      })
      .populate({
        path: "staff",
        model: "Employee",
      })
      .populate({
        path: "visitor",
        model: "Guest",
      });

    return res.status(200).json({
      success: true,
      data: office,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getAnOffice = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return;
    }
    const offices = await Office.find({});
    const office = offices.filter((office) => {
      return office.office.toLowerCase().includes(q.toLowerCase());
    });

    return res.status(200).json({
      success: true,
      data: office,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
