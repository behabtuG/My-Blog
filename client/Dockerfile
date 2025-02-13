# Layer 1: Use the node:17-alpine image as the base image for the container.
FROM node:latest

# Layer 2: Set the working directory to /client/app in the container.
WORKDIR /client/app

# Layer 3: Copy package.json and package-lock.json from the root of the project to the container.
COPY package*.json ./

# Layer 4: Install dependencies.
RUN npm install

# Layer 5: Copy all files from the root of the project to the container.
COPY . .

# Layer 6: Expose port 5173.
EXPOSE 5173

# Layer 7: Define the default command to run the application.
CMD ["npm", "start"] 
