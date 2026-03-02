

Давай поговорим о Execution Contexts, Environment Records В чём разница, что и когда создается, какая структура каждого из объектов при этом получается Сначала поверхностно, потом глубоко Мне очень важно понимать что откуда берётся, когда возникает, и какая получается струтктура. Можно для примера использовать какой-то просто код, пара переменных, функция со своими переменными, и какой-нибудь блок if или цикл Начнём?)

  

###### ChatGPT сказал:

Отлично, начинаем 🙂  
Тема **Execution Context** и **Environment Records** — это прямо сердце механики JS.

Я сначала дам **поверхностную картину**, чтобы сложилась архитектура.  
Потом разберём **глубоко по шагам**, с внутренними структурами из спецификации.

Опираемся на спецификацию Ecma International — документ ECMAScript Language Specification.

---

# ЧАСТЬ 1 — Поверхностно

## 1️⃣ Execution Context — это «рамка выполнения»

Это структура, которая создаётся **каждый раз, когда что-то начинает исполняться**:

- глобальный код → Global Execution Context
    
- вызов функции → Function Execution Context
    
- eval → Eval Execution Context
    
- модуль → Module Execution Context
    

Можно думать так:

> Execution Context — это контейнер состояния выполнения.

Он хранит:

- какие переменные сейчас доступны
    
- где искать переменные
    
- значение `this`
    
- ссылку на предыдущий контекст
    

---

## 2️⃣ Environment Record — это «таблица переменных»

Environment Record — это не весь контекст.

Это только часть контекста, отвечающая за:

- хранение идентификаторов
    
- их привязку к значениям
    
- хранение функций
    
- хранение `let`, `const`, `var`
    

То есть:

> Execution Context содержит Environment Record.

---

## 3️⃣ Связь

Execution Context  
    ├── LexicalEnvironment  
    │        └── EnvironmentRecord (таблица переменных)  
    │  
    ├── VariableEnvironment  
    │        └── EnvironmentRecord  
    │  
    └── ThisBinding

---

# ЧАСТЬ 2 — Простой пример

Возьмём код:

var a = 1;  
  
function foo(x) {  
  let b = 2;  
  
  if (x > 0) {  
    const c = 3;  
    console.log(a, b, c);  
  }  
}  
  
foo(5);

Теперь будем проходить по шагам.

---

# ЧАСТЬ 3 — Что создаётся и когда

---

# 🔹 Шаг 1 — Запуск программы

Создаётся:

## ✅ Global Execution Context

Структура:

GlobalExecutionContext = {  
  LexicalEnvironment: GlobalEnvironmentRecord,  
  VariableEnvironment: GlobalEnvironmentRecord,  
  ThisBinding: globalObject  
}

⚠️ В глобальном коде:

LexicalEnvironment и VariableEnvironment изначально указывают на один и тот же объект.

---

# 🔹 GlobalEnvironmentRecord

Он состоит из двух частей:

GlobalEnvironmentRecord = {  
  ObjectRecord,  
  DeclarativeRecord  
}

### ObjectRecord

Связан с глобальным объектом (`window` в браузере).

Сюда попадают `var` и function declarations.

### DeclarativeRecord

Сюда попадают `let`, `const`, class.

---

# 🔹 Во время Creation Phase глобального контекста:

Интерпретатор проходит код и делает:

### 1️⃣ var a

→ создаётся binding в ObjectRecord  
→ инициализируется значением `undefined`

### 2️⃣ function foo

→ создаётся функция-объект  
→ binding создаётся в ObjectRecord  
→ сразу инициализируется ссылкой на функцию

---

После creation фазы глобальная структура примерно такая:

GlobalEnvironmentRecord  
  ObjectRecord:  
      a: undefined  
      foo: <FunctionObject>  
  
  DeclarativeRecord:  
      (пусто)

---

# 🔹 Шаг 2 — Вызов foo(5)

Создаётся:

## ✅ Function Execution Context

