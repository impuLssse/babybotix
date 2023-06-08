import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext } from '@shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { TranslateService } from '@core/translate';

@SceneContract('scenes.shop.categories.input-description')
export class InputDescriptionCategotyScene {
    constructor(private readonly extra: ExtraService, private readonly translate: TranslateService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, translate } = this;
        const { lang, creation } = ctx.session;

        const [propPrevious, prop, target] = translate.findPhrases(
            lang,
            { phrase: 'phrases.objects.name' },
            { phrase: 'phrases.objects.description' },
            { phrase: 'phrases.shop.categories.target' },
        );

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.inputs.description',
            args: { prop, target, item1: propPrevious, value1: creation.name },
            ...extra.typedInlineKeyboard(['buttons.back'], lang),
        });
    }

    @ActionContract('buttons.back')
    async inputNameForNewChapter(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.categories.input-name');
    }

    @On('text')
    async onInputName(ctx: IContext) {
        ctx.session.creation.description = ctx.message.text;
        await ctx.scene.enter('scenes.shop.categories.confirm');
    }
}
