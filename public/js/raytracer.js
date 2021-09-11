const coordinateConverter = require('./coordinate_converter.js');
const mathOperations = require('./math_operations.js');

function Sphere(center, radius, color, shiny) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.shininess = shiny;
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
            new Sphere([0, -1, 3], 1, [255, 0, 0], 500),
            new Sphere([2, 0, 4], 1, [0, 0, 255], 500),
            new Sphere([-2, 0, 4], 1, [0, 255, 0], 10),
            new Sphere([0, -5001, 0], 5000, [255, 255, 0], 1000)
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
            let D = coordinateConverter.canvasToViewport(canvas, x, y, 1);
            let color = traceRay(origin, D, 1, Number.POSITIVE_INFINITY);
            coordinateConverter.putPixel(canvas, canvas_buffer, canvas_pitch, color, x, y);
        }
    }
    updateCanvas(context, canvas_buffer);
}

function updateCanvas(context, buffer) {
    context.putImageData(buffer, 0, 0);
}

function traceRay(origin, D, t_min, t_max) {
    let [closest_sphere, closest_t] = closestIntersection(origin, D, t_min, t_max);
    if (closest_sphere === null) {
        return [255, 255, 255];
    }
    let spherePoint = mathOperations.add(origin, mathOperations.scalarMultiplication(D, closest_t));
    let normal_vector = mathOperations.normalize_vector(mathOperations.subtract(spherePoint, closest_sphere.center));
    return mathOperations.scalarMultiplication(closest_sphere.color, computeLighting(spherePoint, normal_vector, mathOperations.scalarMultiplication(D, -1), closest_sphere.shininess));
}

function closestIntersection(origin, D, t_min, t_max) {
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

    return [closest_sphere, closest_t];
}

function intersectRaySphere(origin, D, sphere) {
    let r = sphere.radius;
    let CO = mathOperations.subtract(origin, sphere.center);

    a = mathOperations.dotProduct(D, D);
    b = 2*mathOperations.dotProduct(CO, D);
    c = mathOperations.dotProduct(CO, CO) - r*r;

    discriminant = b*b - 4*a*c;
    if (discriminant < 0) {
        return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
    }

    let t1 = (-b + Math.sqrt(discriminant))/(2*a);
    let t2 = (-b - Math.sqrt(discriminant))/(2*a);

    return [t1, t2];
}

function computeLighting(point, normal, V, s) {
    let intensity = 0;
    lights.forEach(light => {
        if (light.type === 'ambient') {
            intensity += light.intensity;
        } else {
            let light_vector = [];
            let t_max;
            if (light.type === 'point') {
                light_vector = mathOperations.subtract(light.position, point);
                t_max = 1;
            } else {
                light_vector = light.direction;
                t_max = Number.POSITIVE_INFINITY;
            }

            // shadow check
            let [shadow_sphere, shadow_t] = closestIntersection(point, light_vector, 0.001, t_max);
            if (shadow_sphere !== null) {
                return;
            }
            
            // diffuse
            let n_dot_l = mathOperations.dotProduct(normal, light_vector);
            if (n_dot_l > 0) {
                intensity += light.intensity * n_dot_l/(mathOperations.vector_length(normal) * mathOperations.vector_length(light_vector));
            }

            // specular
            if (s != -1) {
                let R = mathOperations.subtract(mathOperations.scalarMultiplication(normal, 2 * mathOperations.dotProduct(normal, light_vector)), light_vector);
                let r_dot_v = mathOperations.dotProduct(R, V);
                if (r_dot_v > 0) {
                    intensity += light.intensity * Math.pow(r_dot_v/(mathOperations.vector_length(R) * mathOperations.vector_length(V)), s);
                }
            }
        }
    });
    return intensity;
}

window.onload = init();
