const express = require("express");
const router = express.Router();

const { authMiddleware, checkRole } = require("../middleware/authMiddleware");

const UserController = require("../controller/user.controller");

router.get(
  "/getUser",
  authMiddleware,
  checkRole("admin"),
  UserController.getUser
);
router.get(
  "/getUser/:id",
  authMiddleware,
  checkRole("admin"),
  UserController.getUserById
);
router.get("/getUserByJwt", authMiddleware, UserController.getUserByJWT);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/update/:id", authMiddleware, UserController.update);
router.delete(
  "/delete/:id",
  authMiddleware,
  checkRole("admin"),
  UserController.delete
);
router.put("/updateRoleUser", authMiddleware, UserController.updateRoleUser);
module.exports = router;
