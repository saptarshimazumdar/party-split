const divideMoney = (price, num, precision = 2) => {
    return round(price/num, precision);
}

const round = (num, precision = 2) => {
    const factor = Math.pow(10, precision);
    return Math.round((num + Number.EPSILON) * factor) / factor;
}

const validEmpty = (arr) => arr?.length ? arr : undefined;