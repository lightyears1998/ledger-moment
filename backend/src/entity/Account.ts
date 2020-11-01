import { Field, Float } from "type-graphql";
import {
  Column, Entity, PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Account {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  accountId!: string

  @Field()
  @Column()
  name!: string

  @Field(() => Float)
  balance!: number
}
