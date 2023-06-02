import { PrismaService } from '@core/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return await this.prisma;
    }
}
