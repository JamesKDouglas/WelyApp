FROM node:20-alpine
RUN mkdir -p /welyapp/node_modules && chown -R node:node /welyapp
WORKDIR /welyapp
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "node", "server.js" ]