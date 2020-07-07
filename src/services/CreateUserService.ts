import { getRepository } from "typeorm";
import { hash } from "bcryptjs";
import User from "../models/User";

import AppError from "../errors/AppError";

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);
    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError("Email já cadastrado/Usuário existente.", 401);
    }

    const hashedPasword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPasword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
