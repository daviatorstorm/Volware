import { BaseSevice } from "./BaseService";
import CacheService from "./CacheService";

class UserService extends BaseSevice {
    apiUrl = `/api/user`;

    getMyQR() {
        return this.request(`${this.apiUrl}/qr`, 'get', {
            responseType: 'blob'
        });
    }

    getUserByQR(qrCode) {
        return this.request(`${this.apiUrl}/qr/${qrCode}`, 'get');
    }

    getUsers(searchTerm) {
        return this.request(this.apiUrl, 'get', {
            params: {
                q: searchTerm
            }
        });
    }

    getById(id) {
        return this.request(`${this.apiUrl}/${id}`, 'get');
    }

    getProfile() {
        if (!CacheService.exist('profile')) {
            return this.request(`${this.apiUrl}/profile`, 'get').then(res => {
                CacheService.set('profile', res.data);
                return res;
            });
        }

        return new Promise((resolve) => {
            resolve({ data: CacheService.get('profile') });
        })
    }

    addUser(user) {
        var formData = new FormData();
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('thirdName', user.thirdName);
        formData.append('city', user.city);
        formData.append('phoneNumber', user.phoneNumber);
        formData.append('email', user.email);
        formData.append('role', user.role);
        formData.append('profilePhoto', user.profilePhoto);

        user.images.forEach(element => {
            formData.append('documentPhotos', element.blob);
        });

        return this.request(this.apiUrl, 'post', null, formData);
    }
}

export default new UserService();