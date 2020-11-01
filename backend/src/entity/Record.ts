import { Field } from "type-graphql";
import {
  CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";


export enum RecordType {
}


@Entity()
export class Record {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  recordId!: string

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}
