var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum[UserRoleEnum["None"] = 0] = "None";
    UserRoleEnum[UserRoleEnum["WarehouseAdmin"] = 1] = "WarehouseAdmin";
    UserRoleEnum[UserRoleEnum["Manager"] = 2] = "Manager";
    UserRoleEnum[UserRoleEnum["Volenteer"] = 3] = "Volenteer";
    UserRoleEnum[UserRoleEnum["Driver"] = 4] = "Driver";
    UserRoleEnum[UserRoleEnum["Receiver"] = 5] = "Receiver";
})(UserRoleEnum || (UserRoleEnum = {}));

export default UserRoleEnum;

export var UserRoleEnumTranslate;
(function (TranslateRole) {
    TranslateRole[TranslateRole["None"] = 0] = "Ніц";
    TranslateRole[TranslateRole["WarehouseAdmin"] = 1] = "Керівник";
    TranslateRole[TranslateRole["Manager"] = 2] = "Менеджер";
    TranslateRole[TranslateRole["Volenteer"] = 3] = "Волонтер";
    TranslateRole[TranslateRole["Driver"] = 4] = "Водій";
    TranslateRole[TranslateRole["Receiver"] = 5] = "Отримувач";
})(UserRoleEnumTranslate || (UserRoleEnumTranslate = {}));