FunctionExecutionContext = {  
   LexicalEnvironment: FunctionEnvironmentRecord,  
   VariableEnvironment: FunctionEnvironmentRecord,  
   ThisBinding: undefined (в strict) или globalObject  
}

---

# 🔹 Создание FunctionEnvironmentRecord

Структура:

FunctionEnvironmentRecord = {  
   outer: GlobalEnvironmentRecord,  
   bindings: {}  
}

---

# Creation Phase функции

Интерпретатор делает:

### 1️⃣ Параметр x

x: 5

### 2️⃣ let b

Создаётся binding:

b: uninitialized (TDZ)

После инициализации:

b: 2

---

# 🔹 Входим в if

Создаётся:

## ✅ Block Execution Context?

Нет.

⚠️ ВАЖНО:  
Новый Execution Context НЕ создаётся.

Создаётся только:

## ✅ Новый Lexical Environment

BlockEnvironmentRecord = {  
   outer: FunctionEnvironmentRecord,  
   bindings: {}  
}

---

### Creation Phase блока:

c: uninitialized (TDZ)

После выполнения строки:

c: 3

---

# 🔹 Когда console.log(a, b, c)

Поиск переменных идёт так:

c → найден в BlockEnvironmentRecord  
b → найден в FunctionEnvironmentRecord  
a → найден в GlobalEnvironmentRecord

Это и есть **цепочка лексической области видимости**.

---

# ЧАСТЬ 4 — Теперь глубоко

Теперь важно различить:

## Execution Context — это runtime структура

Она живёт в call stack.

## Environment Record — это структура хранения binding'ов

Она образует linked list (через outer).

---

# Полная структура глубоко

Внутри спецификации:

Execution Context содержит:

ExecutionContext {  
   Function  
   Realm  
   ScriptOrModule  
   LexicalEnvironment  
   VariableEnvironment  
   PrivateEnvironment  
}

---

# Виды Environment Records

1. DeclarativeEnvironmentRecord
    
2. ObjectEnvironmentRecord
    
3. FunctionEnvironmentRecord
    
4. GlobalEnvironmentRecord
    
5. ModuleEnvironmentRecord
    

---

# Самая важная мысль

Execution Context создаётся:

- при входе в глобальный код
    
- при вызове функции
    
- при eval
    
- при запуске модуля
    

Environment Record создаётся:

- для каждого контекста
    
- для каждого блока `{}` если есть let/const
    
- для catch
    
- для class
    

---

# 🔥 Главное различие

|Execution Context|Environment Record|
|---|---|
|Рамка выполнения|Таблица переменных|
|Создаётся при входе в код|Создаётся для хранения binding|
|Живёт в call stack|Живёт в lexical chain|
|Содержит this, realm|Содержит только binding|

---

# Хочешь дальше?

Мы можем пойти в одну из сторон:

1. Разобрать реальную внутреннюю структуру EnvironmentRecord как internal slots
    
2. Разобрать как работает TDZ пошагово
    
3. Разобрать как замыкание удерживает EnvironmentRecord
    
4. Разобрать как именно происходит lookup через GetIdentifierReference
    

Куда копаем глубже?

  

##### Вы сказали:

Я знаю, что у Execution Contexts содержит эти компоненты: - code evaluation state - Function - Realm - ScriptOrModule - LexicalEnvironment - VariableEnvironment - PrivateEnvironment ты перечислил 3 из них Хотелось бы также подробнее поговорить о Realm также не понимаю в чем разница между environment и lexicalEnvironment расскажешь?)

  

###### ChatGPT сказал:

Отлично. Вот теперь мы заходим на уровень архитектуры движка 🔥  
Ты уже мыслишь категориями спецификации — это правильно.

Опираться будем на ECMAScript Language Specification от Ecma International.

---

# ЧАСТЬ 1 — Полная структура Execution Context

Execution Context в спецификации — это **spec type**, содержащий:

