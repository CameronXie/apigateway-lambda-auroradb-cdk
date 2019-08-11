import cdk = require('@aws-cdk/core');
import * as fs from 'fs';

interface AuroraProps extends cdk.StackProps {
    DbSecretArnExpressName: string
    VpcIdExportName: string
    SubnetIdsExportName: string
    SourceSecurityGroupIdExportName: string
}

export class Aurora extends cdk.Stack {
    private readonly dbName = 'Todo';

    private readonly instanceClass = 'db.t3.medium';

    constructor(scope: cdk.Construct, id: string, props: AuroraProps) {
        super(scope, id, props);

        new cdk.CfnParameter(this, 'StackDescription', {
            type: 'String',
            default: this.stackName.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        });

        new cdk.CfnParameter(this, 'DatabaseName', {
            type: 'String',
            default: this.dbName
        });

        new cdk.CfnParameter(this, 'DBInstanceClass', {
            type: 'String',
            default: this.instanceClass
        });

        new cdk.CfnParameter(this, 'DbSecretArnExpressName', {
            type: 'String',
            default: props.DbSecretArnExpressName
        });

        new cdk.CfnParameter(this, 'SecretManagerArn', {
            type: 'String',
            default: props.VpcIdExportName
        });

        new cdk.CfnParameter(this, 'VpcIdExportName', {
            type: 'String',
            default: props.VpcIdExportName
        });

        new cdk.CfnParameter(this, 'SubnetIdsExportName', {
            type: 'String',
            default: props.SubnetIdsExportName
        });

        new cdk.CfnParameter(this, 'SourceSecurityGroupIdExportName', {
            type: 'String',
            default: props.SourceSecurityGroupIdExportName
        });

        new cdk.CfnInclude(this, 'aurora', {
            template: JSON.parse(fs.readFileSync('cfn_templates/aurora-postgresql.json').toString())
        });
    }
}


