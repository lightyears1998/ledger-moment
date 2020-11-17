import {
  Field, Float, ObjectType
} from "type-graphql";

import { ServerAnnouncement } from "./ServerAnnouncement";

@ObjectType()
export class Server {
  @Field(() => [Float])
  loadAveragePerCpu!: number[]

  @Field(() => [ServerAnnouncement])
  announcements!: ServerAnnouncement[]

  @Field(() => ServerAnnouncement, { nullable: true })
  latestAnnouncement?: ServerAnnouncement
}
