const express = require("express");
const router = express.Router();
const expressJoi = require("express-joi-validator");

const userController = require("../controllers/user");
const userValidator = require("../validators/user");

//create user
router.post("/", expressJoi(userValidator.create), userController.create);

router.get("/", userController.index);
router.put("/:userId", expressJoi(userValidator.update), userController.update);
router.delete(
  "/:userId",
  expressJoi(userValidator.delete),
  userController.delete
);

module.exports = router;
