var scene;
var camera;
var renderer;
var mesh;
var pos = 0;
var rot = 0;
var baseVerticies = [
    { v: new THREE.Vector3( 1, 0, 0), mirrors: 6, vel: { x: 0, z: 2, }, accel: { x: 0, z: 0, } },
];

function range(i) {
    return [...Array(i).keys()];
}

function roundon(v, on) {
    return Math.round(v / on) * on;
}

function render(){
    requestAnimationFrame(render);
    rot += 0.02;
    mesh.rotation.y = rot;
    camera.position.y -= (pos + camera.position.y) / 10;
    renderer.render(scene, camera);
    if (baseVerticies[baseVerticies.length - 1].v.y > - pos - 50) {
        baseVerticies = baseVerticies.concat(generate(baseVerticies[baseVerticies.length - 1])).slice(-500);
        scene.remove(mesh);
        mesh = createLines(baseVerticies);
        scene.add(mesh);
    }
}

function factor(number) {
    var factors = Array
        .from(Array(number + 1), (_, i) => i)
        .filter(i => number % i === 0).filter(x => x != number);
    return factors[Math.floor(Math.random() * factors.length)];
}

function generate(last) {
    var split = Math.round(Math.random() * 10) === 0 || last.mirrors === 1;
    var mirrors = (
        split
            ? (
                Math.round(Math.random() * 2) === 0 && last.mirrors < 20 || last.mirrors === 1
                    ? last.mirrors * Math.ceil(Math.random() * 5)
                    : last.mirrors / factor(last.mirrors)
            ) : last.mirrors
    );
    return {
        v: new THREE.Vector3(
            last.v.x + last.vel.x,
            last.v.y - (split ? 1 : 1),
            last.v.z + last.vel.z
        ),
        vel: {
            x: (last.vel.x - last.v.x * 0.5 + last.accel.x) * .5,
            z: (last.vel.z - last.v.z * 0.5 + last.accel.z) * .5,
        },
        accel: {
            x: last.accel.x + (Math.random() - 0.5) * 0.1,
            z: last.accel.z + (Math.random() - 0.5) * 0.1,
        },
        mirrors: mirrors,
    };
}

function createLines(verticies) {
    var geometry = new THREE.Geometry();
    geometry.vertices = [].concat.apply([], verticies.map(
        (x, i) => {
            if (i + 1 === verticies.length) return [];
            var next = verticies[i + 1];
            var mirrors = Math.max(x.mirrors, next.mirrors);
            return [].concat.apply([], range(mirrors).map(
                m => [
                    x.mirrors > 1 ? x.v.clone().applyAxisAngle(
                        new THREE.Vector3( 0, 1, 0 ),
                        ((roundon(m, mirrors / x.mirrors)) / mirrors) * Math.PI * 2
                    ) : new THREE.Vector3(0, x.v.y, 0),
                    next.mirrors > 1 ? next.v.clone().applyAxisAngle(
                        new THREE.Vector3( 0, 1, 0 ),
                        (roundon(m, mirrors / next.mirrors) / mirrors) * Math.PI * 2
                    ) : new THREE.Vector3(0, next.v.y, 0),
                ]
            ));
        }
    ));
    var material = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
    });
    return new THREE.LineSegments(geometry, material);
}

function init() {
    scene    = new THREE.Scene();
    camera   = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({antialias: true});

    camera.position.z = 10;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);

    mesh = createLines(baseVerticies);
    scene.add(mesh);

    render();
}

window.onload = function () {
    window.addEventListener('wheel', function (e) {
        pos = Math.max(0, pos + e.deltaY);
    });
};

init();
