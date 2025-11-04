import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('交易管理')
@ApiBearerAuth('access_token')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    summary: '创建交易记录',
    description: '创建新的收入或支出交易记录',
  })
  @ApiBody({
    type: CreateTransactionDto,
    examples: {
      default: {
        value: {
          description: '超市购物',
          amount: 100.50,
          date: '2025-11-04',
          category: '日常购物',
          type: 'expense',
          isFamilyBill: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '交易创建成功',
    schema: {
      example: {
        id: 1,
        description: '超市购物',
        amount: 100.50,
        date: '2025-11-04',
        category: '日常购物',
        type: 'expense',
        isFamilyBill: true,
        userId: 1,
        createdAt: '2025-11-04T12:00:00Z',
      },
    },
  })
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create(createTransactionDto, req.user.userId);
  }

  @ApiOperation({
    summary: '获取交易记录列表',
    description: '获取当前用户的交易记录列表，可选择性过滤家庭账单',
  })
  @ApiQuery({
    name: 'isFamilyBill',
    type: Boolean,
    required: false,
    description: '是否只获取家庭账单',
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: [
        {
          id: 1,
          description: '超市购物',
          amount: 100.50,
          date: '2025-11-04',
          category: '日常购物',
          type: 'expense',
          isFamilyBill: true,
          userId: 1,
          user: {
            id: 1,
            username: '张三',
          },
          createdAt: '2025-11-04T12:00:00Z',
        },
      ],
    },
  })
  @Get()
  findAll(@Request() req, @Query('isFamilyBill') isFamilyBill?: string) {
    // 转换查询参数为布尔值
    let isFamilyBillFilter: boolean | undefined;
    if (isFamilyBill === 'true') {
      isFamilyBillFilter = true;
    } else if (isFamilyBill === 'false') {
      isFamilyBillFilter = false;
    }
    return this.transactionsService.findAll(req.user.userId, isFamilyBillFilter);
  }

  @ApiOperation({
    summary: '获取交易统计摘要',
    description: '获取当前用户的收支统计信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        totalIncome: 5000,
        totalExpense: 2000,
        balance: 3000,
        categoryBreakdown: {
          '日常购物': 1000,
          '餐饮': 800,
          '交通': 200,
        },
      },
    },
  })
  @Get('summary')
  getSummary(@Request() req) {
    return this.transactionsService.getSummary(req.user.userId);
  }

  @ApiOperation({
    summary: '获取单个交易记录',
    description: '根据ID获取特定的交易记录详情',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '交易记录ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        id: 1,
        description: '超市购物',
        amount: 100.50,
        date: '2025-11-04',
        category: '日常购物',
        type: 'expense',
        isFamilyBill: true,
        userId: 1,
        user: {
          id: 1,
          username: '张三',
        },
        createdAt: '2025-11-04T12:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '交易记录不存在',
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.transactionsService.findOne(+id, req.user.userId);
  }

  @ApiOperation({
    summary: '更新交易记录',
    description: '更新指定ID的交易记录',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '交易记录ID',
    example: 1,
  })
  @ApiBody({
    type: UpdateTransactionDto,
    examples: {
      default: {
        value: {
          description: '超市大采购',
          amount: 150.75,
          category: '日常购物',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    schema: {
      example: {
        id: 1,
        description: '超市大采购',
        amount: 150.75,
        date: '2025-11-04',
        category: '日常购物',
        type: 'expense',
        isFamilyBill: true,
        userId: 1,
        updatedAt: '2025-11-04T13:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '交易记录不存在',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Request() req) {
    return this.transactionsService.update(+id, updateTransactionDto, req.user.userId);
  }

  @ApiOperation({
    summary: '删除交易记录',
    description: '删除指定ID的交易记录',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '交易记录ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '删除成功',
    schema: {
      example: {
        affected: 1,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '交易记录不存在',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.transactionsService.remove(+id, req.user.userId);
  }
}