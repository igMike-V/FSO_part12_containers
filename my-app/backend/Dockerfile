FROM node:16

WORKDIR /usr/src/app

COPY ./backend/package.json ./
COPY ./backend/package-lock.json ./
COPY ./backend ./

RUN npm ci --only-production

CMD npm start