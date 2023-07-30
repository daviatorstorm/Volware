var UnitEnum;
(function (UnitEnum) {
    UnitEnum[UnitEnum["None"] = 0] = "None";
    
    UnitEnum[UnitEnum["Liter"] = 1] = "Liter";
    UnitEnum[UnitEnum["Kilogram"] = 2] = "Kilogram";
    UnitEnum[UnitEnum["Pallet"] = 3] = "Pallet";
    UnitEnum[UnitEnum["Box"] = 4] = "Box";
    UnitEnum[UnitEnum["Bottle"] = 5] = "Bottle";
    UnitEnum[UnitEnum["Piece"] = 6] = "Piece";
})(UnitEnum || (UnitEnum = {}));

export default UnitEnum;

export var UnitEnumTranslate;
(function (UnitEnumTranslate) {
    UnitEnumTranslate[UnitEnumTranslate["None"] = 0] = "Ніц";
    
    UnitEnumTranslate[UnitEnumTranslate["Liter"] = 1] = "Літр";
    UnitEnumTranslate[UnitEnumTranslate["Kilogram"] = 2] = "Кілограм";
    UnitEnumTranslate[UnitEnumTranslate["Pallet"] = 3] = "Палет";
    UnitEnumTranslate[UnitEnumTranslate["Box"] = 4] = "Коробка";
    UnitEnumTranslate[UnitEnumTranslate["Bottle"] = 5] = "Пляшка";
    UnitEnumTranslate[UnitEnumTranslate["Piece"] = 6] = "Одиниця";
})(UnitEnumTranslate || (UnitEnumTranslate = {}));
