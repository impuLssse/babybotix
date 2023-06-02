import { ExtraService } from '@core/extra';
import { TranslateService } from '@core/translate';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.shop.products.create')
export class CreateProductScene {
    constructor(private readonly extra: ExtraService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.shop.products',
            args: { target: '' },
        });
    }

    @ActionContract('buttons.products')
    async toUniqueProduct(ctx: IContext) {
        // await ctx.scene.enter('');
    }
}
