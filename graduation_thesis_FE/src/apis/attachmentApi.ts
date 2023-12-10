import { BaseApi } from './baseApi';
import { useAuthStore } from '@/stores/authStore';
class AttachmentApi extends BaseApi {
    constructor() {
        super('Attachments');
        this.config = {
            headers: {
                // 'Content-Type': 'multipart/form-data'
                'Content-Type': '*',
            },
        };
    }

    async getByKey(key: string) {
        let res = await this.getFile(this.API_URL + `/aws?key=${key}`);
        return res;
    }

    async getFileKeyByRef(refId: any, refType: any) {
        let res = await this.get(
            this.API_URL + `/file-key?refId=${refId}&refType=${refType}`
        );
        return res;
    }

    async uploadFile(file: string, prefix: any, refId: any, refType: any) {
        const formData = new FormData();
        formData.append('file', file);
        let createdBy = useAuthStore().userInfo.id;
        let res = await this.post(
            this.API_URL +
                `/aws?prefix=${prefix}&refId=${refId}&refType=${refType}&createdBy=${createdBy}`,
            formData
        );
        return res;
    }

    async deleteFile(key: string) {
        let res = await this.delete(this.API_URL + `/aws?key=${key}`);
        return res;
    }
}

export default new AttachmentApi();
