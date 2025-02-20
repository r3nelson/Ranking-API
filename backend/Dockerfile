# Use the official Node.js image as the base image
FROM node:22.2.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ts-node-dev globally
RUN npm install -g ts-node-dev

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port that the app runs on
EXPOSE 4000

# Command to run your app
CMD ["npm", "run", "dev"]

