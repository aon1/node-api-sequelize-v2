const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/brand");

router.get("/", BrandController.index);
router.post("/", BrandController.create);
router.put("/:brandId", BrandController.update);
router.delete("/:brandId", BrandController.delete);

module.exports = router;
