import {
  Query, Resolver, Ctx
} from "type-graphql";

import { User } from "../entity";
import { AppContext } from "../router/context";


@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() ctx: AppContext): Promise<User[]> {
    console.log(ctx);

    const user = new User();
    user.userId = 1;
    user.username = "123";
    user.passwordHash = "123";
    return [user];
  }
}
