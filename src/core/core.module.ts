import { Module } from '@nestjs/common';
import { TranslateModule, TranslateService } from './translate';
import { PrismaModule, PrismaService } from './prisma';
import { ExtraModule, ExtraService } from './extra';

@Module({
    imports: [TranslateModule, PrismaModule, ExtraModule],
    providers: [TranslateService, PrismaService, ExtraService],
    exports: [TranslateService, PrismaService, ExtraService],
})
export class CoreModule {}
