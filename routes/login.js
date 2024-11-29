const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const { username, password, phone, birthdate, location } = req.body;
  try {
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      username,
      password: hash,
      phone,
      birthdate,
      location,
    });
    res.status(201).send("회원가입 성공");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).send("아이디 또는 비밀번호가 잘못되었습니다.");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("아이디 또는 비밀번호가 잘못되었습니다.");
    }

    req.session.user = user; // 세션에 사용자 정보 저장
    res.status(200).send("로그인 성공");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(); // 세션 삭제
  res.redirect("/");
});

router.get("/auth/status", (req, res) => {
  if (req.session.user) {
    res.json({
      loggedIn: true,
      userId: req.session.user.id, // 로그인된 사용자의 ID 반환
      username: req.session.user.username,
    });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;
