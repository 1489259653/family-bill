import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // 检查邮箱是否已存在
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException("该邮箱已被注册");
    }

    // 检查用户名是否已存在
    const existingUsername = await this.findByUsername(userData.username);
    if (existingUsername) {
      throw new ConflictException("该用户名已被使用");
    }

    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }
}
