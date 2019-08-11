import { Postgres } from './services/postgres';
import SecretsManagerRepository from './repositories/secretsManager';

const secretsManager: SecretsManagerRepository = new SecretsManagerRepository(process.env.AWS_REGION);
const secretId: string | undefined = process.env.SecretId;
let postgres: Postgres;

type DbSecret = {
    host: string
    dbname: string
    username: string
    password: string
}

const getDatabase = async (): Promise<Postgres> => {
    if (postgres) {
        return postgres
    }

    if (!secretId) {
        throw new Error('secretId is undefined')
    }

    const secret: DbSecret = JSON.parse(await secretsManager.getSecretValue(secretId));
    console.log('host', secret.host);

    return new Postgres({
        type: 'postgres',
        host: secret.host,
        username: secret.username,
        password: secret.password,
        database: secret.dbname,
    });
};

export default getDatabase;
