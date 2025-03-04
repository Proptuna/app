# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN yarn install

# Copy source code
COPY . .

# Build client and server
RUN yarn build

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app

# Install production dependencies
COPY package.json yarn.lock ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN yarn install --production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy package.json with type:module to dist/server
COPY --from=builder /app/server/src/package.json ./dist/server/

# Copy public directory for static assets
COPY --from=builder /app/server/src/public ./dist/server/public

# Create data directory and set permissions
RUN mkdir -p /mnt/volume_nyc1_02
VOLUME /mnt/volume_nyc1_02

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000
ENV DATA_DIR=/mnt/volume_nyc1_02

EXPOSE 8000

# Start the server
CMD ["node", "--experimental-specifier-resolution=node", "dist/server/index.js"]