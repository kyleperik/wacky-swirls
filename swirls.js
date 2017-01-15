var scene;
var camera;
var renderer;
var mesh;
function render(){
    requestAnimationFrame(render);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}
function init() {
    scene    = new THREE.Scene();
    camera   = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({antialias: true});

    camera.position.z = 10;
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);
    
    // (width, height, depth)
    var geometry = new THREE.BoxGeometry(5, 5, 5);
    geometry = new THREE.EdgesGeometry(geometry);
    var material = new THREE.MeshBasicMaterial({ 
        color: 0xFFFFFF, 
        wireframe: true,
        wireframeLinewidth: 1
    });
    mesh = new THREE.LineSegments(geometry, material)
    scene.add(mesh);

    render();
}

init();