ExecutionContext {  
  Function  
  Realm  
  ScriptOrModule  
  LexicalEnvironment  
  VariableEnvironment  
  PrivateEnvironment  
}

Ты прав — я раньше упростил.

Теперь разберём два сложных момента:

1️⃣ Что такое Realm  
2️⃣ В чём разница между Environment и LexicalEnvironment

---

# ЧАСТЬ 2 — Что такое Realm

## Поверхностно

Realm — это:

> Отдельная "вселенная" со своим набором встроенных объектов.

Каждый Realm содержит:

- собственный %Object%
    
- собственный %Function%
    
- собственный %Array%
    
- собственный global object
    
- собственные intrinsic objects
    

---

## Простой пример

В браузере:

const iframe = document.createElement('iframe');  
document.body.appendChild(iframe);  
  
iframe.contentWindow.Array !== Array

Почему `true`?

Потому что iframe создаёт **новый Realm**.

У него:

- свой глобальный объект
    
- свои встроенные конструкторы
    
- свои прототипы
    

---

## Глубже — структура Realm

В спецификации Realm имеет:

RealmRecord {  
  [[Intrinsics]]  
  [[GlobalObject]]  
  [[GlobalEnv]]  
  [[TemplateMap]]  
}

### [[Intrinsics]]

Это таблица:

%Object%  
%Function%  
%Array%  
%String%  
...

⚠️ И это разные объекты в разных реалмах.

---

### [[GlobalObject]]

Объект, на который указывает глобальный this.

В браузере — window.

---

### [[GlobalEnv]]

Это Global Environment Record этого реалма.

---

## Когда создаётся Realm?

- При запуске страницы
    
- При создании iframe
    
- В Node.js — при создании VM context
    
- При создании Worker
    

Realm создаётся ДО первого Execution Context.

Это важно.

Порядок bootstrap:

1. Создаётся Realm  
2. Внутри него создаются intrinsics (%Object%, %Function% ...)  
3. Создаётся GlobalExecutionContext

---

# ЧАСТЬ 3 — Environment vs LexicalEnvironment

Теперь тонкий момент.

## ❗ Environment — это абстрактное понятие

Environment = Environment Record + ссылка на outer.

То есть environment — это узел цепочки.

---

## LexicalEnvironment — это ссылка в ExecutionContext

Execution Context содержит:

LexicalEnvironment → Environment  
VariableEnvironment → Environment

Они указывают на объекты Environment.

---

## Структура Environment

Environment {  
   EnvironmentRecord  
   outer  
}

EnvironmentRecord — таблица binding'ов  
outer — ссылка на внешний environment

---

## Так в чём разница?

|Термин|Что это|
|---|---|
|Environment|Конкретный объект в цепочке|
|EnvironmentRecord|Таблица переменных внутри environment|
|LexicalEnvironment|Ссылка на текущий environment|
|VariableEnvironment|Ссылка на environment для var|

---

# ЧАСТЬ 4 — Почему два: LexicalEnvironment и VariableEnvironment?

Историческая причина: `var`.

При входе в функцию:

LexicalEnvironment  → FunctionEnvironment  
VariableEnvironment → тот же FunctionEnvironment

Но когда внутри создаётся блок:

if (true) {  
   let x = 1;  
}

Создаётся новый Environment:

LexicalEnvironment → BlockEnvironment  
VariableEnvironment → остаётся прежним

`var` всегда пишется в VariableEnvironment.

`let/const` — в LexicalEnvironment.

---

# ЧАСТЬ 5 — Пример с разбором

var a = 1;  
  
function foo() {  
  var b = 2;  
  let c = 3;  
  
  if (true) {  
    let d = 4;  
  }  
}

---

## Глобальный Execution Context

LexicalEnvironment → GlobalEnv  
VariableEnvironment → GlobalEnv  
Realm → R1

---

## При вызове foo()

Создаётся новый Execution Context:

Function: foo  
Realm: R1  
LexicalEnvironment → Env1  
VariableEnvironment → Env1

