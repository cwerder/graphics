function Sphere(center, radius, color) {
    this.center = center;
    this.radius = radius;
    this.color = color;
}

function Light(type, intensity, position, direction) {
    this.type = type;
    this.intensity = intensity;
    if (this.type === 'point') {
        this.position = position;
    } else if (this.type === 'directional') {
        this.direction = direction;
    }
}

var spheres = [
            new Sphere([0, -1, 3], 1, [255, 0, 0]),
            new Sphere([2, 0, 4], 1, [0, 0, 255]),
            new Sphere([-2, 0, 4], 1, [0, 255, 0]),
            new Sphere([0, -5001, 0], 5000, [255, 255, 0])
        ];

var lights = [
    new Light('ambient', .2),
    new Light('point', .6, [2,1,0], null),
    new Light('directional', .2, null, [1,4,4])
]

var origin = [0, 0, 0];

function init() {
    let canvas = document.getElementById('myCanvas');
    let context = canvas.getContext('2d');
    rayTracer(canvas, context);
}

function rayTracer(canvas, context) {
    var canvas_buffer = context.getImageData(0, 0, canvas.width, canvas.height);
    var canvas_pitch = canvas_buffer.width * 4;
    for (let x = -canvas.width/2; x <= canvas.width/2; x++) {
        for (let y = -canvas.height/2; y <= canvas.height/2; y++) {
            let D = canvasToViewport(canvas, x, y, 1);
            let color = traceRay(origin, D, 1, Number.POSITIVE_INFINITY);
            putPixel(canvas, canvas_buffer, canvas_pitch, color, x, y);
        }
    }
    updateCanvas(context, canvas_buffer);
}

function updateCanvas(context, buffer) {
    context.putImageData(buffer, 0, 0);
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
        return [255, 255, 255];
    }
    let spherePoint = add(origin, scalarMultiplication(D, closest_t));
    let normal_vector = normalize_vector(subtract(spherePoint, closest_sphere.center));
    return scalarMultiplication(closest_sphere.color, computeLighting(spherePoint, normal_vector));
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

function computeLighting(point, normal) {
    let intensity = 0;
    lights.forEach(light => {
        if (light.type === 'ambient') {
            intensity += light.intensity;
        } else {
            let light_vector = [];
            if (light.type === 'point') {
                light_vector = subtract(light.position, point);
            } else {
                light_vector = light.direction;
            }
            let n_dot_l = dotProduct(normal, light_vector);
            if (n_dot_l > 0) {
                intensity += light.intensity * n_dot_l/(vector_length(normal) * vector_length(light_vector));
            }
        }
    });
    return intensity;
}

window.onload = init();
