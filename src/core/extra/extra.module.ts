import { Module } from '@nestjs/common';
import { ExtraService } from './extra.service';
import { TranslateModule } from '@core/translate';

@Module({
    imports: [TranslateModule],
    providers: [ExtraService],
    exports: [ExtraService],
})
export class ExtraModule {}
