const router = require("express").Router();

const {
  getStaffPrebooks,
  createPrebook,
  deletePrebook,
  frontCreatePrebook,
} = require("../controller/prebook");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getStaffPrebooks); //staff prebook logs
router.post("/", verifyToken, createPrebook);
router.post("/front", verifyToken, frontCreatePrebook);
router.delete("/:id", verifyToken, deletePrebook);

module.exports = router;
