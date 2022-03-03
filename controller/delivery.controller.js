const Delivery = require("../models/Delivery");

exports.createDelivery = async (req, res) => {
  try {
    const newVisitor = await Delivery.create(req.body);

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
    const options = {
      email: frontdesk.email,
      cc: staff.email,
      subject: "You Have a Delivery",
      message: "",
      html: content,
    };

    await sendMail(options);

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
