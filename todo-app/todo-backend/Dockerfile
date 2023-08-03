FROM node:16

WORKDIR /usr/src/app

COPY ./todo-backend/package.json ./
COPY ./todo-backend/package-lock.json ./
COPY ./todo-backend ./

RUN npm ci --only-production

CMD npm start
