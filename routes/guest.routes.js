const {
  createVisitor,
  getPrebookVisitorByToken,
} = require("../controller/newGuest");
const {
  findGuest,
  createReturningGuest,
} = require("../controller/returningVisitors");

const router = require("express").Router();

//Returning Guest
router.get("/returning", findGuest);
router.post("/returning", createReturningGuest);

//New Guest
router.post("/new", createVisitor);
router.get("/", getPrebookVisitorByToken);

module.exports = router;
