const router = require("express").Router();

const {
  getFrontDeskDashboardData,
  getAllOfficeData,
} = require("../../controller/frontdesk/frontdesk.dashboard");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.get("/all", verifyToken, getFrontDeskDashboardData);
router.get("/central", verifyToken, getAllOfficeData);

module.exports = router;
