const express = require("express");
const router = express.Router();
const { authMiddleware, checkRole }  = require('../middleware/authMiddleware');

const ManufacterController = require('../controller/manufacter.controller')


router.get('/getManufacterName', authMiddleware, checkRole('admin'), ManufacterController.getManufacterName);
router.get('/getManufacterNameById/:id', authMiddleware, checkRole('admin'),  ManufacterController.getManufacterNameById);
router.post('/createManufacterName', authMiddleware, checkRole('admin'),  ManufacterController.createManufacterName);
router.delete('/deleteManufacterName/:id', authMiddleware, checkRole('admin'),  ManufacterController.deleteManufacterName);
router.get('/getManufacterByCatId/:id', authMiddleware, checkRole("admin"), ManufacterController.getManufacterByCatId);
module.exports = router;