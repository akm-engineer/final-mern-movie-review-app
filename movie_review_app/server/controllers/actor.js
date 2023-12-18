const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const {
  sendError,
  uploadImageToCloud,
  formatActor,
} = require("../utils/helper");
const cloudinary = require("../cloud");

// Controller to create a new actor
exports.createActor = async (req, res) => {
  // Extracting data from the request body
  const { name, about, gender } = req.body;
  const { file } = req;

  // Creating a new Actor instance
  const newActor = new Actor({ name, about, gender });

  // If an image file is provided, upload it to the cloud and set the avatar field
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    newActor.avatar = { url, public_id };
  }

  // Save the new actor to the database
  await newActor.save();

  // Respond with the created actor in a formatted way
  res.status(201).json({ actor: formatActor(newActor) });
};

// Controller to update an existing actor
exports.updateActor = async (req, res) => {
  // Extracting data from the request body and parameters
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  // Validate actorId
  if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");

  // Find the actor by ID
  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid request, record not found!");

  // Store the public_id of the existing avatar
  const public_id = actor.avatar?.public_id;

  // Remove old image if there was one
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  // Upload new avatar if there is one
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    actor.avatar = { url, public_id };
  }

  // Update actor information
  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  // Save the updated actor to the database
  await actor.save();

  // Respond with the updated actor in a formatted way
  res.status(201).json({ actor: formatActor(actor) });
};

// Controller to remove an actor
exports.removeActor = async (req, res) => {
  // Extracting actorId from parameters
  const { actorId } = req.params;

  // Validate actorId
  if (!isValidObjectId(actorId)) return sendError(res, "Invalid request!");

  // Find the actor by ID
  const actor = await Actor.findById(actorId);
  if (!actor) return sendError(res, "Invalid request, record not found!");

  // Store the public_id of the avatar
  const public_id = actor.avatar?.public_id;

  // Remove old image if there was one
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud!");
    }
  }

  // Delete the actor from the database
  await Actor.findByIdAndDelete(actorId);

  // Respond with a success message
  res.json({ message: "Record removed successfully." });
};

// Controller to search for actors by name
exports.searchActor = async (req, res) => {
  // Extracting name from query parameters
  const { name } = req.query;

  // Validate name
  if (!name.trim()) return sendError(res, "Invalid request");

  // Perform a case-insensitive search for actors with matching names
  const result = await Actor.find({
    name: { $regex: name, $options: "i" },
  });

  // Format the results and respond
  const actors = result.map((actor) => formatActor(actor));
  res.json({ results: actors });
};

// Controller to get the latest actors
exports.getLatestActors = async (req, res) => {
  // Fetch the latest 12 actors based on a key (assuming key is a property in the model)
  const result = await Actor.find().sort("-key").limit(12);

  // Format the results and respond
  const actors = result.map((actor) => formatActor(actor));
  res.json(actors);
};

// Controller to get a single actor by ID
exports.getSingleActor = async (req, res) => {
  // Extracting actorId from parameters
  const { id } = req.params;

  // Validate actorId
  if (!isValidObjectId(id)) return sendError(res, "Invalid request!");

  // Find the actor by ID
  const actor = await Actor.findById(id);
  if (!actor) return sendError(res, "Invalid request, actor not found!", 404);

  // Respond with the formatted actor
  res.json({ actor: formatActor(actor) });
};

// Controller to get a paginated list of actors
exports.getActors = async (req, res) => {
  // Extracting pagination parameters from query
  const { pageNo, limit } = req.query;

  // Fetch actors based on pagination parameters
  const actors = await Actor.find({})
    .sort("-key")
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  // Format the results and respond
  const profiles = actors.map((actor) => formatActor(actor));
  res.json({ profiles });
};
