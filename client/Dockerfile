# Use Node.js as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY . .

# Vite development server listens on port 5173
EXPOSE 5173

# Start Vite and allow access outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]