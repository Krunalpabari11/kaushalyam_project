# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

COPY . .
# Install dependencies
RUN npm install

# Copy the rest of the application code


# Build the Next.js application
RUN npm run build

# Expose the desired port (default Next.js port is 3000)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run" "dev"]
