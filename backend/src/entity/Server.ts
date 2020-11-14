import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

@ObjectType()
export class Server {
  @Field({ nullable: true })
  latestAnnouncement?: ServerAnnouncement
}


@Entity()
export class ServerAnnouncement {
  @PrimaryGeneratedColumn("increment")
  announcementId!: number

  @Column()
  title!: string

  @Column()
  content!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
