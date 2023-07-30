import { BaseSevice } from "./BaseService";

class ActionLogService extends BaseSevice {
    apiUrl = `api/actionlog`;

    getFiltered(q) {
        return this.request(`${this.apiUrl}`, 'get', {
            params: { q }
        });
    }
}

export default new ActionLogService();