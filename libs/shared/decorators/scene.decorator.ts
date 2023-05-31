import { Scenes } from '@libs/shared/types';
import { Scene } from 'nestjs-telegraf';

export function SceneContract(sceneId: Scenes): ClassDecorator {
    return Scene(sceneId as string);
}
