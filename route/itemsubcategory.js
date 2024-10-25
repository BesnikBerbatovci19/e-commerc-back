const express = require("express");
const router = express.Router();

const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const ItemSubCategoryController = require("../controller/itemsubcategory.controller");

router.get(
  "/getItemSubCategory",
  authMiddleware,
  checkRole("admin", "user"),
  ItemSubCategoryController.getItemSubCategory
);
router.get(
  "/getItemSubCategory/:id",
  ItemSubCategoryController.getItemSubCategoryById
);
router.post(
  "/createItemSubCategory",
  authMiddleware,
  checkRole("admin"),
  ItemSubCategoryController.createItemSubCategory
);
router.delete(
  "/deleteItemSubCategory/:id",
  authMiddleware,
  checkRole("admin"),
  ItemSubCategoryController.deleteItemSubCategory
);

module.exports = router;
