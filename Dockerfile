# Use the official Node.js image as the base image
FROM node:current

# Set a working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose a port (if your application needs to listen on a specific port)
# EXPOSE 3000

# Define the command to start your application
CMD ["node", "app.js"]
