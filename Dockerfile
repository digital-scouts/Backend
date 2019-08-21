FROM node:11
# FROM arm32v7/node

WORKDIR /usr/src/app

# Copy package.json to the WORKDIR
COPY package.json .

# Install the dependencies
RUN npm install

# Copy server.js, etc...
COPY . .

# The port that the container will listen on
EXPOSE 3000

# Run the scripts command in the package.json
CMD ["npm", "start"]
