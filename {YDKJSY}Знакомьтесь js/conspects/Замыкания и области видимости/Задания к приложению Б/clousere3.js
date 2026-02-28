var typeOfClick = {
    'type': "number",
    type: "number",
}

function calculator() {
    var sequenceOfClicks = [];
    var allowedRange = /[\d\+\-\*\/=]/;
    var allowedSign = /[\*\-\+\/]/;
    var numDetect = /\d/;
    var equal = '=';
    var result = 0;//113

    return function calcInit(key) {
        // if (key === 'hint') return result;
        if (!(allowedRange.test(key))) {
            return 'Введите цифру либо знаки +, -, *, /'
        }
        sequenceOfClicks.push(key);
        if (key !== equal) {
            return key;
        }
        return logical();
    }

    function logical() {
        var sign = '+';
        var keys = sorting(sequenceOfClicks);
        sequenceOfClicks = [];
        
        if (numDetect.test(keys[0])) result = 0;
        
        for (const key of keys) {
            if (key === equal) {
                return result;
            }
            if (allowedSign.test(key)) {
                sign = key;
                continue;
            }
            let num = parseInt(key, 10);

            if (isNaN(num)) continue;
            if (sign === '+') result += num;
            if (sign === '-') result -= num;
            if (sign === '*') result *= num;
            if (sign === '/') result /= num;
        }
    }

    function sorting(keys) {
        var result = []
        var bulder = '';
        for (const key of keys) {
            if (!numDetect.test(key)) {
                result.push(bulder);
                bulder = '';
                bulder += key;
                result.push(bulder);
                bulder = '';
                continue;
            }
            bulder += key;
        }
        return result;
    }
}
var calc = calculator();
console.log(calc('1'));
console.log(calc('1'));
console.log(calc('2'));
console.log(calc('*'));
console.log(calc('3'));
console.log(calc('='));

