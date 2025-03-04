# Proptuna App

A property management application with waitlist functionality.

## Development

To run the application in development mode:

```bash
# Install dependencies
yarn install

# Start development servers
yarn dev
```

## Production Deployment with Docker

### Building the Docker Image

```bash
docker build -t proptuna-app .
```

### Running the Docker Container

To run the container with proper data persistence:

```bash
# Create the data directory if it doesn't exist
mkdir -p /mnt/volume_nyc1_02

# Run the container with volume mounting
docker run -d \
  --name proptuna \
  -p 8000:8000 \
  -e NODE_ENV=production \
  -e DATA_DIR=/mnt/volume_nyc1_02 \
  -v /mnt/volume_nyc1_02:/mnt/volume_nyc1_02 \
  proptuna-app
```

This will:
1. Mount the host directory `/mnt/volume_nyc1_02` to the container's `/mnt/volume_nyc1_02` directory
2. Expose the application on port 8000
3. Persist the SQLite database across container restarts

### Checking Logs

```bash
docker logs proptuna
```

### Stopping the Container

```bash
docker stop proptuna
```

### Restarting the Container

```bash
docker start proptuna
```
