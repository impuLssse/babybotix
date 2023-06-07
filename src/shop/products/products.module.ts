import { ExtraModule } from '@core/extra';
import { Module } from '@nestjs/common';
import { InputNameProductScene, ProductsScene } from './scenes';
import { ProductsService } from './products.service';
import { PrismaModule } from '@core/prisma';
import { TranslateModule } from '@core/translate';

@Module({
    imports: [ExtraModule, PrismaModule, TranslateModule],
    providers: [ProductsService, ProductsScene, InputNameProductScene],
})
export class ProductsModule {}
