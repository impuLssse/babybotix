import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { TranslateService } from '@core/translate';
import { SessionService } from '@core/session';

@SceneContract('scenes.shop.chapters.input-name')
export class InputNameChapterScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly sessionService: SessionService,
        private readonly translate: TranslateService,
    ) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, translate } = this;
        const { lang } = ctx.session;

        const [prop, target] = translate.findPhrases(
            lang,
            { phrase: 'phrases.objects.name' },
            { phrase: 'phrases.shop.chapters.target' },
        );

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.inputs.name',
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
