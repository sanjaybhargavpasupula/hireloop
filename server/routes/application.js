const express = require("express");
const { getApplication, updateApplication, addApplication, deleteApplication } = require("../controllers/applicationController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
router.post("/", authMiddleware, addApplication);
router.get("/", authMiddleware, getApplication);
router.patch("/:id", authMiddleware, updateApplication);
router.delete("/:id", authMiddleware, deleteApplication);
module.exports = router;