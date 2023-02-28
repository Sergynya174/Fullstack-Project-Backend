import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import fs from "fs";

import {
  registerValidator,
  loginValidator,
  postCreateValidator,
} from "./validations.js";
import { checkAuth, validationErrors } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect("mongodb://localhost:27017/mydb")
  .then(() => console.log("DB OK"))
  .catch((err) => console.log(err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cd) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cd(null, "uploads");
  },

  filename: (_, file, cd) => {
    cd(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/login", loginValidator, validationErrors, UserController.login);
app.post(
  "/register",
  registerValidator,
  validationErrors,
  UserController.register
);
app.get("/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll);
app.get("/tags", PostController.getLastTags);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidator,
  validationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidator,
  validationErrors,
  PostController.update
);

app.listen(process.env.PORT || 8080, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