Env1:

EnvironmentRecord:  
   b: undefined (потом 2)  
   c: uninitialized (TDZ)  
outer → GlobalEnv

---

## Входим в if

Создаётся:

BlockEnv:  
   d: uninitialized (потом 4)  
outer → Env1

Execution Context НЕ создаётся.

Меняется только LexicalEnvironment:

LexicalEnvironment → BlockEnv  
VariableEnvironment → Env1

---

# ЧАСТЬ 6 — Самая точная формулировка

Execution Context хранит:

- ссылку на текущий Realm
    
- ссылку на текущий LexicalEnvironment
    
- ссылку на VariableEnvironment
    
- ссылку на PrivateEnvironment
    
- текущую функцию
    
- ScriptOrModule
    

Environment — это элемент цепочки областей видимости.

LexicalEnvironment — это указатель в ExecutionContext на текущий Environment.

---

# ЧАСТЬ 7 — Главное понимание

Realm отвечает за:

- какие встроенные объекты используются
    
- какие прототипы связаны
    
- какой глобальный объект
    
- какие intrinsic objects существуют
    

Execution Context отвечает за:

- где мы сейчас выполняемся
    
- какие переменные доступны
    
- какой this
    

Environment отвечает за:

- хранение binding'ов
    
- формирование цепочки поиска
    

---

Если хочешь — можем дальше копнуть:

1️⃣ Как Realm bootstrap создаёт %Object% и %Function%  
2️⃣ Почему объекты из разных реалмов не проходят instanceof  
3️⃣ Как PrivateEnvironment работает с class  
4️⃣ Полный пошаговый lookup алгоритм GetIdentifierReference

Куда идём глубже?

  

##### Вы сказали:

давай 1-й пункт Но для начала давай кое-что проясним почему ранее ты писал что все var записываются в ObjectRecord, а let const в DeclarativeRecord, а позже писал что все var записываются VariableEnvironment, а let const в LexicalEnvironment? в чём разница, что я не так понял, что упустил?

  

###### ChatGPT сказал:

Отличный вопрос.  
Ты ничего не упустил — просто мы смешали **два разных уровня абстракции спецификации**. Сейчас аккуратно разведём их.

Мы продолжаем опираться на ECMAScript Language Specification от Ecma International.

---

# 🔎 Уровень №1 — Execution Context уровень

Когда я говорил:

> var записываются в VariableEnvironment  
> let/const — в LexicalEnvironment

Это уровень **Execution Context**.

Execution Context содержит **две ссылки**:

LexicalEnvironment  
VariableEnvironment

Обе указывают на **Environment** (узлы цепочки областей видимости).

---

# 🔎 Уровень №2 — GlobalEnvironmentRecord уровень

Когда я говорил:

> var → ObjectRecord  
> let/const → DeclarativeRecord

Это уже **внутреннее устройство именно GlobalEnvironmentRecord**.

Глобальное окружение — особый случай.

---

# 🔥 Теперь собираем всё вместе

## 1️⃣ Execution Context говорит:

> КУДА писать binding?

## 2️⃣ Environment Record говорит:

> КАК хранить binding внутри этого окружения?

---

# 🧠 Важный момент

## В функциях

function foo() {  
  var x = 1;  
  let y = 2;  
}

Здесь:

- LexicalEnvironment === VariableEnvironment
    
- EnvironmentRecord — FunctionEnvironmentRecord
    

Внутри него нет ObjectRecord / DeclarativeRecord разделения.

Там всё хранится в одной таблице.

---

## ❗ Разделение ObjectRecord / DeclarativeRecord существует ТОЛЬКО в глобальном окружении.

GlobalEnvironmentRecord устроен так:

GlobalEnvironmentRecord {  
   [[ObjectRecord]]  
   [[DeclarativeRecord]]  
}

---

# 🧩 Как это сочетается?

## Глобальный код

Execution Context:

LexicalEnvironment → GlobalEnv  
VariableEnvironment → GlobalEnv

