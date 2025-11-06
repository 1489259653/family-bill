import { BadRequestException, Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Decimal from "decimal.js";
import type { Repository } from "typeorm";
import { FamilyMember } from "../families/entities/family-member.entity";
import type { CreateTransactionDto } from "./dto/create-transaction.dto";
import type { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { Transaction } from "./entities/transaction.entity";

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(FamilyMember)
    private readonly familyMemberRepository: Repository<FamilyMember>
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: number): Promise<Transaction> {
    let family = null;
    let payerId = userId; // 默认支付人是创建者

    // 如果是家庭账单
    if (createTransactionDto.isFamilyBill) {
      // 检查用户是否在家庭中
      const familyMember = await this.familyMemberRepository.findOne({
        where: { user: { id: userId }, isActive: true },
        relations: ["family"],
      });

      if (!familyMember) {
        throw new BadRequestException("您还没有加入任何家庭，无法创建家庭账单");
      }

      family = familyMember.family;

      // 如果指定了支付人，确保支付人也是家庭成员
      if (createTransactionDto.payerId) {
        const payerMember = await this.familyMemberRepository.findOne({
          where: {
            user: { id: createTransactionDto.payerId },
            family: { id: family.id },
            isActive: true,
          },
        });

        if (!payerMember) {
          throw new BadRequestException("指定的支付人不是家庭成员");
        }

        payerId = createTransactionDto.payerId;
      }
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user: { id: userId },
      family: family,
      payer: { id: payerId },
    });

    return await this.transactionRepository.save(transaction);
  }

  async findAll(userId: number, isFamilyBill?: boolean): Promise<Transaction[]> {
    this.logger.debug(`[FIND_ALL] 用户ID: ${userId}, 账单类型: ${isFamilyBill}`);
    
    // 构建查询条件
    const query = {
      where: {},
      relations: ["family", "payer", "user"],
      order: { date: "DESC" as const },
    };

    // 如果指定了账单类型
    if (isFamilyBill !== undefined) {
      this.logger.debug(`[FIND_ALL] 筛选账单类型: ${isFamilyBill ? '家庭账单' : '个人账单'}`);
      
      if (isFamilyBill) {
        this.logger.debug(`[FIND_ALL] 查询用户家庭信息`);
        // 获取用户的家庭
        const familyMember = await this.familyMemberRepository.findOne({
          where: { user: { id: userId }, isActive: true },
          relations: ["family"],
        });
        
        this.logger.debug(`[FIND_ALL] 用户家庭信息: ${JSON.stringify(familyMember)}`);
        
        if (familyMember) {
          this.logger.debug(`[FIND_ALL] 使用家庭ID: ${familyMember.family?.id} 筛选账单`);
          // 查询用户家庭的所有账单
          query.where = { family: { id: familyMember.family.id } };
        } else {
          this.logger.debug(`[FIND_ALL] 用户不在任何家庭中，返回空列表`);
          return [];
        }
      } else {
        this.logger.debug(`[FIND_ALL] 筛选个人账单，用户ID: ${userId}`);
        // 查询用户的个人账单
        query.where = { user: { id: userId }, isFamilyBill: false };
      }
    } else {
      // 查询用户的所有账单（个人账单 + 家庭账单）
      // 首先获取用户的家庭
      const familyMember = await this.familyMemberRepository.findOne({
        where: { user: { id: userId }, isActive: true },
        relations: ["family"],
      });
      if (familyMember) {
        // 个人账单或家庭账单
        query.where = [{ user: { id: userId }, isFamilyBill: false }, { family: { id: familyMember.family.id } }];
      } else {
        // 只有个人账单
        query.where = { user: { id: userId } };
      }
    }

    return await this.transactionRepository.find(query);
  }

  async findOne(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ["user"],
    });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto, userId: number): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);

    Object.assign(transaction, updateTransactionDto);

    return await this.transactionRepository.save(transaction);
  }

  async remove(id: number, userId: number): Promise<void> {
    const transaction = await this.findOne(id, userId);
    await this.transactionRepository.remove(transaction);
  }

  async getSummary(userId: number): Promise<{ income: string; expense: string; balance: string }> {
    const transactions = await this.findAll(userId);

    // 使用Decimal.js进行高精度计算
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => new Decimal(sum).plus(new Decimal(t.amount.toString())), new Decimal(0))
      .toString();

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => new Decimal(sum).plus(new Decimal(t.amount.toString())), new Decimal(0))
      .toString();

    const balance = new Decimal(income).minus(new Decimal(expense)).toString();

    return { income, expense, balance };
  }
}
