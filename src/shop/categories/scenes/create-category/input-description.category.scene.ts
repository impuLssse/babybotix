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
        const { extra } = this;
        const { lang } = ctx.session;

        const description = this.translate.findPhrase('phrases.objects.description', lang);
        const target = this.translate.findPhrase('phrases.shop.categories.target', lang);

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.shop.categories.list',
            args: { object: description, target },
            ...extra.typedInlineKeyboard(['buttons.back'], lang),
        });
    }

    @ActionContract('buttons.back')
    async inputNameForNewChapter(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.categories.control');
    }

    @On('text')
    async onInputName(ctx: IContext) {
        ctx.session.creation = {
            description: ctx.message.text,
        };

        await ctx.scene.enter('scenes.shop.categories.confirm');
    }
}
