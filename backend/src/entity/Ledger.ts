import { Field, ID } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";


@Entity()
export class Ledger {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  ledgerId!: string

  @Field()
  @Column()
  name!: string

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}
