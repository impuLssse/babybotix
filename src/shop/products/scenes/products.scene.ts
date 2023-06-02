import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';

@SceneContract('scenes.shop.products.list')
export class ProductsScene {
    constructor(private readonly extra: ExtraService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra } = this;
        const { lang } = ctx.session;

        extra.replyOrEdit(ctx, lang, {
            text: 'phrases.shop.products.list',
            ...extra.simpleInlineKeyboard([]),
        });
    }

    @ActionContract('buttons.products')
    async toUniqueProduct(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.products.control');
    }
}
