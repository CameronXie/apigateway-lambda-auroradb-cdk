import { Connection, ConnectionManager, createConnection, getConnectionManager } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Todo } from '../entities/todo';

export class Postgres {
    private readonly config: PostgresConnectionOptions;
    private readonly connectionManager: ConnectionManager;
    private readonly connectionName: string = 'default_connection';

    public constructor(config: PostgresConnectionOptions) {
        this.connectionManager = getConnectionManager();
        this.config = {...this.getDefaultConfig(), ...config};
    }

    public async getConnection(): Promise<Connection> {
        let connection: Connection;

        if (this.connectionManager.has(this.connectionName)) {
            connection = await this.connectionManager.get(this.connectionName);

            if (!connection.isConnected) {
                return await connection.connect()
            }

            return connection;
        }

        return await createConnection(this.config);
    }

    private getDefaultConfig(): PostgresConnectionOptions {
        return {
            name: this.connectionName,
            type: `postgres`,
            port: 5432,
            synchronize: true,
            logging: false,
            ssl: true,
            entities: [
                Todo
            ]
        };
    }
}
