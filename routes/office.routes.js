const {
  createOffice,
  getAllOfficeData,
  getAnOffice,
} = require("../controller/office.controller");
const upload = require("../config/multersetup");
const router = require("express").Router();

router.post("/", upload.single("logo"), createOffice);
router.get("/", getAllOfficeData);

router.get("/search", getAnOffice);

module.exports = router;
