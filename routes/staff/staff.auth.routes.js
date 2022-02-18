const router = require("express").Router();
const {
  createStaff,
  findStaff,
  loginStaff,
  deleteStaff,
  updateStaff,
} = require("../../controller/staff/staff.auth.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.post("/", createStaff); //create a new staff
router.get("/", findStaff); //get a staff
router.post("/login", loginStaff); //login a staff
router.delete("/:id", verifyToken, deleteStaff); //login a staff
router.patch("/:id", verifyToken, updateStaff); //update a staff detail

module.exports = router;
