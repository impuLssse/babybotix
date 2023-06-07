import { IContext } from '@libs/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
    resetPaginationSession(ctx: IContext) {
        ctx.session.pagination = {};
    }
}
