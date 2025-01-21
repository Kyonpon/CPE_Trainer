import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import {
  register,
  login,
  checkAdmin,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/checkadmin/:id", checkAdmin);

export { router as UserAPI };
