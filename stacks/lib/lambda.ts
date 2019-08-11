import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigateway = require('@aws-cdk/aws-apigateway');
import log = require('@aws-cdk/aws-logs');
import * as ec2 from '@aws-cdk/aws-ec2';
import secretManager = require('@aws-cdk/aws-secretsmanager');

interface LambdaProps extends cdk.StackProps {
    vpc: ec2.IVpc,
    securityGroup: ec2.SecurityGroup,
    secret: secretManager.Secret
}

export class Lambda extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: LambdaProps) {
        super(scope, id, props);

        new log.LogGroup(this, 'createFnLogGroup', {
            logGroupName: '/aws/lambda/todo-list-create',
            retention: log.RetentionDays.ONE_WEEK,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        const createFn = new lambda.Function(this, 'create', {
            functionName: 'todo-list-create',
            code: new lambda.AssetCode('../dist'),
            handler: 'create.handler',
            runtime: lambda.Runtime.NODEJS_10_X,
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE
            },
            securityGroup: props.securityGroup,
            environment: {
                SecretId: props.secret.secretArn,
            }
        });

        new log.LogGroup(this, 'listFnLogGroup', {
            logGroupName: '/aws/lambda/todo-list-list',
            retention: log.RetentionDays.ONE_WEEK,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        const listFn = new lambda.Function(this, 'list', {
            functionName: 'todo-list-list',
            code: new lambda.AssetCode('../dist'),
            handler: 'list.handler',
            runtime: lambda.Runtime.NODEJS_10_X,
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE
            },
            securityGroup: props.securityGroup,
            environment: {
                SecretId: props.secret.secretArn,
            }
        });

        props.secret.grantRead(createFn);
        props.secret.grantRead(listFn);

        const api = new apigateway.RestApi(this, 'apiGateway', {
            restApiName: 'todo list api',
        });

        const todo = api.root.addResource('v1').addResource('todo');

        todo.addMethod('GET', new apigateway.LambdaIntegration(listFn));
        todo.addMethod('POST', new apigateway.LambdaIntegration(createFn));
    }
}


