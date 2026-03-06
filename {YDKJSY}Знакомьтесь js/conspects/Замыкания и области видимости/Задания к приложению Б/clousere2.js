function toggle(str) {
    var args = arguments;
    var cursor = 0;

    return function next() {
        if (args.length === 0) return undefined;
        if (cursor >= args.length) cursor = 0;
        return args[cursor++];
    }

}

var test = toggle('super', 'besty', 'belisimo');
console.log(test());
console.log(test());
console.log(test());
console.log(test());
console.log(test());
console.log(test());
console.log(test());