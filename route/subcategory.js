const express = require('express');
const router = express.Router();


const { authMiddleware, checkRole }  = require('../middleware/authMiddleware');
const SubCategoryController = require('../controller/subcategory.controller');
router.get("/getSubCategory", authMiddleware,  SubCategoryController.getSubCategory);
router.get("/getSubCategory/:id", authMiddleware,  SubCategoryController.getSubCategoryById);
router.post("/createSubCategory", authMiddleware, checkRole('admin'), SubCategoryController.createSubCategory);
router.put("/update/:id", authMiddleware, checkRole('admin'), SubCategoryController.update);
router.delete("/delete/:id", authMiddleware, checkRole('admin'), SubCategoryController.delete);

module.exports = router;