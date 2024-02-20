FROM node:21.6-alpine3.19
WORKDIR /code
COPY src/index.js .
COPY package-lock.json .
COPY package.json .
COPY src/run.sh .
RUN chmod +x run.sh
EXPOSE 9999
RUN npm install
ENTRYPOINT ["sh", "-c", "./run.sh"]