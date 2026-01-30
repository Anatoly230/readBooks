```js
function Ninja(){
this.weapon = 'knife'
this.skulk = function(){
return this.constructor.name + 'skulking';
	}
}
```
1. Создаётся новый объект (при использовании оператора `new` ) - `let ninja = new Ninja()`   
2. Этот объект передаётся конструктору в качестве `this`, а следовательно, он становится контекстом функции данного конструктора
3. Вновь сконструированный объект возвращается в качестве значения операции `new`

### Любопытный нюанс при вызове конструктора

Если функция-конструктор возвращает что-то кроме `this` то,  это значение игнорируется, и всё равно возвращается новый объект

пример:

```js
	function Ninja(){
this.weapon = 'knife'
this.skulk = function(){
return this.constructor.name + 'skulking';
	}
	return 1;
}
const ninja = new Ninja();

console.log(ninja)

//Ninja {weapon: 'knife', skulk: ƒ}
 //skulk: ƒ ()
//weapon: "knife"
 //[[Prototype]]: Object
```  