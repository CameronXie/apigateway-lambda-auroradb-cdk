FROM node:10-alpine

RUN apk add --no-cache \
            python3 \
            python3-dev \
            gcc \
            musl-dev \
            jq \
            make \
    && pip3 --disable-pip-version-check install \
            awscli \
            aws-sam-cli \
    && apk -v --purge --no-cache del \
            gcc \
            python3-dev \
            musl-dev

RUN npm i -g aws-cdk
