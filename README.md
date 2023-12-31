# Волонтерський проект для керування складом гуманітарки та персоналу

Це не публічний проект для керування кількості гуманітарки на складі,
можливості передачі гуманітарки до зареєстованої людини. Голова
складу буде основною людиною, яка і починає додавати людей до свого
складу. Додаючи людину можна надавати їй певну роль з певними 
привілегіями. 

## Частини програми

* ЮІ для телефону.

Написана на PWA для можливості роботи з Андроїд та Айфон, та Ангуляр

* Серверна частина


.NET Core як простий АПІ інтерфейс для мобільної аплікухі.

##  Функціонали

Опис основних операцій, які будуть використовуватися при 
при користуванні аплікаії

### Журналювання

Журналювання всіх дій відбувається весь час користування аплікацією 
користувачами. Імовірно буде відбуватися за допомогою бази InfluxDB

### Аутентифікація і ауторизація

Аутентифікація буде відбуватися сторонньою системою для розділення
повноважень і навантаження між операційними одиницями. Покишо як 
пропозиція є використання Google Authentication, Keycloak.

Аутентифікація тут являється дуже важливою частиною так як збереження
прав це є найважливішим для уникнення можливості людий виконувати не
дозволені їм операції.

Для безпеки можна використовувати QR код для можливості людини пройти
на склад. Кожен користувач може просканувати QR код іншого користувача
для отримання інформації про нього.

**Ролі**:

* **StoreHolder**

Погоджує всі операції, може працювати зі складом, підписує документи 
про передачу та отримання зі складу та на склад гуманітарної допомоги,
керує користувачами на своєму складі.

* **Manager**

Людина призначена користувачем з роллю вище. Може виконувати всі
операції що і голова складу.

* **Volonteer**

Може бути просто працівником-різноробом

* **Driver**

Приймає гуманітарку від складу і звітується про виконання завдання
довезенням гуманітарки до місця призначення

* **Receiver** (In progress)

Можливо додати через чат бота в телеграмі, вотсап, вайбер для
зручності отримувача не качати аплікуху. Може бути обовязковим
скачування

### Керування користувачами

Абсолютно у кожного користувача його ідентифікатором являється 
його номер телефону та при кожному запиті згенерований QR код

#### Додавання користувача **StoreHolder**

Користувач повинен написати у підтримку організації розробника.
Організація може запросити документи від позивача і\або провірити 
місце знаходження самого складу. Після чого буде запитаний телефон
позивача для запуску для нього користувача у системі.

#### Додавання користувача **Manager**

Людина, котра хоче буде доданим як **Manager** мусить підійти до 
**StoreHolder** та про це попросити. У свою чергу людина показує
свій QR код, **StoreHolder** його сканує та вводить певні дані та
обирає роль **Manager**.

#### Додавання користувача **Volonteer**

Якщо у **Manager** є повноваження додавання користувачів (при тому
він може додавати тільки ролі нижче своєї) - функціонал такий самий
як описано вище

#### Додавання користувача **Driver**

Якщо у **Manager** є повноваження додавання користувачів (при тому
він може додавати тільки ролі нижче своєї) - функціонал такий самий
як описано вище

#### Додавання користувача **Driver** (In progress)

У розробці

### Склад

Місце де буде зберігатися вся гуманітарна допомога по даному складу.
Додавання одиниць на склад, передача та інші операції.  

**Одиниці вимірювання:**
* шт - Штуки
* од - Одиниці
* кг - Кілограми
* пл - Палети
* л - Літри
* кр - Коробки

#### Додавання одиниць на склад

Отримати одиниці гуманітарки може **Manager**, який має на це 
повноваження, що буде бачити **StoreHolder** та **StoreHolder**.
Вище вказані користувачі при отриманні гуманітарки мусять заповнити
форму отримання (хто привіз тощо), після чого ввести одиниці у 
систему.

#### Передача гуманітарки

Передати гуманітарку може **Manager**, який має на це повноваження, що буде бачити **StoreHolder** та **StoreHolder**. Для того необхідно
обрати одиниці для передачі (як у корзину), після зібрання повного
списку просканувати QR код передавачу. З того моменту починається
процес передачі. Після того як отримувач отримав всі вказані речі
з корзини на руки - він зобовязаний підтвердити закінчення операції
отримання натиснувши кнопку "Отримав". Під час процесу передачі 
аплікація на телефоні буде заблокована на передачі і розблокована коли отримувач натиснув кнопку "Отримав".