GlobalEnv — это GlobalEnvironmentRecord.

А он внутри:

{  
   ObjectRecord,  
   DeclarativeRecord  
}

---

## Когда объявляется:

var a = 1;

Алгоритм:

1. Execution Context смотрит в VariableEnvironment
    
2. VariableEnvironment → GlobalEnv
    
3. GlobalEnv.createGlobalVarBinding(...)
    
4. Эта операция кладёт binding в ObjectRecord
    

---

## Когда объявляется:

let b = 2;

Алгоритм:

1. Execution Context смотрит в LexicalEnvironment
    
2. LexicalEnvironment → GlobalEnv
    
3. GlobalEnv.createGlobalLexicalBinding(...)
    
4. Эта операция кладёт binding в DeclarativeRecord
    

---

# 📌 Почему так сложно?

Потому что глобальное окружение исторически связано с глобальным объектом.

`var` в глобальном коде:

var x = 1;

создаёт свойство глобального объекта.

`let` — не создаёт.

Это требование совместимости с ранним JS.

---

# 🧠 Ключевая разница

|Уровень|Что обсуждаем|
|---|---|
|Execution Context|Куда направляется объявление|
|Environment Record|Где реально хранится binding|

---

# 💥 Коротко и точно

- VariableEnvironment — указатель в Execution Context
    
- LexicalEnvironment — указатель в Execution Context
    
- ObjectRecord / DeclarativeRecord — внутренности GlobalEnvironmentRecord
    
- В функциях разделения нет
    
- В глобальном окружении — есть
    

---

# 🔬 Если совсем строго

Execution Context → содержит ссылку на Environment  
Environment → содержит EnvironmentRecord  
EnvironmentRecord → реализует CreateMutableBinding / CreateGlobalVarBinding / etc

---

# 🔥 В чём ты чуть запутался?

Ты смешал:

- "куда направляется объявление"
    
- "в какой внутренний record попадёт binding"
    

Это два разных уровня модели.

---

# Теперь можем идти в bootstrap Realm

Дальше будет реально мясо:

1️⃣ Как создаётся Realm  
2️⃣ Как создаются intrinsics  
3️⃣ Как bootstrap создаёт %Object%  
4️⃣ Как bootstrap создаёт %Function%  
5️⃣ Почему Function — функция, создающая функции

Готов? 😄

  

##### Вы сказали:

супер! давай теперь это Как Realm bootstrap создаёт %Object% и %Function%

  

###### ChatGPT сказал:

Вот теперь мы заходим в самую «магическую» часть спецификации 🔥  
Как при bootstrap создаются `%Object%` и `%Function%` — и как разруливается их циклическая зависимость.

Опираемся на ECMAScript Language Specification от Ecma International.

---

# ЧАСТЬ 1 — Общая картина bootstrap

Когда создаётся новый Realm (например, загрузка страницы, iframe, Worker):

## Шаг 1

Создаётся пустой **RealmRecord**:

RealmRecord {  
  [[Intrinsics]]: пустой  
  [[GlobalObject]]: undefined  
  [[GlobalEnv]]: undefined  
}

## Шаг 2

Вызывается абстрактная операция:

CreateIntrinsics(realm)

И вот тут начинается самое интересное.

---

# ЧАСТЬ 2 — Главная проблема

Есть циклическая зависимость:

Object — это функция  
Function — это объект

И более формально:

- `%Object%` — это constructor function
    
- `%Function%` — это constructor function
    
- `%Object%.__proto__ === %Function%.prototype`
    
- `%Function%.__proto__ === %Function%.prototype`
    
- `%Object%.prototype.__proto__ === null`
    
- `%Function%.prototype.__proto__ === %Object%.prototype`
    

То есть:

Function → Object → Function

Нужно разорвать цикл.

---

# ЧАСТЬ 3 — Как спецификация это решает

Спецификация не создаёт их "обычным способом".  
Она создаёт их через низкоуровневые внутренние операции:

