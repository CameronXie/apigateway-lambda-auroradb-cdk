import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');

interface VpcProps extends cdk.StackProps {
    Cidr: string
}

export class Network extends cdk.Stack {
    public readonly vpc: ec2.IVpc;

    public readonly securityGroup: ec2.SecurityGroup;

    constructor(scope: cdk.Construct, id: string, props: VpcProps) {
        super(scope, id, props);

        this.vpc = new ec2.Vpc(this, 'vpc', {
            cidr: props.Cidr,
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Public',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 24,
                    name: 'Database-Private',
                    subnetType: ec2.SubnetType.ISOLATED,
                },
                {
                    cidrMask: 24,
                    name: 'Application-Isolated',
                    subnetType: ec2.SubnetType.PRIVATE,
                },
            ],
        });

        this.securityGroup = new ec2.SecurityGroup(this, 'security-group', {
            securityGroupName: 'todo-lambda-sg',
            vpc: this.vpc,
        });

        new cdk.CfnOutput(this, 'vpc-id', {
            description: 'VPC Id',
            exportName: `${this.stackName}-vpc-id`,
            value: this.vpc.vpcId
        });

        new cdk.CfnOutput(this, 'database-subnet', {
            description: 'Database Subnet Ids',
            exportName: `${this.stackName}-database-subnet-ids`,
            value: this.vpc.isolatedSubnets.map(subnet => subnet.subnetId).join(',')
        });

        new cdk.CfnOutput(this, 'todo-lambda-sg', {
            description: 'todo lambda security group Id',
            exportName: `${this.stackName}-todo-lambda-sg`,
            value: this.securityGroup.securityGroupId
        });
    }
}
