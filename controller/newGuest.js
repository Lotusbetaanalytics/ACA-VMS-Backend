const Visitor = require("../models/Visitors");
const Office = require("../models/Company");
const PreBook = require("../models/PreBook");
const Employees = require("../models/Employee");
const Notification = require("../models/Notification");
const sendMail = require("../config/mail");
const path = require("path");
const { renderTemplate } = require("../utils/templates");

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

    const officeUpdate = await Office.findOneAndUpdate(
      { office: req.body.office },
      { $push: { visitor: newVisitor._id } },
      { new: true }
    );

    if (!officeUpdate) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    const staff = await Employees.findById(req.body.host);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }
    const findOffice = await Office.find({ office: req.body.office }).populate({
      path: "frontdesk",
      select: "firstname email office",
    });

    if (!findOffice) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }
    const frontdesk = findOffice[0].frontdesk[0];
    const host = `${req.protocol}://${req.hostname}`;
    const url = new URL(host);
    url.pathname = "/staff/guest";
    const emailTemplate = path.join(req.app.get("views"), "newGuest.ejs");
    const content = renderTemplate(emailTemplate, {
      frontdesk,
      staff,
      newVisitor,
      url: url.href,
    });
    /*
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
        <h3 style="color:#fff">Hello, ${frontdesk.firstname}</h3>
        <p>
          ${staff.fullname} has a new visitor.
        </p>
        See the visitor's details below:
        <ul style="color:#fff;">
          <li>Name: ${newVisitor.fullname}</li>
          <li>Purpose of visit: ${newVisitor.purpose}</li>
        </ul>
        <h4>Visitor's Photo</h4>
        <img src="${req.body.photo}" style='width:200px; height:300px' alt="visitor photo"/>
    </div>
  </body>
</html>
    `;
    */
    const options = {
      email: frontdesk.email,
      cc: staff.email,
      subject: "New Visitor",
      message: "",
      html: content,
    };

    const alert = new Notification({ notify: "New Guest Alert!" });
    await sendMail(options);
    await alert.save();

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ message: "An error occured! Check your logs." });
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
