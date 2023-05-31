import { I18nPath, Langs, Scenes } from '@shared/types';
import { Context as BaseContext, Scenes as TelegrafScenes } from 'telegraf';
import { CallbackQuery, Update } from 'telegraf/typings/core/types/typegram';
import { SceneContextScene } from 'telegraf/typings/scenes';

export interface IContext extends BaseContext {
    update: Update.CallbackQueryUpdate;
    scene: ISceneContextScene;
    session: SessionData;
    callbackQuery: CallbackQuery & { data: string };
    match: any;
}

interface ISceneContextScene extends SceneContextScene<IContext, SceneSession> {
    enter: (sceneId: Scenes) => Promise<unknown>;
}

interface SessionData extends TelegrafScenes.SceneSession<SceneSession> {
    lang: Langs;
}

interface SceneSession extends TelegrafScenes.SceneSessionData {
    state: {
        token?: string;
    };
}
