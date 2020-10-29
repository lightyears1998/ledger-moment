import { rootCertificates } from "tls";
import {
  Args,
  Ctx,
  Info,
  Query, Resolver, Root
} from "type-graphql";
import { User } from "../entity";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    const user = new User();
    user.userId = 1;
    user.username = "123";
    user.passwordHash = "123";
    return [user];
  }
}
