import { BaseSevice } from "./BaseService";

class OrderService extends BaseSevice {
    apiUrl = `api/order`;

    getFiltered(q) {
        return this.request(`${this.apiUrl}`, 'get', {
            params: { q }
        });
    }

    getById(id) {
        return this.request(`${this.apiUrl}/${id}`, 'get');
    }

    addOrder(order) {
        return this.request(this.apiUrl, 'post', null, order);
    }

    setOrderDelivery(orderId, delivery) {
        return this.request(`${this.apiUrl}/delivery/${orderId}`, 'put', null, delivery);
    }
}

export default new OrderService();