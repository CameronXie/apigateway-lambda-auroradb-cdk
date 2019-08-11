import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Todo {
    @PrimaryColumn({type: 'uuid'})
    id: string;

    @Column({type: 'varchar', length: 150})
    item: string;

    @Column({type: 'date'})
    date: Date;

    @Column({type: 'boolean'})
    isCompleted: boolean;
}
