import {
  Field, ID, ObjectType
} from "type-graphql";
import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn
} from "typeorm";


@Entity()
@ObjectType()
export class ServerAnnouncement {
  @PrimaryGeneratedColumn("increment")
  @Field(() => ID)
  announcementId!: number

  @Column()
  @Field()
  title!: string

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
