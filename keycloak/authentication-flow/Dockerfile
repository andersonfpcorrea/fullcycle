FROM node

WORKDIR /home/node/app

COPY . .

RUN ["npm", "install"]

ENTRYPOINT ["npm", "run"]

CMD ["start:auth-code"]
