import { ExtraModule } from '@core/extra';
import { Module } from '@nestjs/common';
import { CategoriesScene, ConfirmCategoryScene, InputDescriptionCategotyScene, InputNameCategotyScene } from './scenes';
import { PrismaModule } from '@core/prisma';
import { TranslateModule } from '@core/translate';
import { CategoriesAdminScene } from './scenes';
import { CategoriesService } from './categories.service';
import { SessionModule, SessionService } from '@core/session';

@Module({
    imports: [ExtraModule, PrismaModule, TranslateModule, SessionModule],
    providers: [
        CategoriesScene,
        CategoriesAdminScene,
        InputNameCategotyScene,
        InputDescriptionCategotyScene,
        ConfirmCategoryScene,
        CategoriesService,
        SessionService,
    ],
})
export class CategoriesModule {}
