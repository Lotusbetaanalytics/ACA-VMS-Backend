const { findLogsByOffice, allLogs } = require("../controller/officeLogs");

const router = require("express").Router();

router.get("/", findLogsByOffice);
router.get("/all", allLogs);

module.exports = router;
