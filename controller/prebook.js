const Prebook = require("../models/PreBook");
const Employees = require("../models/Employee");
const sendMail = require("../config/mail");
const generateTokenString = require("../helpers/prebookToken");

// @desc    Get all prebooks
// @route   GET    /api/v1/prebook
// @access  Private
exports.getAllPrebooks = async (req, res) => {
  const prebooks = await Prebook.find().populate({
    path: "host",
    select: "id firstName lastName email department floor officeNumber",
  });

  if (!prebooks) {
    return res.status(404).json({
      success: false,
      message: "There are no prebooks",
    });
  }
  res.status(200).json({
    success: true,
    data: prebooks,
  });
};
// @desc    Get all staff prebooks
// @route   GET    /api/v1/prebook
// @access  Private
exports.getStaffPrebooks = async (req, res) => {
  try {
    const prebooks = await Prebook.find({})
      .populate({
        path: "host",
        select: "_id, fullname",
        model: "Employee",
      })
      .sort({ _id: -1 });

    if (!prebooks) {
      return res.status(404).json({
        success: false,
        message: "There are no prebooks",
      });
    }

    const staffPrebooks = prebooks.filter(({ host }) => {
      return host._id == req.user;
    });

    res.status(200).json({
      success: true,
      data: staffPrebooks,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// @desc    Create prebook
// @route   POST    /api/v1/prebook
// @access  Private
exports.createPrebook = async (req, res) => {
  try {
    const newPrebook = await Prebook.create(req.body);

    if (!newPrebook) {
      res.status(400).json({
        success: false,
        message: "Invalid prebook details",
      });
    }

    newPrebook.token = generateTokenString();
    newPrebook.host = req.user;

    await newPrebook.save();

    const { fullname, email } = await Employees.findById(req.user);

    let htmlMessage = `

    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>

    .container{
      width: 100vw;
      height: 60vh;
      padding: 20px;
      grid-gap: 20px;
      border-radius: 5px;
      background: #007c64;
      color: #fff;
      font-family: 'Roboto', sans-serif;
      font-size: 1.2rem;
    }

    p, span{
      color: #fff;
    }


    </style>
  </head>
  <body>
    <div class="container">
        <h3 style="color:#fff">Hello, ${newPrebook.fullname}</h3>
        <p>
          Here are the details of the scheduled visit between you and
          ${fullname}
        </p>
        <ul style="color:#fff;">
          <li><p>Visitor's Name: ${newPrebook.fullname}</p></li>
          <li><p>Visitor's Entry Token: ${newPrebook.token}</p></li>
          <li><p>Visit Date: ${newPrebook.date}</p></li>
          <li><p>Visit Time: ${newPrebook.time}</p></li>
        </ul>
      <div>
        <span>NB: Visitors are to come with a valid ID and Visitor Entry Token.</span>
      </div>
        <h5 style="color:#f17230; padding:30px 0px;">Thank you</h5>
    </div>
  </body>
</html>
    `;
    let options = {
      email: email,
      cc: newPrebook.email,
      subject: "Confirmation of Visit",
      message:
        `Hello, <b>${fullname}</b> has scheduled you for a visit. ` +
        `Your token is <b>${newPrebook.token}</b>. Please show this token to the Reception upon arrival.`,
      html: htmlMessage,
    };
    await sendMail(options); // Send email with token to both parties

    res.status(201).json({
      success: true,
      message: "Prebook created successfully",
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.frontCreatePrebook = async (req, res) => {
  try {
    const newPrebook = await Prebook.create(req.body);

    if (!newPrebook) {
      res.status(400).json({
        success: false,
        message: "Invalid prebook details",
      });
    }

    newPrebook.token = generateTokenString();
    newPrebook.host = req.user;

    await newPrebook.save();

    const { fullname, email } = await Employees.findById(req.body.staffId);

    let htmlMessage = `

    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>

    .container{
      width: 100vw;
      height: 60vh;
      padding: 20px;
      grid-gap: 20px;
      border-radius: 5px;
      background: #007c64;
      color: #fff;
      font-family: 'Roboto', sans-serif;
      font-size: 1.2rem;
    }

    p, span{
      color: #fff;
    }


    </style>
  </head>
  <body>
    <div class="container">
        <h3 style="color:#fff">Hello, ${newPrebook.fullname}</h3>
        <p>
          Here are the details of the scheduled visit between you and
          ${fullname}
        </p>
        <ul style="color:#fff;">
          <li><p>Visitor's Name: ${newPrebook.fullname}</p></li>
          <li><p>Visitor's Entry Token: ${newPrebook.token}</p></li>
          <li><p>Visit Date: ${newPrebook.date}</p></li>
          <li><p>Visit Time: ${newPrebook.time}</p></li>
        </ul>
      <div>
        <span>NB: Visitors are to come with a valid ID and Visitor Entry Token.</span>
      </div>
        <h5 style="color:#f17230; padding:30px 0px;">Thank you</h5>
    </div>
  </body>
</html>
    `;
    let options = {
      email: email,
      cc: newPrebook.email,
      subject: "Confirmation of Visit",
      message:
        `Hello, <b>${fullname}</b> has scheduled you for a visit. ` +
        `Your token is <b>${newPrebook.token}</b>. Please show this token to the Reception upon arrival.`,
      html: htmlMessage,
    };
    await sendMail(options); // Send email with token to both parties

    res.status(201).json({
      success: true,
      message: "Prebook created successfully",
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// @desc    Get prebook by token
// @route   GET    /api/v1/prebook/:token
// @access  Private
exports.getPrebookByToken = async (req, res, next) => {
  const prebook = await Prebook.findOne({ token: req.params.token }).populate({
    path: "host",
    select: "id firstName lastName email department floor officeNumber",
  });

  if (!prebook || !prebook.isActive) {
    return res.status(404).json({
      success: false,
      message: "You have not been prebooked",
    });
  }

  res.status(200).json({
    success: true,
    data: prebook,
  });
};

// @desc    Update prebook by token
// @route   PUT    /api/v1/prebook/:token
// @access  Private
exports.updatePrebookByToken = async (req, res, next) => {
  const prebook = await Prebook.findOneAndUpdate(
    { token: req.params.token },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!prebook) {
    res.status(400).json({
      success: false,
      message: "Invalid prebook details",
    });
  }

  host = await User.findById(prebook.host);

  if (!prebook.timeIn || prebook.status == "Pending") {
    let htmlMessage = `
    <div>
            <h2>Hello, ${host.firstName},</h2>
            <h4>Your visitor, ${prebook.name}, has arrived</h4>
            </div>
        `;
    let options = {
      email: host.email,
      subject: "Arrival of Visitor",
      message: "Hello, your visitor, " + prebook.name + " has arrived.",
      html: htmlMessage,
    };
    await sendMail(options); // Send arrival email to host
  }

  timeNow = new Date().toLocaleString();

  if (!prebook.timeIn || prebook.status == "Pending") {
    prebook.timeIn = timeNow;
    prebook.status = "CheckedIn";
  } else {
    prebook.timeOut = timeNow;
    prebook.status = "CheckedOut";
    prebook.isActive = false;
  }
  prebook.save();

  res.status(200).json({
    success: true,
    data: prebook,
  });
};

// @desc    Delete prebook by token
// @route   DELETE    /api/v1/prebook/:token
// @access  Private
exports.deletePrebookByToken = async (req, res, next) => {
  const prebook = await Prebook.findOneAndDelete({ token: req.params.token });

  if (!prebook) {
    return res.status(404).json({
      success: false,
      message: "Prebook not found",
    });
  }
  res.status(200).json({
    success: true,
    data: {},
  });
};

// @desc    Get prebook by id
// @route   GET    /api/v1/prebooks/:id
// @access  Private
exports.getPrebook = async (req, res, next) => {
  const prebook = await Prebook.findById(req.params.id).populate({
    path: "host",
    select: "id firstName lastName email department floor officeNumber",
    model: "Employee",
  });

  if (!prebook) {
    return res.status(404).json({
      success: false,
      message: "Prebook not found",
    });
  }
  res.status(200).json({
    success: true,
    data: prebook,
  });
};

// @desc    Update prebook by id
// @route   PUT    /api/v1/prebooks/:id
// @access  Private
exports.updatePrebook = async (req, res) => {
  const prebook = await Prebook.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!prebook) {
    res.status(400).json({
      success: false,
      message: "Invalid prebook details",
    });
  }
  res.status(200).json({
    success: true,
    data: prebook,
  });
};

// @desc    Delete prebook by id
// @route   DELETE    /api/v1/prebooks/:id
// @access  Private
exports.deletePrebook = async (req, res, next) => {
  const prebook = await Prebook.findByIdAndDelete(req.params.id);
  if (!prebook) {
    return res.status(404).json({
      success: false,
      message: "Prebook not found",
    });
  }
  res.status(200).json({
    success: true,
    data: {},
  });
};
