const Office = require("../models/Company");
const cloudinary = require("cloudinary").v2;
const cloudinarySetup = require("../config/cloudinarysetup");
const fs = require("fs");

exports.createOffice = async (req, res) => {
  try {
    const { file, body } = req;
    console.log(file, body);

    const imageSizeLimit = 5 * 1024 * 1024; // 5Mb

    if (file.size >= imageSizeLimit) {
      return res.status(400).json({
        success: false,
        msg: `Uploaded image size limit is ${imageSizeLimit / 1024 / 1024}Mb`,
      });
    }

    //check if the file is an image
    if (!file.mimetype.startsWith("image")) {
      fs.unlinkSync(file.path); //delete the file from memory if it's not an image

      return res.status(400).json({
        success: false,
        msg: "Uploaded file is not an image",
      });
    }

    // upload file to cloud storage
    await cloudinarySetup();
    const uploadedImage = await cloudinary.uploader.upload(file.path, {
      eager: [
        { height: 100, width: 100, crop: "fill" },
        { height: 150, width: 150, crop: "fill" },
      ],
    });

    if (!uploadedImage) {
      return res.status(500).json({
        success: false,
        msg: "Something went wrong",
      });
    }
    const findOffice = await Office.findOne({ office: body.office });
    if (findOffice) {
      return res.status(401).json({
        success: false,
        message: "Office already exists",
      });
    }
    await Office.create({
      office: body.office,
      logo: uploadedImage.secure_url,
    });
    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.log(err.message);
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
      })
      .sort({ _id: -1 });

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
