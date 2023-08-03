FROM node
WORKDIR /app
COPY ./backend/ .
RUN npm install
CMD [ "npm", "run", "dev" ]