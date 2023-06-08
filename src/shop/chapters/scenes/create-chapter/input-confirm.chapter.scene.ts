import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext, IReplyOrEditOptions } from '@shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { ChaptersService } from '../../chapters.service';
import { TranslateService } from '@core/translate';
import { SessionService } from '@core/session';

@SceneContract('scenes.shop.chapters.confirm')
export class ConfirmChapterScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly chaptersService: ChaptersService,
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
            { phrase: 'phrases.shop.chapters.target' },
        );

        const keyboardIfHaveImage = extra.typedKeyboard(['buttons.delete_photo'], lang);
        const keyboardNavigation = extra.typedKeyboard([['buttons.accept', 'buttons.cancel'], ['buttons.back']], lang);

        const keyboard = image
            ? extra.combineKeyboard(keyboardIfHaveImage, keyboardNavigation).inline()
            : keyboardNavigation.inline();

        const opts: IReplyOrEditOptions = {
            text: 'phrases.shop.chapters.confirm',
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

    @ActionContract('buttons.cancel')
    async cancel(ctx: IContext) {
        this.sessionService.resetChapterSession(ctx).resetImage(ctx);
        await ctx.scene.enter('scenes.shop.chapters.control');
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.chapters.input-description');
    }

    @ActionContract('buttons.accept')
    async accept(ctx: IContext) {
        const { extra, translate, chaptersService, sessionService } = this;
        const { lang, image } = ctx.session;
        const chapter = ctx.session.creation;

        await extra.tryDeleteMessege(ctx);

        const newChapter = await chaptersService.createChapter({ ...chapter, image });
        sessionService.resetPropsOnCreate(ctx);

        const prop = translate.findPhrase('phrases.objects.name');
        const target = translate.findPhrase('phrases.shop.chapters.target');

        await extra.replyAlert(ctx, lang, {
            text: 'alerts.success_created',
            args: { target, prop, value: newChapter.name },
        });

        await ctx.scene.enter('scenes.shop.chapters.control');
    }

    @On('photo')
    async onInputDescription(ctx: IContext) {
        await this.extra.saveImage(ctx);

        await this.extra.tryDeleteMessege(ctx);
        await ctx.scene.reenter();
    }
}
