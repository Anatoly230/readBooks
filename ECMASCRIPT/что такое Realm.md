в какой момент формируется самый первый объект в среде, какой метод используется, что его вызывает? Также я хочу понять, связан ли %Object.prototype% с этим самым первым объектом? или %Object.prototype% формируется на этапе формирования [[Realm]], на этапе functionInstation функции Oject, или там другой механизм?

Вот это уже уровень «копаем внутрь движка» 🔥  
Сейчас разложим аккуратно и по слоям спецификации.

Опираться будем на ECMAScript Language Specification.

---

# 🧠 Главный вопрос

> В какой момент формируется самый первый объект?  
> Связан ли он с %Object.prototype%?

Ответ коротко:

**Самый первый объект создаётся во время создания Realm.**  
И да — именно там же создаётся `%Object.prototype%`.

---

# 🏗 1️⃣ Всё начинается с CreateRealm()

Когда движок запускается (например, открывается вкладка в браузере), происходит:

InitializeHostDefinedRealm()  
  → CreateRealm()  
      → CreateIntrinsics()  
      → SetDefaultGlobalBindings()

Вот здесь и рождается "вселенная JS".

---

# 🌌 Что такое Realm?

Realm — это контейнер, внутри которого находятся:

- Intrinsics
    
- Global Object
    
- Global Environment
    
- Template Map
    
- Execution Context Stack
    

Упрощённо:

Realm = {  
  [[Intrinsics]],  
  [[GlobalObject]],  
  [[GlobalEnv]]  
}

---

# 🧱 2️⃣ Когда создаётся самый первый объект?

Во время:

CreateIntrinsics(realm)

Там создаются все intrinsic objects:

- %Object%
    
- %Object.prototype%
    
- %Function%
    
- %Function.prototype%
    
- %Array%
    
- %Array.prototype%
    
- и т.д.
    

---

# 🔥 Что создаётся самым первым?

Сначала создаётся **Object prototype**.

Почему?

Потому что:

- Все обычные объекты должны иметь [[Prototype]]
    
- Базовый объект без прототипа — это `%Object.prototype%`
    
- Его [[Prototype]] = null
    

Он создаётся через:

OrdinaryObjectCreate(null)

То есть:

%Object.prototype% = {  
  [[Prototype]]: null  
}

Это первый обычный объект всей системы.

---

# 🧠 ВАЖНО

Он создаётся НЕ через `new Object()`  
Он создаётся через внутреннюю операцию:

OrdinaryObjectCreate

---

# 🧩 3️⃣ А когда создаётся сам %Object%?

После `%Object.prototype%`.

%Object% = CreateBuiltinFunction(...)

И:

%Object%.[[Prototype]] = %Function.prototype%  
%Object%.prototype = %Object.prototype%

То есть:

%Object.prototype%  ←  самый первый обычный объект  
        ↑  
%Object%

---

# 🧬 4️⃣ А %Function.prototype%?

Тоже создаётся в CreateIntrinsics.

Но тут есть интересная особенность:

`%Function.prototype%` — это функция, но у неё:

[[Prototype]] = %Object.prototype%

Получается базовая цепочка:

null  
  ↑  
%Object.prototype%  
  ↑  
%Function.prototype%  
  ↑  
%Function%

---

# 🌍 5️⃣ А глобальный объект когда создаётся?

После CreateIntrinsics:

SetRealmGlobalObject(realm)

Создаётся:

globalObject = OrdinaryObjectCreate(%Object.prototype%)

Вот он уже наследуется от `%Object.prototype%`.

---

# 🎯 ИТОГ: порядок создания

1️⃣ CreateRealm  
2️⃣ CreateIntrinsics  
3️⃣ Создаётся `%Object.prototype%`  
4️⃣ Создаются остальные intrinsic объекты  
5️⃣ Создаётся globalObject  
6️⃣ Создаётся Global Environment  
7️⃣ Создаётся Global Execution Context

---

# ❓ Связан ли самый первый объект с %Object.prototype%?

Самый первый объект = `%Object.prototype%`

И:

- У него [[Prototype]] = null
    
- Он корень всей прототипной цепочки
    
- ВСЕ обычные объекты в итоге указывают на него
    

---

# 🔍 Что происходит при new Object()?

new Object()

вызывает:

OrdinaryCreateFromConstructor

который делает:

OrdinaryObjectCreate(%Object.prototype%)

То есть любой объект:

obj → %Object.prototype% → null

---

# 🧠 Важный вывод

Realm формирует:

- Intrinsics
    
- Prototype chain
    
- Constructors
    
- Global object
    

Это делается ДО любого пользовательского кода.

---

# 🔥 Глубокий инсайт

Execution Context появляется ПОСЛЕ Realm.

Realm — это вселенная.  
Execution Context — это поток выполнения внутри неё.

---

# 📌 Ответы кратко

|Вопрос|Ответ|
|---|---|
|Когда создаётся первый объект?|Во время CreateIntrinsics|
|Какой именно?|%Object.prototype%|
|Через что?|OrdinaryObjectCreate(null)|
|Связан ли он с Realm?|Да, он часть Realm.[[Intrinsics]]|
|Создаётся ли он при function instantiation Object?|Нет|
|Связан ли он с GlobalDeclarationInstantiation?|Нет|

---

Если хочешь — можем:

- смоделировать CreateRealm в нашем mini-движке
    
- вручную создать intrinsic graph
    
- нарисовать реальную схему prototype chain
    
- разобрать почему typeof null === "object"
    

Куда копаем дальше? 😈