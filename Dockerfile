# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy root package.json, workspace package.json files, and yarn.lock
COPY package.json yarn.lock ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install dependencies for all workspaces
RUN yarn install

# Copy source code
COPY . .

# Build client and server separately
RUN yarn build:client && yarn build:server

# Stage 2: Production image
FROM node:20-alpine

# Install runtime dependencies for SQLite3
RUN apk add --no-cache sqlite

WORKDIR /app

# Copy client build
COPY --from=builder /app/dist/client ./dist/client

# Copy the bundled server (which includes all dependencies)
COPY --from=builder /app/dist/server ./dist/server

# Install SQLite3 and its dependencies
WORKDIR /app
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
    && yarn add sqlite3@5.1.7 bindings@1.5.0 \
    && apk del .build-deps

# Create directory for the database
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production

EXPOSE 8000

# Start the server
CMD ["node", "./dist/server/index.js"]