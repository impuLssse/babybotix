import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { ChaptersService } from '../../chapters.service';
import { TranslateService } from '@core/translate';
import { SessionService } from '@core/session';

@SceneContract('scenes.shop.chapters.input-name')
export class InputNameChapterScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly chaptersService: ChaptersService,
        private readonly sessionService: SessionService,
        private readonly translate: TranslateService,
    ) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        const prop = this.translate.findPhrase('phrases.objects.name', lang);
        const target = this.translate.findPhrase('phrases.shop.chapters.target', lang);

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.shop.chapters.input-name',
            args: { prop, target },
            ...extra.typedInlineKeyboard(['buttons.back'], lang),
        });
    }

    @ActionContract('buttons.back')
    async inputNameForNewChapter(ctx: IContext) {
        this.sessionService.resetChapterSession(ctx);
        await ctx.scene.enter('scenes.shop.chapters.control');
    }

    @On('text')
    async onInputName(ctx: IContext) {
        ctx.session.creation = { name: ctx.message.text };
        await ctx.scene.enter('scenes.shop.chapters.input-description');
    }
}
