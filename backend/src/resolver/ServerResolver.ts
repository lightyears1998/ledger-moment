import os from "os";

import {
  Arg,
  Authorized,
  FieldResolver, Mutation, Query, Resolver, ResolverInterface
} from "type-graphql";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import {
  RoleName, Server, ServerAnnouncement
} from "../entity";


@Service()
@Resolver(() => Server)
export class ServerResolver implements ResolverInterface<Server> {
  @InjectRepository(ServerAnnouncement)
  announcementRepository!: Repository<ServerAnnouncement>

  @FieldResolver()
  async loadAveragePerCpu(): Promise<number[]> {
    const cpuCount = os.cpus().length;
    return os.loadavg().map(load => load / cpuCount);
  }

  @FieldResolver()
  async latestAnnouncement(): Promise<ServerAnnouncement | undefined> {
    return this.announcementRepository.findOne({ order: { updatedAt: "DESC" } });
  }

  @FieldResolver()
  async announcements(): Promise<ServerAnnouncement[]> {
    return this.announcementRepository.find({ order: { updatedAt: "DESC" } });
  }

  @Query(() => Server)
  async server(): Promise<Server> {
    return new Server();
  }

  @Authorized([RoleName.SERVER_ADMIN])
  @Mutation(() => ServerAnnouncement)
  async addServerAnnouncement(
    @Arg("title") title: string,
    @Arg("content") content: string
  ): Promise<ServerAnnouncement> {
    const announcement = this.announcementRepository.create({
      title,
      content
    });

    return this.announcementRepository.save(announcement);
  }
}
