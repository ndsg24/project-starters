FROM node:24-bookworm-slim
WORKDIR /app
RUN npm install --global pnpm@10.13.1
COPY . .
RUN pnpm install --frozen-lockfile
EXPOSE 3000
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]
