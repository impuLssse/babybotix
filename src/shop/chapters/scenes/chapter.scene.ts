import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@libs/shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { Action, SceneEnter } from 'nestjs-telegraf';
import { ChaptersService } from '../chapters.service';

@SceneContract('scenes.shop.chapters.section')
export class ChapterSectionScene {
    constructor(private readonly extra: ExtraService, private readonly chaptersService: ChaptersService) {}

    @SceneEnter()
    async start(ctx: IContext) {
        const { extra, chaptersService } = this;
        const { lang } = ctx.session;

        const chapters = await chaptersService.getChapters();
        const chapterNames = chapters.map((chapter) => chapter.name);

        const keyboardWithChapterNames = extra
            .combineKeyboard(
                extra.simpleKeyboard([chapterNames], 'chapter_'),
                extra.typedKeyboard([['buttons.admin.control'], ['buttons.back']], lang),
            )
            .inline();

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.shop.chapters.list',
            ...keyboardWithChapterNames,
        });
    }

    @Action(/chapter/)
    async catchChapter(ctx: IContext) {
        const { chaptersService } = this;
        const chapter = ctx.callbackQuery.data.split('chapter_')[1];

        const find = await chaptersService.getChapter({ name: chapter });
        console.log(find);
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext) {
        await ctx.scene.enter('scenes.home');
    }

    @ActionContract('buttons.admin.control')
    async inputNameForNewChapter(ctx: IContext) {
        await ctx.scene.enter('scenes.shop.chapters.control');
    }
}