# Use a lightweight Node.js base image
FROM node:20.12.0-alpine3.19

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json turbo.json tsconfig.json ./

# Copy the rest of the application code
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN npm install

# Can you add a script to the global package.json that does this?
RUN db:generate

# Copy the rest of the application code
COPY . .

# build the application
RUN npm run build

# Start the application
CMD ["npm", "run", "start-app"]