import { BaseApi } from './baseApi';

class WorkApi extends BaseApi {
    constructor() {
        super('Works');
    }

    async getAll() {
        let res = await this.get(this.API_URL);
        return res;
    }

    async getById(jobId: any) {
        let res = await this.get(this.API_URL + '/' + jobId);
        return res;
    }

    async getByFreelancerId(freelancerId: any, workStatus = null) {
        let queryPath = `/freelancer?freelancerId=${freelancerId}`;
        if (workStatus !== null) {
            queryPath += `&workStatus=${workStatus}`;
        }
        let res = await this.get(this.API_URL + queryPath);
        return res;
    }

    async getWorkFreelancerDetail(workId: any, freelancerId: any) {
        let res = await this.get(
            this.API_URL +
                `/detail-freelancer?workId=${workId}&freelancerId=${freelancerId}`
        );
        return res;
    }

    async postWork(workInfo: object) {
        let res = await this.post(this.API_URL, workInfo);
        return res;
    }

    async editWork(workInfo: WorkInfoType) {
        let res = await this.put(this.API_URL + '/' + workInfo?.id, workInfo);
        return res;
    }

    async getByClientId(clientId: any, workStatus = null, workType = null) {
        let queryPath = `/get-by-client-id?clientId=${clientId}`;
        if (workStatus !== null) {
            queryPath += `&workStatus=${workStatus}`;
        }
        if (workType !== null) {
            queryPath += `&workType=${workType}`;
        }
        let res = await this.get(this.API_URL + queryPath);
        return res;
    }

    async removeById(id: any) {
        let res = await this.delete(this.API_URL + '/' + id);
        return res;
    }

    async getWorkForFreelancer(freelancerId: any, workFilter: object) {
        let queryPath = `/suggest-for-freelancer?freelancerId=${freelancerId}`;
        let res = await this.post(this.API_URL + queryPath, workFilter);
        return res;
    }

    async getProposalList(freelancerId: any) {
        let res = await this.get(
            this.API_URL + `/proposal-list?freelancerId=${freelancerId}`
        );
        return res;
    }

    async updateProgress(workId: any, progress: any) {
        let res = await this.put(
            this.API_URL +
                `/update-progress?workId=${workId}&progress=${progress}`
        );
        return res;
    }

    async updateStatus(workId: any, workStatus: any) {
        let res = await this.put(
            this.API_URL +
                `/update-status?workId=${workId}&workStatus=${workStatus}`
        );
        return res;
    }

    async getWorkHistory(userId: any) {
        let res = await this.get(this.API_URL + `/history?userId=${userId}`);
        return res;
    }
}

export default new WorkApi();
