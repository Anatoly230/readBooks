а можем с тобой написать функцию или несколько функций которая формирует AST из получаемого текста на языке js? 1) разбиение на токены Lexical Grammar на этом этапе есть только: Identifier,Keyword, NumericLiteral, Punctuator, LineTerminator 2) создание AST Syntactic Grammar (Структура данных должна быть удобной для работы с ней) 3) GlobalDeclarationInstantiation которая использует отдельные функции - Global Execution Context - Global Lexical Environment - Global Variable Environment до этого момента пока хватит, потом продолжим Наверное там все названия можно оставить из спецификации)

🔥 Вот это уже уровень «я хочу стать движком».

Да, мы можем это сделать.  
Но важно: мы будем писать **упрощённую модель**, а не полноценный парсер как в V8.

Мы реализуем:

1️⃣ Lexical Grammar → tokenizer  
2️⃣ Syntactic Grammar → AST builder  
3️⃣ GlobalDeclarationInstantiation → создание окружений

Будем сохранять имена максимально близко к спецификации из ECMAScript Language Specification.

---

# 🧩 Часть 0 — Ограничим язык

Чтобы не утонуть, поддержим:

- FunctionDeclaration
    
- VariableDeclaration (const)
    
- Identifier
    
- NumericLiteral
    
- CallExpression
    
- ReturnStatement
    
- BlockStatement
    

Пример входного кода:

function add(a, b) {  
  return a + b;  
}  
  
const x = add(1, 2);

---

# 🧱 ЧАСТЬ 1 — Lexical Grammar (Tokenizer)

Мы создаём:

LexicalAnalysis(sourceText)

---

## 1️⃣ Token Types

const TokenType = {  
  Identifier: "Identifier",  
  Keyword: "Keyword",  
  NumericLiteral: "NumericLiteral",  
  Punctuator: "Punctuator",  
  LineTerminator: "LineTerminator",  
};

---

## 2️⃣ Tokenizer

function LexicalAnalysis(input) {  
  const tokens = [];  
  let i = 0;  
  
  const isLetter = (c) => /[a-zA-Z_]/.test(c);  
  const isDigit = (c) => /[0-9]/.test(c);  
  const isWhitespace = (c) => /\s/.test(c);  
  
  const keywords = new Set(["function", "return", "const"]);  
  
  while (i < input.length) {  
    let char = input[i];  
  
    if (isWhitespace(char)) {  
      if (char === "\n") {  
        tokens.push({ type: TokenType.LineTerminator, value: "\n" });  
      }  
      i++;  
      continue;  
    }  
  
    if (isLetter(char)) {  
      let value = "";  
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {  
        value += input[i++];  
      }  
  
      tokens.push({  
        type: keywords.has(value)  
          ? TokenType.Keyword  
          : TokenType.Identifier,  
        value,  
      });  
  
      continue;  
    }  
  
    if (isDigit(char)) {  
      let value = "";  
      while (i < input.length && isDigit(input[i])) {  
        value += input[i++];  
      }  
  
      tokens.push({ type: TokenType.NumericLiteral, value });  
      continue;  
    }  
  
    // Punctuators  
    if ("(){};,+=".includes(char)) {  
      tokens.push({ type: TokenType.Punctuator, value: char });  
      i++;  
      continue;  
    }  
  
    throw new Error("Unexpected character: " + char);  
  }  
  
  return tokens;  
}

---

Возвращает:
```js
[
    {
        "type": "Keyword",
        "value": "function"
    },
    {
        "type": "Identifier",
        "value": "add"
    },
    {
        "type": "Punctuator",
        "value": "("
    },
    {
        "type": "Identifier",
        "value": "a"
    },
    {
        "type": "Punctuator",
        "value": ","
    },
    {
        "type": "Identifier",
        "value": "b"
    },
    {
        "type": "Punctuator",
        "value": ")"
    },
    {
        "type": "Punctuator",
        "value": "{"
    },
    {
        "type": "LineTerminator",
        "value": "\n"
    },
    {
        "type": "Keyword",
        "value": "return"
    },
    {
        "type": "Identifier",
        "value": "a"
    },
    {
        "type": "Punctuator",
        "value": "+"
    },
    {
        "type": "Identifier",
        "value": "b"
    },
    {
        "type": "Punctuator",
        "value": ";"
    },
    {
        "type": "LineTerminator",
        "value": "\n"
    },
    {
        "type": "Punctuator",
        "value": "}"
    },
    {
        "type": "LineTerminator",
        "value": "\n"
    },
    {
        "type": "LineTerminator",
        "value": "\n"
    },
    {
        "type": "Identifier",
        "value": "add"
    },
    {
        "type": "Punctuator",
        "value": "("
    },
    {
        "type": "NumericLiteral",
        "value": "1"
    },
    {
        "type": "Punctuator",
        "value": ","
    },
    {
        "type": "NumericLiteral",
        "value": "2"
    },
    {
        "type": "Punctuator",
        "value": ")"
    },
    {
        "type": "Punctuator",
        "value": ";"
    }
]
```


так выглядит AST 

```js
{
  type: "Program",
  body: [
    {
      type: "FunctionDeclaration",
      name: "add",
      params: ["a", "b"],
      body: [
        {
          type: "ReturnStatement",
          argument: {
            type: "BinaryExpression",
            operator: "+",
            left: { type: "Identifier", name: "a" },
            right: { type: "Identifier", name: "b" }
          }
        }
      ]
    },
    {
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: "add"
      },
      arguments: [
        { type: "NumericLiteral", value: 1 },
        { type: "NumericLiteral", value: 2 }
      ]
    }
  ]
}
```

Следующий уровень:

- FunctionDeclarationInstantiation
    
- Call
    
- [[Call]] internal method
    
- Execution Context Stack
    
- Runtime Evaluation