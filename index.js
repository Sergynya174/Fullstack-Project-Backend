import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { registerValidator } from "./validations/auth.js";
import UserShema from "./models/user.js";

mongoose
  .connect("mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB OK"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/login", (req, res) => {
  const token = jwt.sign({
    email: req.body.email,
    password: req.body.password,
  });
});

app.post("/register", registerValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const doc = new UserShema({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash: passwordHash,
  });

  const user = await doc.save();

  res.json(user);
});

app.listen(8080, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
