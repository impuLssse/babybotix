import { Module } from '@nestjs/common';
import {
    ChaptersAdminScene,
    ChaptersScene,
    ConfirmChapterScene,
    InputNameChapterScene,
    InputDescriptionChapterScene,
} from './scenes';
import { ExtraModule } from '@core/extra';
import { PrismaModule } from '@core/prisma';
import { ChaptersService } from './chapters.service';
import { TranslateModule } from '@core/translate';
import { HttpModule } from '@nestjs/axios';
import { CategoriesService } from '@shop/categories';
import { SessionModule, SessionService } from '@core/session';

@Module({
    imports: [ExtraModule, PrismaModule, TranslateModule, HttpModule, SessionModule],
    providers: [
        ChaptersScene,
        ChaptersAdminScene,
        InputNameChapterScene,
        InputDescriptionChapterScene,
        ConfirmChapterScene,
        ChaptersService,
        CategoriesService,
        SessionService,
    ],
})
export class ChaptersModule {}
