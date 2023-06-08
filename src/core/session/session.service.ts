import { IContext } from '@shared/interfaces';
import { Injectable } from '@nestjs/common';
import { Category, Chapter } from '@prisma/client';
import { Message } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class SessionService {
    /**
     * * Опасно, если играться то можно убить сессии всех юзеров
     * * Сообщение умникам, которые пишут: сделай просто `ctx.session = undefined`
     * * ! Идите в пизду
     * */
    resetBotSession(ctx: IContext): void {
        this.resetCategorySession(ctx).resetChapterSession(ctx).resetImage(ctx).resetPropsOnCreate(ctx);
    }

    /**
     * * Устанавливаем последнее сообщение в сцену, чтобы в любой следующей сцене удалить его
     * * В основном это делается, когда мы не можем изменить сообщение с фотографией (можем лишь удалить и отправить новое)
     * */
    setLastMessageId({ session }: IContext, msg: Message) {
        session.messageId = msg.message_id;
        return this;
    }

    setChapterSession({ session }: IContext, chapter: Chapter): this {
        session.shop.chapter = chapter;
        return this;
    }

    setCategoriesSession({ session }: IContext, categories: Category[]): this {
        session.shop.chapter.categories = categories;
        return this;
    }

    setImage({ session }: IContext, url: URL) {
        session.image = url.toString();
        return this;
    }

    resetChapterSession({ session }: IContext): this {
        session.shop.chapter = {};
        return this;
    }

    resetCategorySession({ session }: IContext): this {
        session.shop.category = {};
        return this;
    }

    resetImage({ session }: IContext): this {
        session.image = '';
        return this;
    }

    resetTarget({ session }: IContext): this {
        session.target = '';
        return this;
    }

    resetPropsOnCreate({ session }: IContext): this {
        session.creation = {};
        return this;
    }
}
