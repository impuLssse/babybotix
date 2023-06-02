import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { On, SceneEnter } from 'nestjs-telegraf';
import { ChaptersService } from '../../chapters.service';
import { TranslateService } from '@core/translate';
import { HttpService } from '@nestjs/axios';

@SceneContract('scenes.shop.chapters.input-pics')
export class InputPicsChapterScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly chaptersService: ChaptersService,
        private readonly translate: TranslateService,
        private readonly http: HttpService,
    ) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, chaptersService } = this;
        const { lang } = ctx.session;

        const pics = this.translate.findPhrase('phrases.objects.pics');
        const shkiper = this.translate.findPhrase('phrases.shop.chapters.shkiper');

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.templates.enter',
            args: { object: pics, subject: shkiper },
            ...extra.typedInlineKeyboard(['buttons.back'], lang),
        });
    }

    @ActionContract('buttons.back')
    async inputNameForNewChapter(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.chapters.confirm');
    }

    @On('photo')
    async onInputDescription(ctx: IContext) {
        const { file_id } = ctx.update.message.photo.pop();

        const url = await ctx.telegram.getFileLink(file_id);
        ctx.session.image = url.toString();

        console.log(ctx.session);

        await ctx.scene.enter('scenes.shop.chapters.confirm');
    }
}
