# -------- 构建阶段 --------
FROM node:lts AS builder

# 安装 pnpm（轻量）
RUN npm install -g pnpm@9

WORKDIR /app

# 只复制依赖定义文件（能最大化缓存利用率）
COPY pnpm-lock.yaml package.json ./

# 安装依赖（包括 devDependencies 用于构建）
RUN pnpm install --frozen-lockfile

# 复制项目源码并构建
COPY . .
RUN pnpm build:full

# -------- 运行阶段 --------
FROM node:lts-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./

EXPOSE 8080
EXPOSE 8089

CMD ["node", "noname-server.cjs"]
