const express = require("express");
const router = express.Router();
const { addProblem, getProblems, getStats } = require("../controllers/problemControllers");
const authMiddleware = require("../middleware/auth");
router.post("/", authMiddleware, addProblem);
router.get("/", authMiddleware, getProblems);
router.get("/stats", authMiddleware, getStats);
module.exports = router;