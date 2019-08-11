#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { Lambda } from '../lib/lambda';
import { Aurora } from '../lib/aurora';
import { Network } from '../lib/network';
import { SecretManager } from '../lib/secret';

const networkStack = 'todo-vpc';
const secretStack = 'todo-secret';

const app = new cdk.App();

const network = new Network(app, networkStack, {
    Cidr: '10.1.0.0/16'
});

const secretManager = new SecretManager(app, secretStack);

const aurora = new Aurora(app, 'todo-db', {
    DbSecretArnExpressName: `${secretStack}-db-secret`,
    VpcIdExportName: `${networkStack}-vpc-id`,
    SubnetIdsExportName: `${networkStack}-database-subnet-ids`,
    SourceSecurityGroupIdExportName: `${networkStack}-todo-lambda-sg`,
});

aurora.addDependency(network);
aurora.addDependency(secretManager);


const lambda = new Lambda(app, 'todo-lambda', {
    vpc: network.vpc,
    securityGroup: network.securityGroup,
    secret: secretManager.secret
});

lambda.addDependency(secretManager);
