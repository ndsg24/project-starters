FROM node:24-bookworm-slim
WORKDIR /app
RUN npm install --global pnpm@10.13.1
COPY . .
RUN pnpm install --frozen-lockfile
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
