function subtract(v1, v2) {
    let difference = [];
    for (let i = 0; i < 3; i++) {
        difference.push(v1[i] - v2[i]);
    }
    return difference;
}

function dotProduct(v1, v2) {
    let dotProduct = 0;
    for (let i = 0; i < 3; i++) {
        dotProduct += v1[i] * v2[i];
    }
    return dotProduct;
}