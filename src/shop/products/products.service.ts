import { PrismaService } from '@core/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
        return await this.prisma.product.create({ data });
    }

    async getProducts(where?: Prisma.ProductWhereInput): Promise<Product[]> {
        return await this.prisma.product.findMany({ where });
    }

    async getProduct(where?: Prisma.ChapterWhereUniqueInput): Promise<Product> {
        return await this.prisma.product.findUnique({ where });
    }
}
