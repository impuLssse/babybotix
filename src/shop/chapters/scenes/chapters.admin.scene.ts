import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { SessionService } from '@core/session';

@SceneContract('scenes.shop.chapters.control')
export class ChaptersAdminScene {
    constructor(private readonly extra: ExtraService, private readonly sessionService: SessionService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.shop.chapters.control',
            ...extra.typedInlineKeyboard([['buttons.shop.chapters.create'], ['buttons.back']], lang),
        });
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.chapters.list');
    }

    @ActionContract('buttons.shop.chapters.create')
    async inputNameForNewChapter(ctx: IContext) {
        this.sessionService.resetPropsOnCreate(ctx).resetImage(ctx);
        await ctx.scene.enter('scenes.shop.chapters.input-name');
    }
}
