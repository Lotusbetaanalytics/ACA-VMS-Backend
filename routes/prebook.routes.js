const router = require("express").Router();

const { getStaffPrebooks, createPrebook } = require("../controller/prebook");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getStaffPrebooks); //staff prebook logs
router.post("/", verifyToken, createPrebook);

module.exports = router;
