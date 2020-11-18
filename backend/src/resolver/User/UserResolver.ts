import bcrypt from "bcrypt";
import {
  Query, Resolver, Ctx, Mutation, Arg, Int, Authorized, FieldResolver, ResolverInterface, Root
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server";

import { Ledger, User } from "../../entity";
import { AppContext, AppUserContext } from "../../context";
import { UserRepository } from "../../repo";
import { LedgerRepository } from "../../repo/LegerRepository";

@Service()
@Resolver(() => User)
export class UserResolver implements ResolverInterface<User> {
  @InjectRepository()
  private readonly userRepository!: UserRepository

  @InjectRepository()
  private readonly ledgerRepository!: LedgerRepository

  @FieldResolver({
    complexity: ({ args, childComplexity }) => {
      return 1 + childComplexity * (args.take ?? 0);
    }
  })
  async ledgers(
    @Root() user: User,
    @Arg("skip", () => Int, { nullable: true, defaultValue: 0 }) skip: number,
    @Arg("take", () => Int, { nullable: true, defaultValue: 20 }) take: number
  ): Promise<Ledger[]> {
    return this.ledgerRepository.find({
      where: { owner: user },
      skip: skip,
      take: take
    });
  }

  @FieldResolver(() => Int)
  async ledgerCount(
    @Root() user: User,
  ): Promise<number> {
    return this.ledgerRepository.count({ where: { owner: user } });
  }

  @Authorized()
  @Query(() => [User], {
    complexity: ({ args, childComplexity }) => {
      return 1 + childComplexity * (args.take ?? 0);
    }
  })
  async users(
    @Arg("skip", () => Int, { nullable: true, defaultValue: 0 }) skip?: number,
    @Arg("take", () => Int, { nullable: true, defaultValue: 20 }) take?: number
  ): Promise<User[]> {
    const users = this.userRepository.find({ skip, take });
    return users;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: AppUserContext): Promise<User | undefined> {
    return ctx.getSessionUser();
  }

  @Query(() => Boolean)
  async existUsername(username: string): Promise<boolean> {
    return (await this.userRepository.findByUsername(username)) !== undefined;
  }

  @Mutation(() => User)
  async userRegister(
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    const user = this.userRepository.save(this.userRepository.create({
      username,
      passwordHash
    }));

    return user;
  }

  @Mutation(() => User, { nullable: true })
  async userLogin(@Arg("username") username: string, @Arg("password") password: string, @Ctx() ctx: AppContext): Promise<User | null> {
    const user = await this.userRepository.findOneOrFail({ username });
    const passwordMatched = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatched) {
      throw new ApolloError("用户名或密码错误。", "WRONG_USERNAME_OR_PASSWORD");
    }

    if (ctx.session) {
      ctx.session.userId = user.userId;
    }
    return user;
  }

  @Mutation(() => Boolean)
  async userLogout(@Ctx() ctx: AppContext): Promise<boolean> {
    ctx.session = null;
    return true;
  }
}
