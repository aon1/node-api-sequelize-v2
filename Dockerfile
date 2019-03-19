FROM node:11-alpine

WORKDIR /app

# COPY package*.json ./

COPY . .

RUN npm install

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["npm", "start"]

