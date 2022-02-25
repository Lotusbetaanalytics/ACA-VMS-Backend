const Employees = require("../../models/Employee");
const FrontDesk = require("../../models/FrontDesk");
const Visitor = require("../../models/Visitors");
const Office = require("../../models/Company");
const PreBook = require("../../models/PreBook");

exports.getFrontDeskDashboardData = async (req, res) => {
  try {
    const { q } = req.query; //query records by a specified date
    //   Find all visitors for today in a particular office
    const findFrontDesk = await FrontDesk.findById(req.user);
    const officeVisitors = await Office.find({
      office: findFrontDesk.office,
    })
      .populate({
        path: "visitor",
        populate: { path: "host", model: "Employee", select: "fullname" },
      })
      .sort({ _id: -1 });

    let queryDate = new Date(q); //convert query date to date object

    queryDate = `${queryDate.getFullYear()}-${
      queryDate.getMonth() + 1
    }-${queryDate.getDate()}`; //get date (year-month-day)

    const filtered = officeVisitors[0].visitor.filter(({ createdAt }) => {
      createdAt = `${createdAt.getFullYear()}-${
        createdAt.getMonth() + 1
      }-${createdAt.getDate()}`;
      return createdAt === queryDate;
    });

    //Find pending guests in an office
    const pendingGuests = officeVisitors[0].visitor.filter(
      ({ status, createdAt }) => {
        createdAt = `${createdAt.getFullYear()}-${
          createdAt.getMonth() + 1
        }-${createdAt.getDate()}`;
        return status == "Pending" && createdAt === queryDate;
      }
    );

    //   Checked In Guests
    const checkedIn = officeVisitors[0].visitor.filter(
      ({ checkedIn, createdAt }) => {
        createdAt = `${createdAt.getFullYear()}-${
          createdAt.getMonth() + 1
        }-${createdAt.getDate()}`;
        return checkedIn === true && createdAt === queryDate;
      }
    );

    //Checked Out Guests
    const checkedOut = officeVisitors[0].visitor.filter(
      ({ checkedOut, createdAt }) => {
        createdAt = `${createdAt.getFullYear()}-${
          createdAt.getMonth() + 1
        }-${createdAt.getDate()}`;
        return checkedOut === true && createdAt === queryDate;
      }
    );

    //Prebooked guests
    const prebooked = await PreBook.find({}).populate({
      path: "host",
      model: "Employee",
      select: "fullname office",
    });

    const officePrebooks = prebooked.filter(({ host, createdAt }) => {
      createdAt = `${createdAt.getFullYear()}-${
        createdAt.getMonth() + 1
      }-${createdAt.getDate()}`;
      return host.office === findFrontDesk.office && createdAt === queryDate;
    });

    //find office staffs
    const officeStaffs = await Employees.find({ office: findFrontDesk.office });

    return res.status(200).json({
      data: {
        Guests: filtered,
        pendingGuests,
        checkedIn,
        checkedOut,
        prebooks: officePrebooks,
        staff: officeStaffs,
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
