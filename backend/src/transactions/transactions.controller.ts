import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create(createTransactionDto, req.user.userId);
  }

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

  @Get('summary')
  getSummary(@Request() req) {
    return this.transactionsService.getSummary(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.transactionsService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Request() req) {
    return this.transactionsService.update(+id, updateTransactionDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.transactionsService.remove(+id, req.user.userId);
  }
}