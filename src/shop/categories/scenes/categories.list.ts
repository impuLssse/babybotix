import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext, IReplyOrEditOptions, IReplyOrEditWithPhotoOptions } from '@shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import { SessionService } from '@core/session';

@SceneContract('scenes.shop.categories.list')
export class CategoriesScene {
    constructor(private readonly extra: ExtraService, private readonly sessionService: SessionService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;
        const { name, description, image, categories } = ctx.session.shop.chapter;

        Logger.verbose(ctx.session.shop, `SESSION - SHOP/CATEGORIES`);

        const keyboardNavigation = extra.typedKeyboard([['buttons.admin.control'], ['buttons.back']], lang);
        const keyboardCategories = extra.simpleKeyboard([]);
        const keyboardFull = extra.combineKeyboard(keyboardNavigation, keyboardCategories).inline();

        const opts = {
            text: 'phrases.shop.categories.list',
            args: { categories_count: categories.length, chapter: name, description },
            ...keyboardFull,
        } as IReplyOrEditOptions;

        if (image) {
            const msg = await extra.replyOrEditWithPhoto(ctx, lang, {
                ...opts,
                image,
            } as IReplyOrEditWithPhotoOptions);

            ctx.session.messageId = msg.message_id;
        } else {
            await extra.replyOrEdit(ctx, lang, opts);
        }
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext) {
        const {
            shop: {
                chapter: { image },
            },
            messageId,
        } = ctx.session;

        if (image && messageId) {
            ctx.session.shop.chapter.image = '';
            await ctx.deleteMessage(messageId);
        }

        this.sessionService.resetChapterSession(ctx);
        await ctx.scene.enter('scenes.shop.chapters.list');
    }

    @ActionContract('buttons.admin.control')
    async toUniqueProduct(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.categories.control');
    }
}
