const {
  findGuest,
  createReturningGuest,
} = require("../controller/returningVisitors");

const router = require("express").Router();

router.get("/", findGuest);
router.post("/", createReturningGuest);

module.exports = router;
