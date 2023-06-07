import { Module } from '@nestjs/common';
import { AdminScene } from './scenes';
import { ExtraModule } from '@core/extra';
import { TranslateModule } from '@core/translate';
import { ChaptersModule, ChaptersService } from '@shop';
import { CategoriesModule, CategoriesService } from '@shop/categories';
import { SessionModule, SessionService } from '@core/session';
import { PrismaModule } from '@core/prisma';

@Module({
    imports: [ExtraModule, TranslateModule, ChaptersModule, CategoriesModule, SessionModule, PrismaModule],
    providers: [
        AdminScene,
        SessionService,
        ChaptersService,
        CategoriesService,
    ],
})
export class AdminModule {}
