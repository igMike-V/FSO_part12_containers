FROM node:alpine
WORKDIR /srv/app
COPY ./frontend/ /srv/app
EXPOSE 3000
RUN npm install
CMD [ "npm", "run", "dev" ]