import { BaseApi } from './baseApi';

class AuthApi extends BaseApi {
    constructor() {
        super('Auth');
    }

    async login(userInfo: object) {
        let res = await this.post(this.API_URL + '/login', userInfo);
        return res;
    }

    async signUp(userInfo: object) {
        let res = await this.post(this.API_URL + '/signup', userInfo);
        return res;
    }

    async forgot(userInfo: object) {
        let res = await this.post(this.API_URL + '/forgot-password', userInfo);
        return res;
    }

    async logout(userInfo: object) {
        let res = '';
        return res;
    }
}

export default new AuthApi();
