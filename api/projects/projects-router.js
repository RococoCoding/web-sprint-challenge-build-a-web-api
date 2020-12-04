const express = require("express");
const { get, insert, update, getProjectActions, remove } = require("./projects-model");

const router = express.Router();

router.get("/", validateProjectID, (req, res) => {
  res.status(200).json(res.data);
});

router.get("/:id", validateProjectID, (req, res) => {
  res.status(200).json(res.data);
});

router.post("/", [validateProjectBody], (req, res) => {
  insert(req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", [validateProjectID, validateProjectBody], (req, res) => {
  update(req.params.id, req.body)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500);
    });
});

router.delete("/:id", [validateProjectID], (req, res) => {
  remove(req.params.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500);
    });
});

router.get("/:id/actions", [validateProjectID], (req, res) => {
  getProjectActions(req.params.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err)
      res.status(500);
    });
});

function validateProjectID(req, res, next) {
  get(req.params.id)
    .then(data => {
      if (data) {
        res.data = data;
        next();
      } else {
        res.status(404).json(`no project found.`);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(`err checking if project exists`);
    })
}

function validateProjectBody(req, res, next) {
  if (!req.body) {
    res.status(400).json(`Missing project body.`);
  }
  if (req.body.completed) {
    if (typeof req.body.completed !== "boolean") {
      res.status(400).json(`completed field must be boolean`);
    }
  }
  if (!req.body.name) {
    res.status(400).json(`Missing name field`);
    if (typeof req.body.name !== "string") {
      res.status(400).json(`name field must be string`);
    }
  }
  if (!req.body.description) {
    res.status(400).json(`Missing description field`);
    if (typeof req.body.description !== "string") {
      res.status(400).json(`description field must be string`);
    }
  }
  if (req.body.project_id) {
    res.status(400).json(`Do not include project_id in your body`)
  }
  next();
}



module.exports = router;