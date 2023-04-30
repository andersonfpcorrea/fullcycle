FROM nginx:latest

# WORKDIR /app

# RUN apt-get update \
#     && apt-get upgrade -y \
#     && apt-get install curl -y \
#     && apt-get install vim -y

COPY html/ /usr/share/nginx/html

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]