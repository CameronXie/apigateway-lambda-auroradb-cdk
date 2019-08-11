#! /bin/bash

TOKEN=$1

unset  AWS_SESSION_TOKEN

temp_role=$(aws sts assume-role \
                    --duration-seconds 3600 \
                    --role-arn "$ROLE_ARN" \
                    --role-session-name "apigate-lambda-auroradb-stacks" \
                    --serial-number "$MFA_DEVICE" \
                    --token-code "$TOKEN")

if test -z "$temp_role"
then
  echo "assume role failed"
else
  export AWS_ACCESS_KEY_ID=$(echo $temp_role | jq .Credentials.AccessKeyId | xargs)
  export AWS_SECRET_ACCESS_KEY=$(echo $temp_role | jq .Credentials.SecretAccessKey | xargs)
  export AWS_SESSION_TOKEN=$(echo $temp_role | jq .Credentials.SessionToken | xargs)

  echo "assume role $ROLE_ARN successed"
fi


