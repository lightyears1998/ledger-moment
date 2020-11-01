import bcrypt from "bcrypt";
import {
  Query, Resolver, Ctx, Mutation, Arg, Int
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
  async users(
    @Ctx() ctx: AppContext,
    @Arg("skip", () => Int, { nullable: true }) skip?: number,
    @Arg("take", () => Int, { nullable: true }) take?: number
  ): Promise<User[]> {
    console.log(ctx);

    const user = new User();
    user.userId = 1;
    user.username = "123";
    user.passwordHash = "123";
    return [user];
  }

  @Query(() => User, { nullable: true })
  async whoami(@Ctx() ctx: AppContext): Promise<User | undefined> {
    return ctx.session.user;
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

  @Mutation(() => Boolean)
  async userLogin(@Arg("username") username: string, @Arg("password") password: string) {

  }

  @Mutation(() => Boolean)
  async userLogout() {
    return true;
  }
}
