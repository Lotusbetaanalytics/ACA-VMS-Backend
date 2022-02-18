const generateToken = require("../../helpers/generateToken");
const Staff = require("../../models/Employee");
const bcrypt = require("bcryptjs");
const Office = require("../../models/Company");

exports.createStaff = async (req, res) => {
  try {
    const findUser = await Staff.findOne({ email: req.body.email });

    if (findUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const createdStaff = await Staff.create(req.body);

    await Office.findOneAndUpdate(
      { office: req.body.office },
      { $push: { staff: createdStaff._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.findStaff = async (req, res) => {
  try {
    const { q } = req.query;

    const findStaff = await Staff.find();
    if (!q) {
      return res.status(200).json({
        success: true,
        data: findStaff,
      });
    }

    const filtered = findStaff.filter((item) => {
      return item.fullname.toLowerCase().includes(q.toLowerCase());
    });

    if (!filtered) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: filtered,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await Staff.findOne({ email });
    if (!findUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    const token = generateToken(findUser);
    return res.status(200).json({
      success: true,
      data: { ...findUser._doc, password: "" },
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: deletedStaff,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await Staff.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
      returnOriginal: false,
    });

    if (!updatedUser) {
      return res.status(400).json({ success: false, msg: "user not found" });
    }

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: `An error just occured! ${err.message}`,
    });
  }
};
