import { I18nPath, Langs } from '@shared/types';
import { Context as BaseContext, Scenes as TelegrafScenes } from 'telegraf';
import { CallbackQuery, Message, Update } from 'telegraf/typings/core/types/typegram';
import { SceneContextScene } from 'telegraf/typings/scenes';

export interface IContext extends BaseContext {
    update: Update.CallbackQueryUpdate & { message: Message.PhotoMessage };
    scene: ISceneContextScene;
    session: SessionData;
    message: Update.New & Update.NonChannel & Message & { text?: string };
    callbackQuery: CallbackQuery & { data: string };
}

interface ISceneContextScene extends SceneContextScene<IContext, SceneSession> {
    enter: (sceneId: I18nPath) => Promise<unknown>;
}

interface SessionData extends TelegrafScenes.SceneSession<SceneSession> {
    shop: {
        chapter?: {
            name?: string;
            description?: string;
        };
    };
    image?: string;
    messageId: number;
    shkiper: string;
    lang: Langs;
    isAdmin: boolean;
}

interface SceneSession extends TelegrafScenes.SceneSessionData {
    state: {
        token?: string;
    };
}
