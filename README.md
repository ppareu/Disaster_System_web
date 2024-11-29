
# 재난 상황 대비 시스템

> 대한민국에서 발생하는 재난 상황을 실시간으로 모니터링하고 사용자 간 소통과 재난 대비 교육을 제공하는 웹 애플리케이션.

---

## 프로젝트 개요

- **프로젝트명**: 재난 상황 대비 시스템
- **수행 기간**: 2024년 2월 ~ 6월
- **주요 기술 스택**:
  - **프론트엔드**: HTML, CSS, JavaScript, Kakao 지도 API, Chart.js
  - **백엔드**: Node.js, Express.js, Socket.IO
  - **데이터베이스**: MySQL, Sequelize ORM
  - **API**: 공공데이터포털(지진/미세먼지 API)

---

## 주요 기능

### 1. 실시간 재난 모니터링
- 공공데이터 지진 API를 통해 지진 발생 정보를 지도 상에 실시간으로 표시.
- 지진 발생 시간, 위치, 규모 등의 상세 정보 제공.

### 2. 미세먼지 실시간 모니터링 및 데이터 분석
- 공공데이터 미세먼지 API를 통해 지역별 미세먼지(PM10, PM2.5) 현황 제공.
- 날짜 및 시간별 데이터 검색 및 차트 시각화.

### 3. 사용자 로그인 및 커뮤니티
- **회원가입**: 사용자 정보를 데이터베이스에 저장.
- **로그인**: 암호화된 비밀번호로 인증.
- **커뮤니티**: 사용자 간 정보 공유 및 게시물 작성/삭제.

### 4. 관리자 권한
- 사용자 정보 관리 및 재난 관련 공지사항 작성 가능.

---

## 설치 및 실행 방법

### 1. 사전 요구 사항
- Node.js (>= 16.0)
- MySQL
- npm

### 3. 환경 변수 설정
- `.env` 파일을 프로젝트 루트 디렉토리에 생성:
  ```
  COOKIE_SECRET=your_secret_key
  DB_USERNAME=your_db_username
  DB_PASSWORD=your_db_password
  DB_DATABASE=your_database_name
  API_KEY=your_api_key
  MATTER_KEY=your_matter_key
  ```

### 4. 의존성 설치
```bash
npm install
```

### 5. 데이터베이스 초기화
- MySQL에 데이터베이스 생성 후, Sequelize CLI를 사용하여 마이그레이션 수행:
```bash
npx sequelize-cli db:migrate
```

### 6. 서버 실행
```bash
npm start
```
- 애플리케이션은 기본적으로 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

---

## 디렉토리 구조

```
disaster-preparedness-system/
├── config/                # 데이터베이스 설정
├── models/                # Sequelize 모델 정의
├── routes/                # API 라우트 정의
├── views/                 # Nunjucks 템플릿
├── public/                # 정적 파일 (CSS, JS 등)
├── middlewares/           # 미들웨어
├── .env                   # 환경 변수 파일
├── app.js                 # 메인 서버 파일
└── package.json           # 프로젝트 메타데이터 및 의존성
```

---

## 주요 코드 설명

### `app.js`
- Node.js 기반 Express 서버 설정 및 미들웨어 통합.
- Socket.IO를 통한 실시간 데이터 업데이트 구현.

### `routes/`
- `community.js`: 게시물 CRUD 기능 제공.
- `airQuality.js`: 미세먼지 데이터 저장 및 검색 API.
- `login.js`: 사용자 인증 및 세션 관리.

### `models/`
- `User`: 사용자 정보 저장.
- `AirQuality`: 미세먼지 데이터 저장.
- `Post`: 커뮤니티 게시글 관리.

---

## 사용된 API 및 라이브러리

- **공공데이터 API**:
  - [지진 API](https://www.data.go.kr/data/1360000/EqkInfoService.html)
  - [미세먼지 API](https://www.data.go.kr/data/15073861/openapi.do)
- **지도 서비스**: Kakao 지도 API
- **데이터 시각화**: Chart.js
- **백엔드 라이브러리**:
  - Express.js
  - Sequelize ORM
  - Socket.IO
  - Node-Cron

---

## 테스트

- **로그인 시스템 테스트**
  - 올바른 자격 증명으로 성공적으로 로그인.
  - 잘못된 자격 증명 시 적절한 오류 메시지 반환.
- **API 호출 및 데이터 저장**
  - 지진/미세먼지 데이터 호출 및 데이터베이스 저장 성공 여부 확인.
  - 과거 데이터 검색 및 차트 생성 테스트.

---

## 향후 개선 사항

1. 모바일 친화적인 UI/UX 구현.
2. 재난 경고 알림 기능 추가 (SMS 또는 푸시 알림).
3. 더 많은 공공 데이터를 활용한 서비스 확장.

---

## 기여자

- **박현빈**: 풀스택 개발
``` 
