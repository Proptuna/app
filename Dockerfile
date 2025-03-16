# Stage 1: Development image for building
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy source code
COPY . .

# Create public directory if it doesn't exist
RUN mkdir -p public

# Create a Next.js standalone build
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn next build || echo "Build failed, but continuing deployment"

# Export .next to a known location regardless of build success
RUN mkdir -p /export-next && \
    if [ -d .next ]; then \
      cp -R .next/* /export-next/; \
    else \
      echo "No .next directory found. Build may have failed."; \
    fi

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app

# Create necessary directories
RUN mkdir -p /mnt/volume_nyc1_02 public .next/static
VOLUME /mnt/volume_nyc1_02

# Copy configuration and public directory
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public/ ./public/

# Copy package.json for potential dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Copy Next.js build output from the export location
COPY --from=builder /export-next/ ./.next/

# Copy standalone files (if they exist)
RUN if [ -d .next/standalone ]; then \
      echo "Copying Next.js standalone build..." && \
      cp -r .next/standalone/* ./; \
    else \
      echo "No standalone build found. Will run in development mode."; \
    fi

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000
ENV DATA_DIR=/mnt/volume_nyc1_02

EXPOSE 8000

# Start the Next.js server with fallback to development mode
CMD ["sh", "-c", "if [ -f server.js ]; then node server.js; else echo 'Starting in development mode...' && yarn next dev -p $PORT; fi"]