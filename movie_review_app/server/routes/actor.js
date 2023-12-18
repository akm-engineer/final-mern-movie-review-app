const express = require("express");
const {
  createActor,
  updateActor,
  removeActor,
  searchActor,
  getLatestActors,
  getSingleActor,
  getActors,
} = require("../controllers/actor");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");

const router = express.Router();

// Create actor route
router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);

// Update actor route
router.post(
  "/update/:actorId",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);

// Delete actor route
router.delete("/:actorId", isAuth, isAdmin, removeActor);

// Search actor route
router.get("/search", isAuth, isAdmin, searchActor);

// Get latest actors route
router.get("/latest-uploads", getLatestActors);

// Get all actors route
router.get("/actors", getActors);

// Get single actor route
router.get("/single/:id", getSingleActor);

module.exports = router;
