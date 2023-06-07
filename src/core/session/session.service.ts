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
        this.resetCategorySession(ctx)
            .resetChapterSession(ctx)
            .resetImage(ctx)
            .resetTarget(ctx)
            .resetPropsOnCreate(ctx);
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

    setCategoriesSession({ session }: IContext, categories: Category[]) {
        session.shop.chapter.categories = categories;
        return this;
    }

    resetChapterSession({ session }: IContext): this {
        session.shop.chapter = undefined;
        return this;
    }

    resetCategorySession({ session }: IContext): this {
        session.shop.category = undefined;
        return this;
    }

    resetImage({ session }: IContext): this {
        session.image = undefined;
        return this;
    }

    resetTarget({ session }: IContext): this {
        session.target = undefined;
        return this;
    }

    resetPropsOnCreate<T>({ session }: IContext): this {
        session.creation = {};
        return this;
    }
}
