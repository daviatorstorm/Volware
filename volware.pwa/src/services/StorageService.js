import { BaseSevice } from "./BaseService";

class StorageService extends BaseSevice {
    apiUrl = `api/storage`;

    getBlob(blobName) {
        return this.client.get(`${this.apiUrl}/${blobName}`, {
            responseType: 'blob'
        });
    }
}

export default new StorageService();