OrdinaryObjectCreate  
MakeConstructor  
DefinePropertyOrThrow

То есть bootstrap не использует `%Function%` для создания `%Function%`.

Он создаёт объекты "вручную".

---

# ЧАСТЬ 4 — Пошагово: создание %Object%

## Шаг A — создать %Object.prototype%

objProto = OrdinaryObjectCreate(null)

Получается:

objProto = {  
   [[Prototype]]: null  
}

Это самый нижний объект всей системы.

---

## Шаг B — создать функцию %Object%

ObjectConstructor = CreateBuiltinFunction(...)

⚠️ CreateBuiltinFunction — специальная операция bootstrap.

Она создаёт объект с внутренними слотами:

{  
  [[Call]]  
  [[Construct]]  
  [[Realm]]  
  [[Prototype]]  
}

И этот объект пока НЕ использует %Function%.

---

## Шаг C — связать всё

ObjectConstructor.[[Prototype]] = %Function%.prototype   ← позже  
ObjectConstructor.prototype = objProto

Но пока `%Function%` ещё не создан.

Поэтому часть связей делается позже.

---

# ЧАСТЬ 5 — Создание %Function%

Теперь создаётся `%Function.prototype%`.

## Шаг A — создать Function.prototype

functionProto = OrdinaryObjectCreate(%Object.prototype%)

Он уже наследуется от Object.prototype.

---

## Шаг B — создать %Function%

FunctionConstructor = CreateBuiltinFunction(...)

---

## Шаг C — магическая строчка

FunctionConstructor.[[Prototype]] = functionProto

Вот здесь происходит ключевой момент:

Function.__proto__ === Function.prototype

То есть Function — это функция, созданная самой собой концептуально,  
но фактически созданная bootstrap-алгоритмом.

---

# ЧАСТЬ 6 — Завершение цикла

Теперь можно завершить то, что отложили:

ObjectConstructor.[[Prototype]] = functionProto

И получаем:

Object instanceof Function === true  
Function instanceof Function === true

Но:

Function.prototype instanceof Function === false

Потому что:

Function.prototype.__proto__ === Object.prototype

---

# ЧАСТЬ 7 — Почему это вообще работает?

Потому что bootstrap:

- не использует JS-код
    
- не использует new Function
    
- не использует new Object
    
- создаёт объекты напрямую через спецификационные операции
    

Это уровень ниже языка.

---

# ЧАСТЬ 8 — Внутренние слоты

После bootstrap:

## %Object%

{  
  [[Call]]  
  [[Construct]]  
  [[Realm]]  
  [[Prototype]] → Function.prototype  
}

## %Function%

{  
  [[Call]]  
  [[Construct]]  
  [[Realm]]  
  [[Prototype]] → Function.prototype  
}

## Object.prototype

{  
  [[Prototype]]: null  
}

## Function.prototype

{  
  [[Prototype]] → Object.prototype  
}

---

# ЧАСТЬ 9 — Самый глубокий инсайт

Bootstrap фактически делает:

1. Создаёт чистые объекты без прототипа
    
2. Создаёт builtin function objects напрямую
    
3. Потом вручную связывает prototype chain
    
4. Только после этого система становится самосогласованной
    

---

# 💥 Почему это важно для тебя

Теперь ты понимаешь:

- Realm содержит intrinsics
    
- intrinsics создаются bootstrap'ом
    
- %Object% и %Function% создаются вручную
    
- цикл разруливается порядком связывания
    
- Execution Context использует intrinsics из Realm
    

---

# Если хочешь пойти глубже

Мы можем разобрать:

1️⃣ Конкретный алгоритм CreateBuiltinFunction  
2️⃣ Что хранится в [[Intrinsics]] таблице  
3️⃣ Как Realm влияет на instanceof  
4️⃣ Как PrivateEnvironment связан с Realm  
5️⃣ Как движки (V8) реально реализуют bootstrap

Куда копаем дальше? 🔥