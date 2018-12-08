FROM alekzonder/puppeteer:latest

LABEL maintainer="xinghua<764237865@qq.com>"

WORKDIR /app
ADD . /app/

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
ENV HOST 0.0.0.0
ENV PORT 8080

RUN npm config set registry https://registry.npm.taobao.org  \
    & npm install

EXPOSE 8080

CMD ["npm", "start"]