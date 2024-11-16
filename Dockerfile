FROM node:18

WORKDIR /app

COPY ./docker/* ./

RUN npm install body-parser express minimist

COPY . .

EXPOSE 8080
EXPOSE 8089

CMD [ "sh","./start.sh" ]