function add(v1, v2) {
    let sum = [];
    for (let i = 0; i < 3; i++) {
        sum.push(v1[i] + v2[i]);
    }
    return sum;
}

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

function vector_length(vector) {
    return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
}

function normalize_vector(vector) {
    const vLength = vector_length(vector);
    return [vector[0]/vLength, vector[1]/vLength, vector[2]/vLength];
}

function scalarMultiplication(vector, scalar) {
    let scaledVector = [];
    for (let i = 0; i < vector.length; i++) {
        scaledVector.push(scalar * vector[i])
    }
    return scaledVector;
}

module.exports = {
    add,
    subtract,
    dotProduct,
    vector_length,
    normalize_vector,
    scalarMultiplication
}