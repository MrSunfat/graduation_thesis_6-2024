import { BaseApi } from './baseApi';

class ReviewApi extends BaseApi {
    constructor() {
        super('Reviews');
    }

    async addReview(review: object) {
        let res = await this.post(this.API_URL, review);
        return res;
    }

    async getReviewHistory(userId: any) {
        let res = await this.get(this.API_URL + `/history?userId=${userId}`);
        return res;
    }
}

export default new ReviewApi();
