const getStandardDeviation = arr => {
    var total = 0;

    arr.forEach(val => {
        total += val;
    });
    for (var i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    var avg = total / arr.length;

    var total = 0;
    for (var i = 0; i < arr.length; i++) {
        total += Math.pow(arr[i] - avg, 2);
    }
    var s = total / arr.length;
    return Math.pow(s, 0.5);
};

module.exports = {
    getStandardDeviation
};
