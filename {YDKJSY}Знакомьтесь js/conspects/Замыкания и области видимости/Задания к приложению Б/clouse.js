function factorize(num) {
    var simpleNums = [2, 3, 5, 7, 11, 13, 17]
    var range = [];
    var counter = 0;
    return (function searchNumRange(n) {
        for (const number of simpleNums) {
            if (n * number === num) range.push(number);
            if (n * number > num) return searchNumRange(simpleNums[++counter]);
        }
        return range;
    }(simpleNums[0]))
}

console.log(factorize(11));

// 2 * 2 === 15 false
// 2 * 3 === 15 false
// 2 * 5 === 15 false
// 2 * 7 === 15 false
// 2 * 11 === 15 false
// 3 * 5 === 15 false



// 22
// 2 * 2 === 15 false
// 2 * 3 === 15 false
// 2 * 5 === 15 false
// 2 * 7 === 15 false
// 2 * 11 === 15 true

// 48
// 2 * 2 === 48 false
// 2 * 3 === 48 false
// 2 * 5 === 48 false
// 2 * 7 === 48 false
// 2 * 13 === 48 false
// 2 * 17 === 48 false
// 3 * 2 === 48 false
// 3 * 3 === 48 false
// 3 * 5 === 48 false
// 3 * 7 === 48 false
// 3 * 11 === 48 false
// 3 * 13 === 48 false
// 3 * 17 === 48 false
// 7 * 2 === 48 false
// 7 * 3 === 48 false
// 7 * 5 === 48 false
// 7 * 7 === 48 false
// 11 * 2 === 48 false
// 11 * 3 === 48 false
// 11 * 5 === 48 false
// 13 * 5 === 48 false
// 13 * 2 === 48 false
// 13 * 3 === 48 false
// 13 * 5 === 48 false
// 17 * 5 === 48 false
// 2 * 2 * 2 === 48 false
// 2 * 2 * 3 === 48 false
// 2 * 2 * 5 === 48 false
// 2 * 2 * 7 === 48 false
// 2 * 2 * 11 === 48 false
// 2 * 2 * 13 === 48 false
// 2 * 2 * 2 * 2 === 48 false
// 2 * 2 * 2 * 3 === 48 false
// 2 * 2 * 2 * 5 === 48 false
// 2 * 2 * 2 * 7 === 48 false
// 2 * 2 * 2 * 2 * 2 === 48 false
// 2 * 2 * 2 * 2 * 3 === 48 false
