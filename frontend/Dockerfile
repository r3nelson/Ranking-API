# Use the official Node.js image as the base image
FROM node:22.2.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port for the development server
EXPOSE 8080

# Command to run the development server
CMD ["npm", "run", "serve"]
