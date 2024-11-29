const express = require("express");
const { Post, User } = require("../models");

const router = express.Router();

// 게시물 조회
router.get("/posts", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["username"],
      },
      order: [["createdAt", "DESC"]], // 게시물 생성 시간 내림차순 정렬
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 게시물 작성
router.post("/posts", async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send("로그인이 필요합니다.");
  }
  try {
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      userId: req.session.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 게시물 삭제
router.delete("/posts/:id", async (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send("로그인이 필요합니다.");
  }
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send("게시물을 찾을 수 없습니다.");
    }
    if (post.userId !== req.session.user.id) {
      return res.status(403).send("삭제 권한이 없습니다.");
    }
    await post.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
