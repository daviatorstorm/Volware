import { BaseSevice } from "./BaseService";

class WarehouseService extends BaseSevice {
    apiUrl = `/api/warehouse`;

    getWarehouseItems(searchTerm) {
        return this.request(this.apiUrl, 'get', {
            params: {
                q: searchTerm
            }
        });
    }

    getWarehouseItemsForDropdown(itemNameTerm) {
        return this.request(`${this.apiUrl}/dropdown?q=${itemNameTerm}`, 'get');
    }

    getById(id) {
        return this.request(`${this.apiUrl}/${id}`, 'get');
    }

    addWarehouseItem(warehouseItem) {
        return this.request(this.apiUrl, 'post', null, warehouseItem);
    }

    updateWarehouseItem(warehouseItem) {
        return this.request(`${this.apiUrl}/${warehouseItem.existingId}`, 'put', null, warehouseItem);
    }
}

export default new WarehouseService();