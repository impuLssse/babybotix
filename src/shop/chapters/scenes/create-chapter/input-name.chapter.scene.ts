import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { ChaptersService } from '../../chapters.service';
import { TranslateService } from '@core/translate';

@SceneContract('scenes.shop.chapters.input-name')
export class InputNameChapterScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly chaptersService: ChaptersService,
        private readonly translate: TranslateService,
    ) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, chaptersService } = this;
        const { lang } = ctx.session;

        const name = this.translate.findPhrase('phrases.objects.name');
        const shkiper = this.translate.findPhrase('phrases.shop.chapters.shkiper');

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.templates.enter',
            args: { object: name, subject: shkiper },
            ...extra.typedInlineKeyboard(['buttons.back'], lang),
        });
    }

    @ActionContract('buttons.back')
    async inputNameForNewChapter(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.chapters.control');
    }

    @On('text')
    async onInputName(ctx: IContext) {
        ctx.session.shop = {
            chapter: {
                name: ctx.message.text,
            },
        };

        await ctx.scene.enter('scenes.shop.chapters.input-description');
    }
}
