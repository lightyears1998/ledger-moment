import {
  Column, Entity, PrimaryGeneratedColumn
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn("increment")
  userId!: number

  @Field()
  @Column()
  username!: string

  @Field()
  @Column()
  passwordHash!: string
}
