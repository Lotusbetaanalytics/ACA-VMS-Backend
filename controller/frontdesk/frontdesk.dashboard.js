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

    queryDate = queryDate.toLocaleDateString(); //get date (year-month-day)

    const filtered = officeVisitors[0].visitor.filter(({ createdAt }) => {
      createdAt = new Date(createdAt).toLocaleDateString();
      return createdAt === queryDate;
    });

    //Find pending guests in an office
    const pendingGuests = officeVisitors[0].visitor.filter(
      ({ status, createdAt }) => {
        createdAt = new Date(createdAt).toLocaleDateString();
        return status == "Pending" && createdAt === queryDate;
      }
    );

    //   Checked In Guests
    const checkedIn = officeVisitors[0].visitor.filter(
      ({ checkedIn, createdAt }) => {
        createdAt = new Date(createdAt).toLocaleDateString();
        return checkedIn === true && createdAt === queryDate;
      }
    );

    //Checked Out Guests
    const checkedOut = officeVisitors[0].visitor.filter(
      ({ checkedOut, createdAt }) => {
        createdAt = new Date(createdAt).toLocaleDateString();
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
      createdAt = new Date(createdAt).toLocaleDateString();
      return host.office === findFrontDesk.office && createdAt === queryDate;
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
