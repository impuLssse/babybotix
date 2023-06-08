import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext, IReplyOrEditOptions, IReplyOrEditWithPhotoOptions } from '@shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import { SessionService } from '@core/session';
import { CategoriesService } from '../categories.service';

@SceneContract('scenes.shop.categories.list')
export class CategoriesScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly sessionService: SessionService,
        private readonly categoriesService: CategoriesService,
    ) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, categoriesService } = this;
        const { lang } = ctx.session;
        const { id: chapterId, name, description, image } = ctx.session.shop.chapter;

        Logger.verbose(ctx.session.shop, `SESSION - SHOP/CATEGORIES`);

        const categories = await categoriesService.getCategories({ chapterId });
        const categoriesNames = categories.map((category) => category.name);

        const keyboardNavigation = extra.typedKeyboard([['buttons.admin.control'], ['buttons.back']], lang);
        const keyboardCategories = extra.simpleKeyboard([categoriesNames], 'category_', { columns: 2 });
        const keyboardFull = extra.combineKeyboard(keyboardCategories, keyboardNavigation).inline();

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
