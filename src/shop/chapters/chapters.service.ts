import { PrismaService } from '@core/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChaptersService {
    constructor(private readonly prisma: PrismaService) {}

    async createChapter(data: Prisma.ChapterCreateInput) {
        return await this.prisma.chapter.create({ data });
    }

    async getChapters() {
        return await this.prisma.chapter.findMany();
    }

    async getChapter(where?: Prisma.ChapterWhereUniqueInput) {
        return await this.prisma.chapter.findUnique({ where });
    }
}
