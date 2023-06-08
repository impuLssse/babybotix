import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext, IReplyOrEditOptions } from '@shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
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
        const { extra, translate, sessionService } = this;
        const { lang, image, creation } = ctx.session;

        const [propPrevious, prop, target] = translate.findPhrases(
            lang,
            { phrase: 'phrases.objects.description' },
            { phrase: 'phrases.objects.name' },
            { phrase: 'phrases.shop.categories.target' },
        );

        const keyboardIfHaveImage = extra.typedKeyboard(['buttons.delete_photo'], lang);
        const keyboardNavigation = extra.typedKeyboard([['buttons.accept', 'buttons.cancel'], ['buttons.back']], lang);

        const keyboard = image
            ? extra.combineKeyboard(keyboardIfHaveImage, keyboardNavigation).inline()
            : keyboardNavigation.inline();

        const opts: IReplyOrEditOptions = {
            text: 'phrases.shop.categories.confirm',
            args: {
                target,
                item1: prop,
                value1: creation.name,
                item2: propPrevious,
                value2: creation.description,
            },
            ...keyboard,
        };

        if (image) {
            const msg = await extra.replyOrEditWithPhoto(ctx, lang, { ...opts, image });
            sessionService.setLastMessageId(ctx, msg);
        } else {
            const msg = await extra.replyOrEdit(ctx, lang, { ...opts });
            sessionService.setLastMessageId(ctx, msg);
        }
    }

    @ActionContract('buttons.delete_photo')
    async deletePhoto(ctx: IContext) {
        await this.extra.tryDeleteMessege(ctx);
        this.sessionService.resetImage(ctx);
        await ctx.scene.reenter();
    }

    @ActionContract('buttons.accept')
    async accept(ctx: IContext) {
        await ctx.deleteMessage(ctx.session.messageId);
        await this.categoriesService.createCategory(ctx.session.shop.chapter.id, { ...ctx.session.creation });
        this.sessionService.resetCategorySession(ctx);

        await ctx.scene.enter('scenes.shop.categories.control');
    }

    @ActionContract('buttons.cancel')
    async cancel(ctx: IContext) {
        this.sessionService.resetCategorySession(ctx).resetImage(ctx);
        await ctx.scene.enter('scenes.shop.categories.control');
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.categories.input-description');
    }

    @On('photo')
    async onInputDescription(ctx: IContext) {
        await this.extra.saveImage(ctx);

        await this.extra.tryDeleteMessege(ctx);
        await ctx.scene.reenter();
    }
}
