import { ExtraService } from '@core/extra';
import { SessionService } from '@core/session';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext } from '@shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.shop.categories.control')
export class CategoriesAdminScene {
    constructor(private readonly extra: ExtraService, private readonly sessionService: SessionService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.shop.categories.control',
            ...extra.typedInlineKeyboard([['buttons.shop.categories.create'], ['buttons.back']], lang),
        });
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.categories.list');
    }

    @ActionContract('buttons.shop.categories.create')
    async inputNameForNewChapter(ctx: IContext) {
        this.sessionService.resetCategorySession(ctx).resetImage(ctx);
        await ctx.scene.enter('scenes.shop.categories.input-name');
    }
}
