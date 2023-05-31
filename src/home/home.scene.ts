import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('home')
export class HomeScene {
    constructor(private readonly extra: ExtraService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.home',
            args: { username: ctx.from.username },
            ...extra.makeInlineKeyboard(['buttons.faq', 'buttons.change_language'], lang),
        });
    }

    @ActionContract('buttons.faq')
    async toFAQ(ctx: IContext) {
        await ctx.scene.enter('faq');
    }

    @ActionContract('buttons.change_language')
    async toChangeLanguage(ctx: IContext) {
        await ctx.scene.enter('change_language');
    }
}
