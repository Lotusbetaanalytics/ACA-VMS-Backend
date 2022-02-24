const { findLogsByOffice } = require("../controller/officeLogs");

const router = require("express").Router();

router.get("/", findLogsByOffice);

module.exports = router;
