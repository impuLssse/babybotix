import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { ChaptersService } from '../../chapters.service';
import { TranslateService } from '@core/translate';

@SceneContract('scenes.shop.chapters.input-description')
export class InputDescriptionChapterScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly chaptersService: ChaptersService,
        private readonly translate: TranslateService,
    ) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, chaptersService } = this;
        const { lang } = ctx.session;

        const description = this.translate.findPhrase('phrases.objects.description');
        const shkiper = this.translate.findPhrase('phrases.shop.chapters.shkiper');

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.templates.enter',
            args: { object: description, subject: shkiper },
            ...extra.typedInlineKeyboard(['buttons.back'], lang),
        });
    }

    @ActionContract('buttons.back')
    async inputNameForNewChapter(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.chapters.input-name');
    }

    @On('text')
    async onInputDescription(ctx: IContext) {
        ctx.session.shop.chapter.description = ctx.message.text;
        await ctx.scene.enter('scenes.shop.chapters.confirm');
    }
}
