import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext, IReplyOrEditOptions } from '@shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';
import { TranslateService } from '@core/translate';
import { SessionService } from '@core/session';
import { CategoriesService } from '@shop/categories/categories.service';

@SceneContract('scenes.shop.categories.confirm')
export class ConfirmCategoryScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly categoriesService: CategoriesService,
        private readonly sessionService: SessionService,
        private readonly translate: TranslateService,
    ) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra } = this;
        const { lang, image } = ctx.session;
        const { name, description } = ctx.session.creation;

        const target = this.translate.findPhrase('phrases.shop.categories.confirm', lang);

        const opts: IReplyOrEditOptions = {
            text: 'phrases.shop.categories.confirm',
            args: { target, name, description },
            ...extra.typedInlineKeyboard([['buttons.accept', 'buttons.cancel'], ['buttons.back']], lang),
        };

        if (image) {
            const msg = await extra.replyOrEditWithPhoto(ctx, lang, { ...opts, image });
            ctx.session.messageId = msg.message_id;
        } else {
            const msg = await extra.replyOrEdit(ctx, lang, { ...opts });
            ctx.session.messageId = msg.message_id;
        }
    }

    @ActionContract('buttons.accept')
    async accept(ctx: IContext) {
        await ctx.deleteMessage(ctx.session.messageId);
        await this.categoriesService.createCategory(ctx.session.shop.chapter.id, { ...ctx.session.shop.category });
        this.sessionService.resetCategorySession(ctx);

        await ctx.scene.enter('scenes.shop.categories.control');
    }

    @ActionContract('buttons.cancel')
    async cancel(ctx: IContext) {
        this.sessionService.resetCategorySession(ctx);
        await ctx.scene.enter('scenes.shop.categories.control');
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.categories.input-description');
    }
}
