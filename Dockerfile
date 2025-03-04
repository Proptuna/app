# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root package.json, workspace package.json files, and yarn.lock
COPY package.json yarn.lock ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY server/dist-package.json ./server/

# Install dependencies for all workspaces
RUN yarn install

# Copy source code
COPY . .

# Build client and server separately to avoid ESM issues
RUN yarn build:client && yarn build:server

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy dist-package.json to dist/server
COPY --from=builder /app/dist ./dist

# Install production dependencies directly in the dist/server directory
WORKDIR /app/dist/server
COPY --from=builder /app/server/dist-package.json ./package.json
RUN yarn install --production

WORKDIR /app

EXPOSE 8000

# Start the server
CMD ["node", "./dist/server/index.js"]