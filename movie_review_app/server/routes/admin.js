const { getAppInfo, getMostRated } = require("../controllers/admin");
const { isAuth, isAdmin } = require("../middlewares/auth");

const router = require("express").Router();

// Route to get application information (requires authentication and admin role)
router.get("/app-info", isAuth, isAdmin, getAppInfo);

// Route to get the most rated content (requires authentication and admin role)
router.get("/most-rated", isAuth, isAdmin, getMostRated);

module.exports = router;
