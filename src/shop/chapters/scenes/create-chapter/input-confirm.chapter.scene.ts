import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext, IReplyOrEditOptions, IReplyOrEditWithPhotoOptions } from '@libs/shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { ChaptersService } from '../../chapters.service';
import { TranslateService } from '@core/translate';

@SceneContract('scenes.shop.chapters.confirm')
export class ConfirmChapterScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly chaptersService: ChaptersService,
        private readonly translate: TranslateService,
    ) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, chaptersService } = this;
        const { lang, image } = ctx.session;
        const { name, description } = ctx.session.shop.chapter;

        const shkiper = this.translate.findPhrase('phrases.shop.chapters.shkiper');
        const opts: IReplyOrEditOptions = {
            text: 'phrases.shop.chapters.confirm',
            args: { object: shkiper, name, description },
            ...extra.typedInlineKeyboard(
                [['buttons.add_photos'], ['buttons.accept', 'buttons.cancel'], ['buttons.back']],
                lang,
            ),
        };

        if (image) {
            const msg = await extra.replyOrEditWithPhoto(ctx, lang, { ...opts, image });
            ctx.session.messageId = msg.message_id;
        } else {
            const msg = await extra.replyOrEdit(ctx, lang, { ...opts });
            ctx.session.messageId = msg.message_id;
        }
    }

    @ActionContract('buttons.add_photos')
    async toAddPhotos(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.chapters.input-pics');
    }

    @ActionContract('buttons.accept')
    async accept(ctx: IContext) {
        const { name, description } = ctx.session.shop.chapter;

        const newChapter = await this.chaptersService.createChapter({ name, description });

        ctx.session.shkiper = '';
        ctx.session.shop.chapter = {};
        ctx.session.image = '';

        await ctx.scene.enter('scenes.shop.chapters.control');
    }

    @ActionContract('buttons.cancel')
    async cancel(ctx: IContext) {
        ctx.session.shkiper = '';
        ctx.session.shop.chapter = {};
        ctx.session.image = '';

        await ctx.scene.enter('scenes.shop.chapters.control');
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext) {
        ctx.session.shkiper = '';
        ctx.session.shop.chapter = {};
        ctx.session.image = '';

        await ctx.scene.enter('scenes.shop.chapters.input-description');
    }
}
