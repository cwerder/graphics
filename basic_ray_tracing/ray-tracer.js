function Sphere(center, radius, color) {
    this.center = center;
    this.radius = radius;
    this.color = color;
}

var spheres = [new Sphere([0, -1, 3], 1, 'red'),
           new Sphere([2, 0, 4], 1, 'blue'),
           new Sphere([-2, 0, 4], 1, 'green')];

var origin = [0, 0, 0];

function init() {
    let canvas = document.getElementById('myCanvas');
    let context = canvas.getContext('2d');
    rayTracer(canvas, context);
}

function rayTracer(canvas, context) {
    for (let x = -canvas.width/2; x <= canvas.width/2; x++) {
        for (let y = -canvas.height/2; y <= canvas.height/2; y++) {
            let D = canvasToViewport(canvas, x, y, 1);
            let color = traceRay(origin, D, 1, Number.POSITIVE_INFINITY);
            putPixel(canvas, context, color, x, y);
        }
    }
}

function traceRay(origin, D, t_min, t_max) {
    let closest_t = Number.POSITIVE_INFINITY;
    closest_sphere = null;
    
    spheres.forEach(sphere => {
        let tList = intersectRaySphere(origin, D, sphere);
        let t1 = tList[0];
        let t2 = tList[1];

        if (t1 >= t_min && t1 <= t_max && t1 < closest_t) {
            closest_t = t1;
            closest_sphere = sphere;
        }
        if (t2 >= t_min && t2 <= t_max && t2 < closest_t) {
            closest_t = t2;
            closest_sphere = sphere;
        }
    });
    if (closest_sphere === null) {
        return 'white';
    }
    return closest_sphere.color;
}

function intersectRaySphere(origin, D, sphere) {
    let r = sphere.radius;
    let CO = subtract(origin, sphere.center);

    a = dotProduct(D, D);
    b = 2*dotProduct(CO, D);
    c = dotProduct(CO, CO) - r*r;

    discriminant = b*b - 4*a*c;
    if (discriminant < 0) {
        return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
    }

    let t1 = (-b + Math.sqrt(discriminant))/(2*a);
    let t2 = (-b - Math.sqrt(discriminant))/(2*a);

    return [t1, t2];
}

window.onload = init();
