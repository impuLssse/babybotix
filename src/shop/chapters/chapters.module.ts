import { Module } from '@nestjs/common';
import {
    ChaptersAdminScene,
    ChaptersScene,
    ConfirmChapterScene,
    InputNameChapterScene,
    InputPicsChapterScene,
} from './scenes';
import { ExtraModule } from '@core/extra';
import { PrismaModule } from '@core/prisma';
import { ChaptersService } from './chapters.service';
import { TranslateModule } from '@core/translate';
import { InputDescriptionChapterScene } from './scenes/create-chapter/input-description.chapter.scene';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [ExtraModule, PrismaModule, TranslateModule, HttpModule],
    providers: [
        ChaptersScene,
        ChaptersAdminScene,
        InputNameChapterScene,
        InputDescriptionChapterScene,
        InputPicsChapterScene,
        ConfirmChapterScene,
        ChaptersService,
    ],
})
export class ChaptersModule {}
