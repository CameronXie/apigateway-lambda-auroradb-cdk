import { APIGatewayEvent, Context } from 'aws-lambda';
import getDatabase from './bootstrap';
import { Connection } from 'typeorm';
import { Todo } from './entities/todo';
import { Postgres } from './services/postgres';

export const handler = async (event: APIGatewayEvent, context: Context) => {
    const params = event.queryStringParameters;
    const skip: number = params && params['skip'] ? +params['skip'] : 0;
    const take: number = params && params['take'] ? +params['take'] : 50;

    try {
        const db: Postgres = await getDatabase();
        const conn: Connection = await db.getConnection();
        const todoList = await conn.getRepository(Todo).find({skip, take});

        context.succeed({
            statusCode: 200,
            body: JSON.stringify({data: todoList})
        });
    } catch (e) {
        console.log('catch', e.message);
        context.succeed({
            statusCode: 500,
            body: JSON.stringify({error: 'system error.'})
        });
    }
};
