const { convertDate } = require("../../helpers/convertDateToLocalString");
const PreBook = require("../../models/PreBook");
const Visitors = require("../../models/Visitors");
const generateArrayOfDates = require("../../helpers/arrayofDates");
const sendEmail = require("../../config/mail");
const Employee = require("../../models/Employee");
const FrontDesk = require("../../models/FrontDesk");
const { renderTemplate } = require("../../utils/templates");
const path = require("path");

exports.findStaffGuests = async (req, res) => {
  try {
    const { from, to } = req.query; //query records by a specified date
    const arrayDates = generateArrayOfDates(from, to);

    const allVisitors = await Visitors.find({}).sort({ _id: -1 });

    const staffGuest = allVisitors.filter(({ host, createdAt }) => {
      createdAt = convertDate(createdAt);
      return host == req.user && arrayDates.includes(createdAt);
    });
    const pending = staffGuest.filter(({ createdAt, status }) => {
      createdAt = convertDate(createdAt);
      return status == "Pending" && arrayDates.includes(createdAt);
    });
    const checkedIn = staffGuest.filter(({ createdAt, checkedIn }) => {
      createdAt = convertDate(createdAt);
      return checkedIn && arrayDates.includes(createdAt);
    });

    const checkedOut = staffGuest.filter(({ createdAt, checkedOut }) => {
      createdAt = convertDate(createdAt);
      return checkedOut && arrayDates.includes(createdAt);
    });

    const staffPrebook = await PreBook.find({}).sort({ _id: -1 });
    const prebook = staffPrebook.filter((prebook) => {
      return prebook.host == req.user;
    });

    return res.status(200).json({
      success: true,
      guest: staffGuest,
      pending,
      checkedIn,
      checkedOut,
      prebook,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.guestApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await Visitors.findById(id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }
    visitor.status = "Approved";
    await visitor.save();

    const findHost = await Employee.findById(visitor.host);
    const findFrontDesk = await FrontDesk.find({ office: findHost.office });
    const host = `${req.protocol}://${req.hostname}`;
    const url = new URL(host);
    url.pathname = "/staff/guest";

    const emailTemplate = path.join(req.app.get("views"), "guestApproval.ejs");
    const content = renderTemplate(emailTemplate, {
      url: url.href,
      visitor: visitor.fullname,
      staff: findHost.fullname,
      frontdesk: findFrontDesk[0],
    });

    const options = {
      email: findFrontDesk[0].email,
      cc: findHost.email,
      subject: "Approval of Guest",
      message: "",
      html: content,
    };

    await sendEmail(options);

    return res.status(200).json({
      success: true,
      data: "Approved",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
exports.guestDecline = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await Visitors.findById(id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }
    visitor.status = "Rejected";
    await visitor.save();

    const findHost = await Employee.findById(visitor.host);
    const findFrontDesk = await FrontDesk.find({ office: findHost.office });
    const host = `${req.protocol}://${req.hostname}`;
    const url = new URL(host);
    url.pathname = "/staff/guest";

    const emailTemplate = path.join(req.app.get("views"), "guestRejection.ejs");
    const content = renderTemplate(emailTemplate, {
      url: url.href,
      visitor: visitor.fullname,
      staff: findHost.fullname,
      frontdesk: findFrontDesk[0],
    });

    const options = {
      email: findFrontDesk[0].email,
      cc: findHost.email,
      subject: "Approval of Guest",
      message: "",
      html: content,
    };

    await sendEmail(options);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: err.message,
    });
  }
};
exports.guestCheckOut = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await Visitors.findById(id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }
    visitor.checkedOut = true;
    await visitor.save();

    const findHost = await Employee.findById(visitor.host);
    const findFrontDesk = await FrontDesk.find({ office: findHost.office });
    const host = `${req.protocol}://${req.hostname}`;
    const url = new URL(host);
    url.pathname = "/staff/guest";

    const emailTemplate = path.join(req.app.get("views"), "checkOutNotice.ejs");
    const content = renderTemplate(emailTemplate, {
      url: url.href,
      visitor: visitor.fullname,
      staff: findHost.fullname,
    });

    const options = {
      email: findHost.email,
      cc: findFrontDesk[0].email,
      subject: "Check Out Notice",
      message: "",
      html: content,
    };

    await sendEmail(options);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
exports.guestCheckIn = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await Visitors.findById(id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }
    visitor.checkedIn = true;
    await visitor.save();

    const findHost = await Employee.findById(visitor.host);

    const findFrontDesk = await FrontDesk.find({ office: findHost.office });

    const host = `${req.protocol}://${req.hostname}`;
    const url = new URL(host);
    url.pathname = "/staff/guest";

    const emailTemplate = path.join(req.app.get("views"), "checkInNotice.ejs");
    const content = renderTemplate(emailTemplate, {
      url: url.href,
      visitor: visitor.fullname,
      staff: findHost.fullname,
    });

    const options = {
      email: findHost.email,
      cc: findFrontDesk[0].email,
      subject: "Check In Notice",
      message: "",
      html: content,
    };

    await sendEmail(options);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: err.message,
    });
  }
};
