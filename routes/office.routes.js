const {
  createOffice,
  getAllOfficeData,
} = require("../controller/office.controller");

const router = require("express").Router();

router.post("/", createOffice);
router.get("/", getAllOfficeData);

module.exports = router;
