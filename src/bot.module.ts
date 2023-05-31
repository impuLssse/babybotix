import 'reflect-metadata';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Global, NotFoundException } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotConst } from '@shared/constants';
import { BotUpdate } from './bot.update';
import { Postgres } from '@telegraf/session/pg';
import { session } from 'telegraf';
import { PostgresAdapter } from 'kysely';
import { TranslateModule } from '@core/translate';
import { CoreModule } from '@core';
import { ChangeLanguageModule } from './change_language/change_language.module';
import { InfoModule } from './info/info.module';
import { HomeModule } from './home/home.module';

const store = (config: ConfigService) => {
    return Postgres<PostgresAdapter>({
        database: config.get<string>('DATABASE_NAME'),
        host: config.get<string>('DATABASE_HOST'),
        user: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASS'),
        onInitError(err) {
            throw new NotFoundException(`Config value in not found`, err);
        },
    });
};

@Global()
@Module({
    imports: [
        CoreModule,
        ConfigModule.forRoot({ isGlobal: true }),
        TelegrafModule.forRootAsync({
            botName: BotConst.NAME,
            imports: [ConfigModule, TranslateModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                token: config.get<string>('BOT_TOKEN'),
                middlewares: [session({ store: store(config) })],
                include: [BotModule],
            }),
        }),
        ChangeLanguageModule,
        InfoModule,
        HomeModule,
    ],
    controllers: [BotController],
    providers: [BotService, BotUpdate],
})
export class BotModule {}
