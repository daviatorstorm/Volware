var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum[OrderStatusEnum["Created"] = 0] = "Created";
    
    OrderStatusEnum[OrderStatusEnum["Loading"] = 1] = "Loading";
    OrderStatusEnum[OrderStatusEnum["InDrive"] = 2] = "InDrive";
    OrderStatusEnum[OrderStatusEnum["Delivered"] = 3] = "Delivered";

    OrderStatusEnum[OrderStatusEnum["Done"] = 4] = "Done";
})(OrderStatusEnum || (OrderStatusEnum = {}));

export default OrderStatusEnum;

export var OrderStatusEnumTranslate;
(function (OrderStatusEnumTranslate) {
    OrderStatusEnumTranslate[OrderStatusEnumTranslate["Created"] = 0] = "Створений";
    
    OrderStatusEnumTranslate[OrderStatusEnumTranslate["Loading"] = 1] = "Завантаження";
    OrderStatusEnumTranslate[OrderStatusEnumTranslate["InDrive"] = 2] = "В дорозі";
    OrderStatusEnumTranslate[OrderStatusEnumTranslate["Delivered"] = 3] = "Доставлено";

    OrderStatusEnumTranslate[OrderStatusEnumTranslate["Done"] = 4] = "Виконано";
})(OrderStatusEnumTranslate || (OrderStatusEnumTranslate = {}));