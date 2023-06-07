import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { TranslateService } from '@core/translate';

@SceneContract('scenes.shop.chapters.input-description')
export class InputDescriptionChapterScene {
    constructor(private readonly extra: ExtraService, private readonly translate: TranslateService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, translate } = this;
        const { lang, creation } = ctx.session;

        const prop_prev = translate.findPhrase('phrases.objects.name', lang);
        const prop = translate.findPhrase('phrases.objects.description', lang);
        const target = translate.findPhrase('phrases.shop.chapters.target', lang);

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.shop.chapters.input-description',
            args: { prop, target, item1: prop_prev, value1: creation.name },
            ...extra.typedInlineKeyboard(['buttons.back'], lang),
        });
    }

    @ActionContract('buttons.back')
    async inputNameForNewChapter(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.chapters.input-name');
    }

    @On('text')
    async onInputDescription(ctx: IContext) {
        ctx.session.creation.description = ctx.message.text;
        await ctx.scene.enter('scenes.shop.chapters.confirm');
    }
}
