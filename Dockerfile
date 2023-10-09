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

# ENV PORT=8080



# Define the command to start your application
CMD ["npm", "start"]
