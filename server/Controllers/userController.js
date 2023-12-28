const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  let user = await userModel.findOne({ email });

  if (user) return res.status(400).json("입력하신 이메일이 이미 존재합니다.");

  if (!name || !email || !password)
    return res.status(400).json("모든 정보를 입력해주세요.");

  if (!validator.isEmail(email))
    return res.status(400).json("유효한 이메일 형식이 아닙니다.");

  if (!validator.isStrongPassword(password))
    return res
      .status(400)
      .json("대소문자/특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요.");

  user = new userModel({ name, email, password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
};

module.exports = { registerUser };
