import {
  FieldResolver, Resolver, ResolverInterface
} from "type-graphql";
import { Service } from "typedi";
import { EntityManager, getManager } from "typeorm";
import { InjectManager } from "typeorm-typedi-extensions";

import { Server, ServerAnnouncement } from "../entity";


@Service()
@Resolver(() => Server)
export class ServerResolver implements ResolverInterface<Server> {
  @InjectManager()
  manager!: EntityManager

  @FieldResolver()
  async latestAnnouncement(): Promise<ServerAnnouncement | undefined> {
    return this.manager.getRepository(ServerAnnouncement).findOne({ order: { updatedAt: "DESC" } });
  }

  @FieldResolver()
  async announcements(): Promise<ServerAnnouncement[]> {
    return getManager().getRepository(ServerAnnouncement).find({ order: { updatedAt: "DESC" } });
  }
}
