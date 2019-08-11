import cdk = require('@aws-cdk/core');
import secretManager = require('@aws-cdk/aws-secretsmanager');

export class SecretManager extends cdk.Stack {

    public readonly secret: secretManager.Secret;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.secret = new secretManager.Secret(this, 'secret', {
            generateSecretString: {
                secretStringTemplate: JSON.stringify({username: 'dbAdmin'}),
                generateStringKey: 'password',
                excludeCharacters: '"@/\\',
                passwordLength: 16,
            }
        });

        new cdk.CfnOutput(this, 'db-secret', {
            description: 'Aurora Database Secret ARN',
            value: this.secret.secretArn,
            exportName: `${this.stackName}-db-secret`,
        });
    }
}


