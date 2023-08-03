FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY ./todo-frontend/package.json ./
COPY ./todo-frontend/package-lock.json ./
COPY ./todo-frontend ./ 

RUN npm ci

RUN CI=true npm run test

ARG API_URL 
ENV REACT_APP_BACKEND_URL=$API_URL

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
