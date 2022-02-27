const Employees = require("../../models/Employee");
const FrontDesk = require("../../models/FrontDesk");
const Visitor = require("../../models/Visitors");
const Office = require("../../models/Company");
const PreBook = require("../../models/PreBook");
const generateArrayOfDates = require("../../helpers/arrayofDates");
const { convertDate } = require("../../helpers/convertDateToLocalString");

//particular office data
exports.getFrontDeskDashboardData = async (req, res) => {
  try {
    const { from, to } = req.query; //query records by a specified date
    //   Find all visitors for today in a particular office
    const arrayDates = generateArrayOfDates(from, to);

    const findFrontDesk = await FrontDesk.findById(req.user);
    // const officeVisitors = await Office.find({
    //   office: findFrontDesk.office,
    // })
    //   .populate({
    //     path: "visitor",
    //     populate: { path: "host", model: "Employee", select: "fullname" },
    //   })
    //   .sort({ _id: -1 });

    const findVisitors = await Visitor.find().populate({
      path: "host",
      model: "Employee",
      select: "fullname office",
    });

    // const filtered = officeVisitors[0].visitor.filter(({ createdAt }) => {
    //   createdAt = convertDate(createdAt);
    //   return arrayDates.includes(createdAt);
    // });
    const filtered = findVisitors.filter(({ host, createdAt }) => {
      createdAt = convertDate(createdAt);
      return (
        host.office === findFrontDesk.office && arrayDates.includes(createdAt)
      );
    });

    //Find pending guests in an office
    const pendingGuests = filtered.filter(({ status, createdAt }) => {
      createdAt = convertDate(createdAt);
      return status == "Pending" && arrayDates.includes(createdAt);
    });

    //   Checked In Guests
    const checkedIn = filtered.filter(({ checkedIn, createdAt }) => {
      createdAt = convertDate(createdAt);
      return checkedIn === true && arrayDates.includes(createdAt);
    });

    //Checked Out Guests
    const checkedOut = filtered.filter(({ checkedOut, createdAt }) => {
      createdAt = convertDate(createdAt);
      return checkedOut === true && arrayDates.includes(createdAt);
    });

    //Prebooked guests
    const prebooked = await PreBook.find().populate({
      path: "host",
      model: "Employee",
      select: "fullname office",
    });

    const officePrebooks = prebooked.filter(({ host, createdAt }) => {
      createdAt = convertDate(createdAt);
      return (
        host.office === findFrontDesk.office && arrayDates.includes(createdAt)
      );
    });

    //find office staffs
    const officeStaffs = await Employees.find({ office: findFrontDesk.office });
    const frontDesks = await FrontDesk.find({ office: findFrontDesk.office });

    return res.status(200).json({
      data: {
        Guests: filtered,
        pendingGuests,
        checkedIn,
        checkedOut,
        prebooks: officePrebooks,
        staff: officeStaffs,
        admin: frontDesks,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

//all office data
exports.getAllOfficeData = async (req, res) => {
  try {
    const { from, to } = req.query; //query records by a specified date
    //   Find all visitors for today in a particular office
    const arrayDates = generateArrayOfDates(from, to);

    const allVisitors = await Visitor.find()
      .populate({
        path: "host",
        model: "Employee",
        select: "fullname",
      })
      .sort({ _id: -1 });

    const filtered = allVisitors.filter(({ createdAt }) => {
      createdAt = convertDate(createdAt);
      return arrayDates.includes(createdAt);
    });

    //Find pending guests in an office
    const pendingGuests = allVisitors.filter(({ status, createdAt }) => {
      createdAt = convertDate(createdAt);
      return status == "Pending" && arrayDates.includes(createdAt);
    });

    //   Checked In Guests
    const checkedIn = allVisitors.filter(({ checkedIn, createdAt }) => {
      createdAt = convertDate(createdAt);
      return checkedIn && arrayDates.includes(createdAt);
    });

    //Checked Out Guests
    const checkedOut = allVisitors.filter(({ checkedOut, createdAt }) => {
      createdAt = convertDate(createdAt);
      return checkedOut && arrayDates.includes(createdAt);
    });

    //Prebooked guests
    const prebooked = await PreBook.find({}).populate({
      path: "host",
      model: "Employee",
      select: "fullname office",
    });

    const filteredPrebooks = prebooked.filter(({ createdAt }) => {
      createdAt = convertDate(createdAt);
      return arrayDates.includes(createdAt);
    });

    //find office staffs
    const officeStaffs = await Employees.find({});
    const frontDesks = await FrontDesk.find({});

    return res.status(200).json({
      data: {
        Guests: filtered,
        pendingGuests,
        checkedIn,
        checkedOut,
        prebooks: filteredPrebooks,
        staff: officeStaffs,
        admin: frontDesks,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
