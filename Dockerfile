# Use an official Node runtime as the base image
FROM node:18-alpine

# Set environment variables for production
ENV NODE_ENV=production

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Define the port that Cloud Run will use to serve the app
ENV PORT=3000

# Start the Next.js application using the built code
CMD ["npm", "start"]
