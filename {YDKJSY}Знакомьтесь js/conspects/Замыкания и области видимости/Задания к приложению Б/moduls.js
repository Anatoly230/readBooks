function calculator() {
    var sequenceOfClicks = [];
    var allowedRange = /[\d\+\-\*\/=]/;
    var allowedSign = /[\*\-\+\/]/;
    var numDetect = /\d/;
    var equal = '=';
    var result = 0;
    var err = "ERR";

    return {
        number,
        plus,
        minus,
        mult,
        div,
        eq,
    }

    function number(key) {
        if (!(numDetect.test(key))) {
            return 'Введите цифру'
        }
        sequenceOfClicks.push(key);
        return key;
    }
    function plus() {
        sequenceOfClicks.push("+");
        return '+'
    }
    function minus() {
        sequenceOfClicks.push("-");
        return '-'
    }
    function mult() {

        sequenceOfClicks.push("*");
        return '*'
    }
    function div() {
        sequenceOfClicks.push("/");
        return '/'
    }
    function eq() {
        return logical();
    }

    function logical() {
        var sign = '+';
        var keys = sorting(sequenceOfClicks);
        sequenceOfClicks = [];

        if (numDetect.test(keys[0])) result = 0;

        for (const key of keys) {
            if (result === err) return result;
            if (key === equal) {
                return result;
            }
            if (allowedSign.test(key)) {
                sign = key;
                continue;
            }

            let num = parseInt(key, 10);
            if (isNaN(num)) continue;

            result = calculation(result, sign, num);

        }

        return result;
    }
    function calculation(summ, sign, num) {
        var danger = summ === 0 || num === 0;
        if (sign === '+') return summ += num;
        if (sign === '-') return summ -= num;
        if (sign === '*') return danger ? err : summ * num;
        if (sign === '/') return danger ? err : summ / num;
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

function useCalc(calc, keys) {
    return [...keys].reduce(
        function showDisplay(display, key) {
            var ret = String(calc(key));
            return (
                display +
                (
                    (ret != "" && key == "=") ?
                        "=" :
                        ""
                ) +
                ret
            );
        },
        ""
    );
}

// console.log(useCalc(calc, "4+3="));           // 4+3=7
// console.log(useCalc(calc, "+9="));            // +9=16
// console.log(useCalc(calc, "*8="));            // *5=128
// console.log(useCalc(calc, "7*2*3="));         // 7*2*3=42
// console.log(useCalc(calc, "1/0="));           // 1/0=ERR
// console.log(useCalc(calc, "+3="));            // +3=ERR
// console.log(useCalc(calc, "51="));            // 51

var calc = calculator();

console.log(calc.number("4"));     // 4
console.log(calc.plus());          // +
console.log(calc.number("7"));     // 7
console.log(calc.number("3"));     // 3
console.log(calc.minus());         // -
console.log(calc.number("2"));     // 2
console.log(calc.eq());            // 75