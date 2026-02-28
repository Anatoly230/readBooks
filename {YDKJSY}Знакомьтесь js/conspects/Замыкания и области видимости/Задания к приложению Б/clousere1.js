// function isPrime(num) { // Моя реализация
//     var dividers = []

//     return (function gitDividers() {
//         var counter = 1;
//         while (counter <= num) {
//             if (num % counter === 0) {
//                 dividers.push({ number: counter, result: num / counter })
//             }
//             counter++;
//         }
//         return dividers.length < 3;
//     }())
// }

function isPrimer() {
    var cache = {};

    return function isPrimeEvalute(v) {
        if (cache[v]) return cache[v];
        if (v <= 3) {
            cache[v] = v > 1
            return cache[v];
        }

        if (v % 2 == 0 || v % 3 == 0) {
            cache[v] = false;
            return cache[v];
        }
        var vSqrt = Math.sqrt(v);
        for (let i = 5; i <= vSqrt; i += 6) {
            if (v % i == 0 || v % (i + 2) == 0) {
                cache[v] = false;
                return cache[v];
            }
        }
        cache[v] = true;
        return cache[v];
    }
}

function factorizer() {
    var cache = [];
    var isPrime = isPrimer();

    return function factorizeEvalute(v) {
        if (v === 'hint') return cache;
        if (v === 'Phint') return isPrime('hint');
        if (cache[v]) { return cache[v] }
        if (!isPrime(v)) {
            let i = Math.floor(Math.sqrt(v));
            while (v % i != 0) {
                i--;
            }
            cache[v] = [
                ...factorizeEvalute(i),
                ...factorizeEvalute(v / i)
            ];
            return cache[v];
        }
        cache[v] = [v];
        return cache[v];
    }
}




var test = factorizer();
console.log(test(6));
console.log(test(7));
console.log(test(15));
console.log(test(17));
console.log(test('hint'));