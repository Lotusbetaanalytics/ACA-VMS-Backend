const {
  createVisitor,
  getPrebookVisitorByToken,
} = require("../controller/newGuest");
const {
  findGuest,
  createReturningGuest,
} = require("../controller/returningVisitors");
const {
  findStaffGuests,
  guestApproval,
  guestDecline,
  guestCheckIn,
  guestCheckOut,
} = require("../controller/staff/visitor.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = require("express").Router();

//Returning Guest
router.get("/returning", findGuest);
router.post("/returning", createReturningGuest);

//New Guest
router.post("/new", createVisitor);
router.get("/", getPrebookVisitorByToken);
router.patch("/approve/:id", verifyToken, guestApproval);
router.patch("/reject/:id", verifyToken, guestDecline);
router.patch("/checkin/:id", guestCheckIn);
router.patch("/checkout/:id", guestCheckOut);

//Staff Guest
router.get("/staff", verifyToken, findStaffGuests);

module.exports = router;
