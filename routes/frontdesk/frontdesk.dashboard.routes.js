const router = require("express").Router();

const {
  getFrontDeskDashboardData,
} = require("../../controller/frontdesk/frontdesk.dashboard");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.get("/all", verifyToken, getFrontDeskDashboardData);

module.exports = router;
