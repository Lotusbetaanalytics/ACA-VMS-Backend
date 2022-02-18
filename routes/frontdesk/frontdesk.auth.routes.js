const router = require("express").Router();
const {
  createFrontDeskUser,
  frontDeskLogIn,
  getFrontDesk,
  deleteFrontDesk,
  updateFrontDesk,
} = require("../../controller/frontdesk/frontdesk.auth.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.post("/auth", createFrontDeskUser); //create a new front desk personnel
router.post("/auth/login", frontDeskLogIn); //login a new front desk personnel

router.get("/", verifyToken, getFrontDesk); //get all front desk

router.delete("/:id", verifyToken, deleteFrontDesk); //delete a front desk personnel
router.patch("/:id", verifyToken, updateFrontDesk); //update a front desk personnel

module.exports = router;
