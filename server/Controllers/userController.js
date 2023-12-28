const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
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

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { registerUser };
