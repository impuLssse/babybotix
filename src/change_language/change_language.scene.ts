import { ExtraService } from '@core/extra';
import { TranslateService } from '@core/translate';
import { IContext } from '@libs/shared/interfaces';
import { Langs } from '@libs/shared/types';
import { ActionContract, SceneContract } from '@shared/decorators';
import { Ctx, SceneEnter } from 'nestjs-telegraf';

@SceneContract('change_language')
export class ChangeLanguageScene {
    constructor(private readonly extra: ExtraService, private readonly translate: TranslateService) {}

    @SceneEnter()
    async enter(@Ctx() ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        extra.replyOrEdit(ctx, lang, {
            text: 'phrases.change_language',
            extra: {
                ...extra.makeInlineKeyboard(['languages.en', 'languages.ru']),
            },
        });
    }

    @ActionContract(['languages.ru', 'languages.en'])
    async switchLanguage(@Ctx() ctx: IContext) {
        const langFromCallback: Langs = ctx.callbackQuery.data.split('.')[1] as Langs;
        const langFromSession: Langs = ctx.session.lang;

        if (ctx.session.lang === langFromCallback) {
            await this.extra.replyAlert(ctx, langFromSession, {
                text: 'alerts.language_already_exists',
                args: { lang: langFromSession },
            });
            return;
        }

        ctx.session.lang = langFromCallback;

        await ctx.scene.reenter();
    }
}
