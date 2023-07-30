var ActionTypeEnum;
(function (ActionTypeEnum) {
    ActionTypeEnum[ActionTypeEnum["None"] = 0] = "None";

    ActionTypeEnum[ActionTypeEnum["AddWarehouseItem"] = 1] = "AddWarehouseItem";
    ActionTypeEnum[ActionTypeEnum["UpdateWarehouseItem"] = 2] = "UpdateWarehouseItem";

    ActionTypeEnum[ActionTypeEnum["CreateOrder"] = 3] = "CreateOrder";
    ActionTypeEnum[ActionTypeEnum["StartOrderDelivery"] = 4] = "StartOrderDelivery";
    ActionTypeEnum[ActionTypeEnum["FinishOrderDelivery"] = 5] = "FinishOrderDelivery";

    ActionTypeEnum[ActionTypeEnum["AddUser"] = 6] = "AddUser";
})(ActionTypeEnum || (ActionTypeEnum = {}));

export default ActionTypeEnum;


export var ActionTypeEnumTranslate;
(function (ActionTypeEnumTranslate) {
    ActionTypeEnumTranslate[ActionTypeEnumTranslate["None"] = 0] = "Ніц";

    ActionTypeEnumTranslate[ActionTypeEnumTranslate["AddWarehouseItem"] = 1] = "Додати товар";
    ActionTypeEnumTranslate[ActionTypeEnumTranslate["UpdateWarehouseItem"] = 2] = "Оновити товар";

    ActionTypeEnumTranslate[ActionTypeEnumTranslate["CreateOrder"] = 3] = "Сторити замовлення";
    ActionTypeEnumTranslate[ActionTypeEnumTranslate["StartOrderDelivery"] = 4] = "Початок замовлення";
    ActionTypeEnumTranslate[ActionTypeEnumTranslate["FinishOrderDelivery"] = 5] = "Закінчення замовлення";

    ActionTypeEnumTranslate[ActionTypeEnumTranslate["AddUser"] = 6] = "Додати користувача";
})(ActionTypeEnumTranslate || (ActionTypeEnumTranslate = {}));