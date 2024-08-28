const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/upload/uploadMiddleware');
const ProducController = require('../controller/product.controller');

router.get('/getProduct', authMiddleware, checkRole('admin'), ProducController.getProduct);
router.get('/getProduct/:id', authMiddleware, checkRole('admin', 'user'), ProducController.getProductById);
router.post('/createProduct', authMiddleware, checkRole('admin'), uploadMiddleware,  ProducController.create);
router.put('/update/:id', authMiddleware, checkRole('admin', 'user'), uploadMiddleware, ProducController.update);
router.delete('/delete/:id', authMiddleware, checkRole('admin', 'user'), ProducController.delete);
router.delete('/deletePhotoProduct/:id/:idPhoto', authMiddleware, checkRole('admin', 'user'), ProducController.deletePhoto);
router.put('/setDealsOfTheWeek/:id', authMiddleware, checkRole('admin'), ProducController.updateDealsOfTheWeek);
router.post('/createSpecificationProduct', authMiddleware, checkRole('admin'), ProducController.CreateSpecification);
router.delete('/deleteSpecificationProduct/:id', authMiddleware, checkRole('admin'), ProducController.deleteSpecificationProduct);

// product user
router.post('/createProductUser', authMiddleware, checkRole('user'), uploadMiddleware, ProducController.createProductUser);
router.get('/getUserProduct', authMiddleware, checkRole('user'), ProducController.getProductUser);


router.post("/getProductByCSV", ProducController.getProductByCSV);
router.get('/getSearchProduct/:slug', ProducController.getSearchProduct);
router.get('/getSearchItemProduct/:slug', ProducController.getSearchItemProduct);
router.get('/getProductByDealsOfTheWeek', ProducController.getProductByDealsOfTheWeek);
router.get('/getAllProduct', ProducController.getAllProduct);
router.get('/getSingelProduct/:slug', ProducController.getSingelProduct)
router.get('/getDiscountProcut', ProducController.getDiscountProcut)
router.get('/getProductByCategory/:slug', ProducController.getProductByCategory);
router.get('/countProductCategory/:category_id', ProducController.countProductCategory);
router.get('/countProductSubCategory/subcategory_id', ProducController.countProductSubCategory);
router.get('/searchProduct', ProducController.searchProduct);
router.get('/getSearchGlobalPorduct', ProducController.getSearchGlobalPorduct);
module.exports = router