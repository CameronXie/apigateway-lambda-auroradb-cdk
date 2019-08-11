import { APIGatewayEvent, Context } from 'aws-lambda';
import getDatabase from './bootstrap';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';
import { Todo } from './entities/todo';
import { Postgres } from './services/postgres';

export const handler = async (event: APIGatewayEvent, context: Context) => {
    if (!event.body) {
        context.succeed({
            statusCode: 400,
            body: JSON.stringify({error: 'invalid request'})
        });
    }

    try {
        const db: Postgres = await getDatabase();
        const conn: Connection = await db.getConnection();
        const todo = {
            id: uuidV4(),
            ...JSON.parse(String(event.body))
        };

        await conn.getRepository(Todo).save(todo);

        context.succeed({
            statusCode: 201,
            body: JSON.stringify({msg: 'created'})
        });
    } catch (e) {
        console.log('catch', e.message);
        context.succeed({
            statusCode: 500,
            body: JSON.stringify({error: 'system error.'})
        });
    }
};
