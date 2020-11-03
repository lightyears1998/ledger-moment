import bcrypt from "bcrypt";
import {
  Query, Resolver, Ctx, Mutation, Arg, Int
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server";

import { User } from "../entity";
import { AppContext } from "../context";
import { UserRepository } from "../repo";

@Service()
@Resolver(() => User)
export class UserResolver {
  @InjectRepository()
  private readonly userRepository!: UserRepository


  @Query(() => [User], {
    complexity: ({ args, childComplexity }) => {
      return 1 + childComplexity + (args.take ?? 0);
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
  async whoami(@Ctx() ctx: AppContext): Promise<User | undefined> {
    if (ctx.session) {
      return ctx.session.user;
    }
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

    return user;
  }

  @Mutation(() => Boolean)
  async userLogout(@Ctx() ctx: AppContext): Promise<boolean> {
    ctx.session = null;
    return true;
  }
}
