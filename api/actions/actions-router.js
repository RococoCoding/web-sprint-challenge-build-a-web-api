const express = require("express");
const { get, insert, update, remove } = require("./actions-model");
const projectsModel = require("../projects/projects-model");

const router = express.Router();

router.get("/", (req, res) => {
  get()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json(err.message);
    })
});
router.get("/:id", validateActionsID, (req, res) => {
  res.status(200).json(res.actions);
});
router.post("/", [validateActionsID, validateActionBody, validateProjectsID], (req, res) => {
  insert(req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500)
    })
});
router.put("/:id", [validateActionsID, validateActionBody, validateProjectsID], (req, res) => {
  update(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500);
    })
})
router.delete("/:id", [validateActionsID], (req, res) => {
  remove(req.params.id)
    .then(data => {
      res.status(200).json(`Action deleted`);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500)
    })
})

function validateActionsID(req, res, next) {
  get(req.params.id)
    .then(data => {
      if (data) {
        res.actions = data;
        next();
      } else {
        res.status(404).json(`No action found`);
      }
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json(err.message);
    })
};
function validateActionBody(req, res, next) {
  
  const bodyKeys = Object.keys(req.body);
  console.log(!bodyKeys.includes("project_id"))
  if (!req.body) {
    res.status(400).json(`Please include a body.`);
  } else if (!bodyKeys.includes("project_id") || !bodyKeys.includes("description") || !bodyKeys.includes("notes") || !bodyKeys.includes("completed")) {
    res.status(400).json(`Please include project_id, description, notes, completed fields`);
  } else if (typeof req.body.project_id !== "number") {
    res.status(400).json(`project_id must be of type number`);
  } else if (typeof req.body.description !== "string") {
    res.status(400).json(`description must be of type string`);
  } else if (typeof req.body.notes !== "string") {
    res.staus(400).json(`notes must be of type string`)
  } else if (typeof req.body.completed !== "boolean") {
    res.status(400).json(`completed must be of type boolean`);
  } else if (req.body.description.length > 128) {
    res.status(400).json(`description must be less than 129 characters`);
  }
  next();
}
function validateProjectsID(req, res, next) {
  projectsModel.get(req.body.project_id)
    .then(data => {
      if (data) {
        next();
      } else res.status(404).json(`No project was found.`);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json(`Error retrieving project with id ${req.body.project_id}`);
    })
}
module.exports = router;

// {project_id: required, num, exists
// description: required, str, 128 chars long max
// notes: required, str
// completed: boolean, required
// }