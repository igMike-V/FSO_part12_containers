FROM node AS build-stage

WORKDIR /usr/src/app
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
COPY ./frontend ./

RUN npm ci

ARG API_URL
ARG WS_URL
ENV VITE_API_URL=$API_URL
ENV VITE_WS_URL=$WS_URL

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html