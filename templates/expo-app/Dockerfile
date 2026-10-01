FROM node:24-bookworm-slim
WORKDIR /app
RUN npm install --global pnpm@10.13.1
COPY . .
RUN pnpm install --frozen-lockfile
EXPOSE 8081
CMD ["pnpm", "exec", "expo", "start", "--web", "--host", "lan"]
