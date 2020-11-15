import { Field, ObjectType } from "type-graphql";

import { ServerAnnouncement } from "./ServerAnnouncement";


@ObjectType()
export class Server {
  @Field(() => [ServerAnnouncement])
  announcements!: ServerAnnouncement[]

  @Field(() => ServerAnnouncement, { nullable: true })
  latestAnnouncement?: ServerAnnouncement
}
