import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext } from '@shared/interfaces';
import { SceneEnter } from 'nestjs-telegraf';
import { ProductsService } from '../products.service';

@SceneContract('scenes.shop.products.list')
export class ProductsScene {
    constructor(private readonly extra: ExtraService, private readonly productsService: ProductsService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, productsService } = this;
        const { lang } = ctx.session;
        const { id, name, description, image } = ctx.session.shop.chapter;

        const products = await productsService.getProducts({});

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.shop.products.list',
            ...extra.simpleInlineKeyboard([]),
        });
    }

    @ActionContract('buttons.products')
    async toUniqueProduct(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.products.control');
    }
}
