import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn
} from "typeorm";
import {
  Field, ID, ObjectType
} from "type-graphql";

@ObjectType()
@Entity()
@Unique("UNIQUE_username", ["username"])
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  userId!: number

  @Field()
  @Column()
  username!: string

  @Field()
  @Column()
  passwordHash!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
