import { ExtraModule } from '@core/extra';
import { Module } from '@nestjs/common';
import { CreateProductScene, ProductsScene } from './scenes';

@Module({
    imports: [ExtraModule],
    providers: [ProductsScene, CreateProductScene],
})
export class ProductsModule {}
