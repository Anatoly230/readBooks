Контекст `this`

```js
function whatsMyContext(){
    return this;
}

const gitMyThis = whatsMyContext;

const ninja1 = {
  id:'ninja1',  
  getMyThis: whatsMyContext,  
};

const ninja2 = {
  id:'ninja2',  
  getMyThis: whatsMyContext,  
};

gitMyThis() //window / globalobjec

ninja1.getMyThis(); //{id: 'ninja2', getMyThis: ƒ}

ninja2.getMyThis(); //{id: 'ninja2', getMyThis: ƒ}

```

Как видно из примера, одна и та же функция, вызываемая в разном контексте, может давать разные результаты. 

>[!info] Замечание 
>В строгом режиме, если нет контекста какого-то объекта,  глобальный объект(window) игнорируется, и выдаёт  undefined

Если хочешь узнать подробнее, то [[Подробнее о this | сюда]]
