# 나의 중고 애물단지

[Notion (ERD, API 명세서)](https://www.notion.so/65b35cf226794ceb91b8dbf4a5a46a2f)

## 프로젝트 소개

나의 중고 애물단지를 줄여서 나중애라는 중고마켓 서비스를 제작합니다.<br>
사용자들은 회원가입 후 중고 상품들을 게시할 수 있으며, 구매를 희망할 경우 한별은행이라는 가상 은행의 입출금 서비스를 통해 실제 은행API를 연동한 로직처럼 구현할 예정입니다.

<br>

## 기술 스택

- Nest.js
- TypeORM (Mysql)
- aws S3
- 네이버 클라우드 플랫폼 SMS API
- EJS/CSS (Bootstrap)

<br>

## 참여자 구성

- 인한별 (리더)
- 심재두 (부리더)
- 이재광 (팀원)
- 김진경 (팀원)

<br>

## 배포 환경

- 미정

<br>

## 구현

- 로그인/회원가입
- 접근권한 미들웨어 및 가드
- 관리자 페이지 (카테고리 관리, 사용자 관리, 게시판 관리, 상품 관리)
- 사용자 정보 (수정, 탈퇴)
- 상품 등록, 수정, 삭제
- 메인 페이지 (인기 상품, 전체 및 카테고리 별 최근 상품 목록)
- 상품 찜 (추가, 취소, 목록관리)
- 결제 시스템 연동 (한별은행)
- 거래 시작 후 거래 상태관리
- 거래 종료 후 리뷰 (CRUD)
- 게시판 생성 (공지사항, 1:1 문의)
- 게시물 관리 (CRUD)
- 게시물 내 댓글 관리 (CRUD)

---

## 프로젝트 설정

### 라이브러리 설치 목록

```bash
npm install @nestjs/config
npm install @nestjs/typeorm typeorm mysql2
npm install class-validator class-transformer
npm install @nestjs/jwt
npm install bcrypt
npm install ejs
npm install multer multer-s3 aws-sdk @types/uuidv4 @types/multer
npm install cookie-parser
npm install typeorm-naming-strategies
npm install @nestjs/cache-manager cache-manager
npm install cache-manager-redis-store
npm install crypto
npm install @slack/web-api moment node-schedule
npm install -D @types/node-schedule
npm install @nestjs/mongoose mongoose
npm install --save @nestjs/websockets @nestjs/platform-socket.io
npm install socket.io
npm install socket.io-client
npm install @nestjs/platform-ws
npm install @nestjs/platform-socket.io
```

<br>

### .prettierrc 설정

```bash
/* add options */
  "printWidth": 170,
  "tabWidth": 2,
```

<br>

### .eslintrc.js 설정

```bash
/* add rules */
'prettier/prettier': ['error', { printWidth: 170 }]
```
