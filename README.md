# Lulu Bot

![LuluWorldImage](https://sun9-25.userapi.com/-2A4pD_GrGccJoDVVHp0PmEZ9eGyza7iRF3w4w/OzUaU38Gi8E.jpg)

[Добавить бота на сервер](https://discord.com/oauth2/authorize?client_id=752917963484430436&permissions=8&scope=bot)  
Важно! Бот писался под витубер бойсов и может некорректно работать на других серверах.

## Commands

#### Admin Only
* !lulu init roles - инициализация ролей на сервере
* !lulu init activity - инициализирует смену статуса
* !lulu init hand @role - инициализирует планировщик руки по тем каналам, куда указанная роль может писать сообщения
* !lulu promote @member - дает учтастнику роль Lulu Cultist
* !lulu clear storage - очищает внутренне хранилище (нужно понимать нюансы внутренней реализации, лучше не трогать)

#### Lulu Cultist Role Owner and Admin
* !lulu say \<message\> - удаляет исходное сообщение и повторяет его от своего имени
* !lulu kawaii - отправляет moemoekyun.mp3

## Actions
* На сообщение от владельца сервера, содержащее y!warn, y!kick, y!ban оставляет реакцию :lulu_awaken: и скидывает аудио KONLULU.mp3
* На выход участника с сервера отправляет сообщение владельцу сервера
* На сообщение, содержащее "конлулу" или "konlulu" оставляет реакцию :konlulu_happy: и скидывает KONLULU.mp3 в чат. Регистр не учитывается
* Имеет 3% шанс поменять никнейм при использовании команд, доступных для Lulu Cultist Role

## При добавлении на сервер следует выполнить следующие команды поочередно:
* !lulu init roles
* !lulu init activity
* !lulu init hand @VIRTUAL BOI

LULU BOT v1.00