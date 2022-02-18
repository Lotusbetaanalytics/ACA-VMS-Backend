const {
  createOffice,
  getAllOfficeData,
  getAnOffice,
} = require("../controller/office.controller");

const router = require("express").Router();

router.post("/", createOffice);
router.get("/", getAllOfficeData);
router.get("/search", getAnOffice);

module.exports = router;
