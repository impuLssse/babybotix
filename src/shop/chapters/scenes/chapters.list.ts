import { ExtraService } from '@core/extra';
import { ActionContract, SceneContract } from '@shared/decorators';
import { IContext } from '@shared/interfaces';
import { Action, SceneEnter } from 'nestjs-telegraf';
import { ChaptersService } from '../chapters.service';
import { Logger } from '@nestjs/common';
import { SessionService } from '@core/session';

@SceneContract('scenes.shop.chapters.list')
export class ChaptersScene {
    constructor(
        private readonly extra: ExtraService,
        private readonly chaptersService: ChaptersService,
        private readonly sessionService: SessionService,
    ) {}

    @SceneEnter()
    async start(ctx: IContext): Promise<void> {
        const { extra, chaptersService } = this;
        const { lang } = ctx.session;

        const chapters = await chaptersService.getChapters();
        const chapterNames = chapters.map((chapter) => chapter.name);

        const keyboardChapters = extra.simpleKeyboard([...chapterNames], 'chapter_', { columns: 2 });
        const keyboardNavigation = extra.typedKeyboard([['buttons.admin.control'], ['buttons.back']], lang, {
            columns: 2,
        });
        const keyboardPaginated = extra.combineKeyboard(keyboardChapters, keyboardNavigation).inline();

        Logger.verbose(ctx.session.shop, `SESSION - SHOP/CHAPTERS`);

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.shop.chapters.list',
            ...keyboardPaginated,
        });
    }

    @Action(/chapter/)
    async catchChapter(ctx: IContext): Promise<void> {
        const chapter = ctx.callbackQuery.data.split('chapter_')[1];

        // ? Берем раздел магазина из БД, чтобы занести его в сессию
        const { id, name, description, image, category } = await this.chaptersService.getChapter(
            { name: chapter },
            { category: { include: { product: true } } },
        );
        this.sessionService.setChapterSession(ctx, { id, name, description, image });
        this.sessionService.setCategoriesSession(ctx, category);

        await ctx.scene.enter('scenes.shop.categories.list');
    }

    @ActionContract('buttons.back')
    async back(ctx: IContext): Promise<void> {
        await ctx.scene.enter('scenes.home');
    }

    @ActionContract('buttons.admin.control')
    async inputNameForNewChapter(ctx: IContext): Promise<void> {
        await ctx.scene.enter('scenes.shop.chapters.control');
    }
}
