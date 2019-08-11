# Todo API

A demo of building a REST API with Aurora Database by using AWS CDK (Typescript).

AWS Resources:

* VPC & Subnet
* API Gateway
* Lambda
* Aurora Database (Postgres 10)
* Secrets Manager

## Deployment

This project is using docker to deployment. 
The docker contains `AWS CLI`, `AWS SAM CLI` and `CDK`.

```shell script
# run the docker container
make up

# inside the container, 
# build lambda function
cd ./lambda && npm install && npm run build

# build aws stacks
# make sure you have permission to create AWS resources.
cd ./stacks && npm install && cdk deploy todo* 
```

## Endpoints

Create a ToDo item

```http request
POST /v1/todo

{
	"item": "Demo Organic Search 3",
	 "date": "2019-08-11T11:12:59.236Z",
	 "isCompleted": true
}
```

List ToDo items

```http request
GET /v1/todo?skip=0&take=20

```

## ToDo

* Change Aurora stack to use native CDK when `aws-rds` is stable (currently it is experimental mode)
* Add `update` and `delete` endpoint to complete this demo
