import { Module } from '@nestjs/common';
import { ExtraModule } from '@core/extra';
import { ProductsModule } from './products';
import { ChaptersModule } from './chapters';
import { CategoriesModule } from './categories';

@Module({
    imports: [ChaptersModule, CategoriesModule, ProductsModule, ExtraModule],
})
export class ShopModule {}
