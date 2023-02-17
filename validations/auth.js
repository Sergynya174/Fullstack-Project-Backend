import { body } from "express-validator";

export const registerValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть не менее 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Укадите имя").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка").optional().isURL(),
];
