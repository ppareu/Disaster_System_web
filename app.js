/**
 *
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 *    [프로젝트 명] : 재난 상황 대비 시스템
 *    [제작자] : 박현빈
 *    [제작일] : 2024. 06. 20
 *    [제품 문의] : bin000120@sillain.ac.kr
 *    [제작 파트]
 *    박현빈 : 풀스택 개발
 *
 *    제품 설명 : 위 제품은 재난 상황 대비 시스템 입니다.
 *    관리자 로그인 : admin 비밀번호 : admin
 *    위 계정으로 로그인 시 관리자로 로그인이 가능하며, 해당 시스템의 기능을 이용할 수 있습니다.
 *
 *    DB는 MYSQL을 사용했으며 사용자의 기록 및 정보를 DB에 저장해서 기록을 관리자 시스템쪽으로 보냅니다.
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 *
 */

const express = require("express");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser"); // cookie-parser 가져오기
const cron = require("node-cron");

// 실시간 업데이트
const http = require("http");
const socketIo = require("socket.io");

dotenv.config();

const { getMatterDataAndSave } = require("./middlewares/matterData");

const { sequelize } = require("./models");
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const communityRouter = require("./routes/community");
const airQualityRouter = require("./routes/airQuality");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set("port", process.env.PORT || 3000);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "js")));
app.use(express.static(path.join(__dirname, "css")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie-parser 사용
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET, // secret 설정
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// 1분마다 미세먼지 데이터 저장
cron.schedule("* * * * *", async () => {
  await getMatterDataAndSave();
  io.emit("updateAirQuality"); // 데이터가 저장되면 클라이언트에 업데이트 알림을 보냅니다.
});

app.use("/", indexRouter);
app.use("/", loginRouter);
app.use("/community", communityRouter);
app.use("/airQuality", airQualityRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

server.listen(app.get("port"), () => {
  console.log("http://localhost:3000");
  console.log(app.get("port"), "번 포트에서 대기 중");
});

// socket.io 이벤트 처리
io.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다.");
  socket.on("disconnect", () => {
    console.log("클라이언트가 연결 해제되었습니다.");
  });
});
