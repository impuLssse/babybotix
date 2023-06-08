import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { TranslateService } from '@core/translate';

@SceneContract('scenes.shop.products')
export class InputNameProductScene {
    constructor(private readonly extra: ExtraService, private readonly translate: TranslateService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, translate } = this;
        const { lang } = ctx.session;

        const name = this.translate.findPhrase('phrases.objects.name');
        const target = this.translate.findPhrase('phrases.shop.chapters.target');

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.objects.image',
            args: { object: name, target },
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
