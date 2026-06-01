# Use an official Node runtime as a parent image
FROM node:current-alpine

# Set the working directory in the container
WORKDIR /usr/src/index.js

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 (as used in your index.js)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]