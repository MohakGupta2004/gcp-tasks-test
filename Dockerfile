
FROM oven/bun:1

WORKDIR /app

# Install deps
COPY package.json ./
RUN bun install --production

# Copy source
COPY . .

# Cloud Run requires PORT
ENV PORT=8080
EXPOSE 8080

CMD ["bun", "run", "index.ts"]