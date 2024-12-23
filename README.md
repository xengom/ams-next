This is a project to change the [ams service](https://github.com/xengom/ams)  to the next.js basis.
Using pnpm as a package manager because it's way faster than npm.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Start Server

```bash
# 프로덕션 빌드 및 PM2로 시작
pnpm pm2:start

# 로그 확인
pnpm pm2:logs

# 앱 재시작
pnpm pm2:restart

# 앱 중지
pnpm pm2:stop

# 앱 삭제
pnpm pm2:delete
```