import { Module } from '@nestjs/common';
import { AdminScene } from './scenes';
import { ExtraModule } from '@core/extra';

@Module({
    imports: [ExtraModule],
    providers: [AdminScene],
    exports: [AdminScene],
})
export class AdminModule {}
