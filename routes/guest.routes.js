const {
  createVisitor,
  getPrebookVisitorByToken,
} = require("../controller/newGuest");
const {
  findGuest,
  createReturningGuest,
} = require("../controller/returningVisitors");
const { findStaffGuests } = require("../controller/staff/visitor.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = require("express").Router();

//Returning Guest
router.get("/returning", findGuest);
router.post("/returning", createReturningGuest);

//New Guest
router.post("/new", createVisitor);
router.get("/", getPrebookVisitorByToken);

//Staff Guest
router.get("/staff", verifyToken, findStaffGuests);

module.exports = router;
