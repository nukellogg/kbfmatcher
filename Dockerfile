
FROM node:16.13.0-alpine

# Set working directory
WORKDIR /usr/src/app

# Ensure npm uses official registry
RUN npm config set registry https://registry.npmjs.org/

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
