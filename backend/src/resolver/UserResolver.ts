import { markAsUntransferable } from "worker_threads";

import {
  Query, Resolver, Ctx, Mutation, Arg
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { User } from "../entity";
import { AppContext } from "../context";
import { UserRepository } from "../repo";

@Service()
@Resolver(() => User)
export class UserResolver {
  @InjectRepository()
  private readonly userRepository!: UserRepository


  @Query(() => [User])
  async users(@Ctx() ctx: AppContext): Promise<User[]> {
    console.log(ctx);

    const user = new User();
    user.userId = 1;
    user.username = "123";
    user.passwordHash = "123";
    return [user];
  }

  @Mutation(() => User)
  async userRegister(
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<User> {
    const user = new User();
    user.userId = 1;
    user.passwordHash = "123";
    user.username = "123";

    return user;
  }

  @Mutation(() => User)
  async userLogin() {

  }

  @Mutation(() => Boolean)
  async userLogout() {
    return true;
  }
}
