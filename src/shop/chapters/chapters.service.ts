import { PrismaService } from '@core/prisma';
import { ICreateEntity } from '@shared/interfaces';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChaptersService {
    constructor(private readonly prisma: PrismaService) {}

    async createChapter(chapter: ICreateEntity) {
        return await this.prisma.chapter.create({ data: { ...(chapter as Required<ICreateEntity>) } });
    }

    async getChapters(where?: Prisma.ChapterFindManyArgs) {
        return await this.prisma.chapter.findMany(where);
    }

    async getChapter(where?: Prisma.ChapterWhereUniqueInput, include?: Prisma.ChapterInclude) {
        return await this.prisma.chapter.findUnique({ where, include });
    }
}
