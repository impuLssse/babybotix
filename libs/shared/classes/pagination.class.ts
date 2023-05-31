import { IPagination } from '../interfaces';

export class Pagination {
    static transform(values: Partial<IPagination>): IPagination {
        const newValues: IPagination = {
            limit: 16,
            offset: 0,
        };

        if (values.limit <= 16) {
            newValues.limit = 16;
        }

        if (values.offset) {
            newValues.offset = (values.offset - 1) * values.limit;
        }

        return newValues;
    }
}
