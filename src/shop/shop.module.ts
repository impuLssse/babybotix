import { Module } from '@nestjs/common';
import { ProductsModule } from './products';
import { ChaptersModule } from './chapters';
import { ExtraModule } from '@core/extra';

@Module({
    imports: [ChaptersModule, ProductsModule, ExtraModule],
})
export class ShopModule {}
