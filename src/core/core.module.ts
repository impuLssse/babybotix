import { Module } from '@nestjs/common';
import { TranslateModule, TranslateService } from './translate';
import { PrismaModule, PrismaService } from './prisma';
import { ExtraModule, ExtraService } from './extra';
import { PaginationModule, PaginationService } from './pagination';
import { SessionModule, SessionService } from './session';

@Module({
    imports: [TranslateModule, PrismaModule, ExtraModule, PaginationModule, SessionModule],
    providers: [TranslateService, PrismaService, ExtraService, PaginationService, SessionService],
})
export class CoreModule {}
