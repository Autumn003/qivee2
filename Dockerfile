# Build stage
FROM node:20.12.0-alpine3.19 AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json turbo.json ./
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npm run db:generate

# Set DATABASE_URL for build
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Build the application
RUN npm run build

# Production stage
FROM node:20.12.0-alpine3.19 AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app ./

# Clear DATABASE_URL so it must be provided at runtime
ENV DATABASE_URL=""

# Start the application
CMD ["npm", "run", "start-app"]