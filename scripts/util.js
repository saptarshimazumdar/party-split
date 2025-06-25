const divideMoney = (price, num, precision = 2) => {
    const factor = Math.pow(10, precision);
    return Math.round(((price/num) + Number.EPSILON) * factor)/factor
}