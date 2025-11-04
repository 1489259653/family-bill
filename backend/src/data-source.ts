import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Transaction } from './transactions/entities/transaction.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'family_finance',
  synchronize: true,
  logging: true,
  entities: [User, Transaction],
  migrations: [],
  subscribers: [],
});