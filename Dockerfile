FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runtime

# Set labels for better maintainability
LABEL maintainer="Landstro by benav.io"
LABEL org.opencontainers.image.source="https://github.com/igorbenav/landstro"
LABEL org.opencontainers.image.description="Landstro: Modern landing page built with Astro"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.vendor="benav.io"

WORKDIR /app

# Install curl for healthcheck
RUN apk --no-cache add curl

# Copy build output and necessary files
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/src ./src

# Create data directory for database with proper permissions
RUN mkdir -p /app/data && chmod 777 /app/data

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Expose the port
EXPOSE 4321

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4321/ || exit 1

# Run the application
CMD ["node", "./dist/server/entry.mjs"] 