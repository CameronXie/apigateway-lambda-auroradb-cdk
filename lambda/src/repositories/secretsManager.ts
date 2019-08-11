import { SecretsManager } from 'aws-sdk';

export default class SecretsManagerRepository {
    private client: SecretsManager;

    public constructor(region?: string, client?: SecretsManager) {
        if (!region && !client) {
            throw new Error('client and region both are undefined');
        }

        this.client = client || new SecretsManager({region});
    }

    public async getSecretValue(secretId: string): Promise<string> {
        const secret = await this.client.getSecretValue({SecretId: secretId}).promise();

        if (secret.SecretString !== undefined) {
            return secret.SecretString;
        }

        throw new Error('secret is not exists.')
    }
}
