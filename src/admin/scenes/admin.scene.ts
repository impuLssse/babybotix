import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.admin')
export class AdminScene {
    constructor(private readonly extra: ExtraService) {}

    @SceneEnter()
    async enter(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        await extra.replyOrEdit(ctx, ctx.session.lang, {
            text: 'phrases.admin',
            ...extra.typedInlineKeyboard([['buttons.products']], lang),
        });
    }

    @ActionContract('buttons.products')
    async back(ctx: IContext) {
        await ctx.scene.enter('scenes.home');
    }
}
