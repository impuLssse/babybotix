import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.home')
export class HomeScene {
    constructor(private readonly extra: ExtraService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.home',
            args: { username: ctx.from.username },
            ...extra.typedInlineKeyboard(
                [['buttons.faq', 'buttons.change_language', 'buttons.buy'], [{ text: 'buttons.admin' }]],
                lang,
            ),
        });
    }

    @ActionContract('buttons.admin')
    async toAdminPanel(ctx: IContext) {
        await ctx.scene.enter('scenes.admin');
    }

    @ActionContract('buttons.buy')
    async toUniqueChapter(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.chapters.list');
    }

    @ActionContract('buttons.faq')
    async toFAQ(ctx: IContext) {
        await ctx.scene.enter('scenes.faq');
    }

    @ActionContract('buttons.change_language')
    async toChangeLanguage(ctx: IContext) {
        await ctx.scene.enter('scenes.change_language');
    }
}
