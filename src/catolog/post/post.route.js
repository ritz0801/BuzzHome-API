var express = require("express");
var router = express.Router();
import * as PostController from "./post.controller";

import Email from '../../utils/mailer'

router.get("/:id", PostController.getById);
router.get("/", PostController.getAll);
router.delete("/delete/:id", PostController.deleteById);

router.post("/create", PostController.createItem);
router.put("/update/:id", PostController.updateItem);

router.post("/filter", PostController.filter);
// update count watch phone in post
router.put("/count/:id", PostController.updateCount);

router.get("/username/:username", PostController.getByUsername);



module.exports = router;
