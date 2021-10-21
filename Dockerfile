FROM node:16-alpine as base
WORKDIR /app
EXPOSE 3000

COPY package*.json ./

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . ./
CMD ["npm", "run-prod"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . ./
CMD ["npm", "start"]
