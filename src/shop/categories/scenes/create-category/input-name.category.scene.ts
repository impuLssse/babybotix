import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext } from '@shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { TranslateService } from '@core/translate';
import { SessionService } from '@core/session';

@SceneContract('scenes.shop.categories.input-name')
export class InputNameCategotyScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly translate: TranslateService,
        private readonly sessionService: SessionService,
    ) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, translate } = this;
        const { lang } = ctx.session;

        const [prop, target] = translate.findPhrases(
            lang,
            { phrase: 'phrases.objects.name' },
            { phrase: 'phrases.shop.categories.target' },
        );

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.inputs.name',
            args: { prop, target },
            ...extra.typedInlineKeyboard(['buttons.back'], lang),
        });
    }

    @ActionContract('buttons.back')
    async inputNameForNewChapter(ctx: IContext) {
        this.sessionService.resetCategorySession(ctx);
        await ctx.scene.enter('scenes.shop.categories.control');
    }

    @On('text')
    async onInputName(ctx: IContext) {
        ctx.session.creation = {
            name: ctx.message.text,
        };

        await ctx.scene.enter('scenes.shop.categories.input-description');
    }
}
