#!/usr/bin/env bash

PROJECT_ROOT="/home/ubuntu/app"
APP_NAME="project"

TIME_NOW=$(date +%c)

cd $PROJECT_ROOT

ENV_CONTENT=$(aws ssm get-parameter --name ENV_FILE --with-decryption --query "Parameter.Value" --output text)
echo "$ENV_CONTENT" > .env

pm2 delete $APP_NAME
pm2 start npm --name $APP_NAME -- start

echo "$TIME_NOW > Deploy has been completed"