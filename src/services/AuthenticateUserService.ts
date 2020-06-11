import { getRepository } from "typeorm";
import { hash, compare } from "bcryptjs";
import User from "../models/User";
import { sign } from "jsonwebtoken";
import authConfig from "../config/auth";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error("Incorreto email/password combinação");
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error("Incorreto email/password combinação");
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expireIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
