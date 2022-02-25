const generateToken = require("../../helpers/generateToken");
const FrontDesk = require("../../models/FrontDesk");
const bcrypt = require("bcryptjs");
const Office = require("../../models/Company");

exports.createFrontDeskUser = async (req, res) => {
  try {
    const findUser = await FrontDesk.findOne({ email: req.body.email });

    if (findUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    req.body.password = hashedPassword;
    const createdFrontDesk = await FrontDesk.create(req.body);

    const officeDetails = await Office.findOneAndUpdate(
      { office: req.body.office },
      { $push: { frontdesk: createdFrontDesk._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getFrontDesk = async (req, res) => {
  try {
    const findFrontDesk = await FrontDesk.find();

    res.status(200).json({
      success: true,
      data: findFrontDesk,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.frontDeskLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter email and password" });
    }
    const findFrontDesk = await FrontDesk.findOne({ email });
    if (!findFrontDesk) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //check if password match
    const isMatch = bcrypt.compareSync(password, findFrontDesk.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    //generate token
    const token = generateToken(findFrontDesk);

    res.status(200).json({
      success: true,
      token,
      user: { ...findFrontDesk._doc, password: "" },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.deleteFrontDesk = async (req, res) => {
  try {
    const { id } = req.params;
    const findFrontDesk = await FrontDesk.findByIdAndDelete(id);
    if (!findFrontDesk) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted",
      data: findFrontDesk,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.updateFrontDesk = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await FrontDesk.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!updatedUser) {
      return res.status(400).json({ success: false, msg: "user not found" });
    }

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, msg: `An error just occured! ${err.message}` });
  }
};
