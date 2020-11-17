import {
  Field, ID, ObjectType
} from "type-graphql";
import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";

import { User } from "../User";

@Entity()
@ObjectType()
export class ServerAnnouncement {
  @PrimaryGeneratedColumn("increment")
  @Field(() => ID)
  announcementId!: number

  @Column()
  @Field()
  title!: string

  @ManyToOne(() => User)
  @Field()
  by!: User

  @Column()
  @Field()
  content!: string

  @CreateDateColumn()
  @Field()
  createdAt!: Date

  @CreateDateColumn()
  @Field()
  updatedAt!: Date
}
