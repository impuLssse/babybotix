import { Start, Update } from 'nestjs-telegraf';
import { IContext } from '@shared/interfaces';

@Update()
export class BotUpdate {
    @Start()
    async start(ctx: IContext) {
        await ctx.scene.enter('home');
    }
}
