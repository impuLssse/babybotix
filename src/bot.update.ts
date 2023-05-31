import { Start, Ctx, Update } from 'nestjs-telegraf';
import { ExtraService } from '@core/extra';
import { TranslateService } from '@core/translate';
import { ActionContract } from '@shared/decorators';
import { IContext } from '@shared/interfaces';

@Update()
export class BotUpdate {
    constructor(private readonly extra: ExtraService, private readonly translate: TranslateService) {}

    @Start()
    async start(@Ctx() ctx: IContext) {
        const { extra, translate } = this;
        const { lang = 'en' } = ctx.session;

        const enterPhrase = translate.findPhrase('phrases.start', lang, { username: ctx.from.username });

        await ctx.reply(enterPhrase, {
            ...extra.makeInlineKeyboard(['buttons.change_language']),
        });
    }

    @ActionContract('buttons.change_language')
    async changeLanguage(@Ctx() ctx: IContext) {
        await ctx.scene.enter('change_language');
    }
}
