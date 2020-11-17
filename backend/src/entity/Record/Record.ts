import { Field, ObjectType } from "type-graphql";
import {
  CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn
} from "typeorm";

@ObjectType()
@Entity()
@TableInheritance({ column: { type: "int", name: "type" } })
export class Record {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  recordId!: string

  @Field({ defaultValue: "" })
  remark!: string

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date
}
