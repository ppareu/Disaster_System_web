const express = require("express");
const router = express.Router();

// 메인 페이지 라우트 설정
router.get("/", (req, res) => {
  res.render("main");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/community", (req, res) => {
  res.render("community");
});

router.get("/iotclient", (req, res) => {
  res.render("iotclient");
});

module.exports = router;
