import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";

export const register = async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username: username });

  if (user) {
    return res.json({ message: "User Already Exists!" });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPass });
  try {
    await newUser.save();
    res.status(201).json({ success: true, data: "newUser" });
  } catch (error) {
    console.log("Error in create user!");
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username: username });

  if (!user) {
    return res.json({ message: "User Doesn't Exists!" });
  }

  const isPassValid = await bcrypt.compare(password, user.password);

  if (!isPassValid) {
    return res.json({ message: "Incorrect Username or Password!" });
  }

  const token = jwt.sign({ id: user._id }, "secret");
  try {
    res.status(201).json({ token, userID: user._id });
  } catch (error) {
    console.log("Error!", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
