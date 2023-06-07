import { PrismaService } from '@core/prisma';
import { ICreateEntity } from '@shared/interfaces';
import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async createCategory(chapterId: number, category: ICreateEntity): Promise<Category> {
        return await this.prisma.category.create({
            data: {
                chapterId,
                ...(category as Required<ICreateEntity>),
            },
        });
    }

    async getCategories(where?: Prisma.CategoryWhereInput): Promise<Category[]> {
        return await this.prisma.category.findMany({ where });
    }

    async getCategory(where?: Prisma.CategoryWhereUniqueInput): Promise<Category> {
        return await this.prisma.category.findUnique({ where });
    }
}
