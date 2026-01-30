/* THEME TOGGLE */
const toggle = document.getElementById("themeToggle");
toggle.onclick = () => {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
};

/* GSAP SCROLL REVEAL */
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".reveal").forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 80,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: "top 80%"
        }
    });
});

/* THREE.JS HERO BACKGROUND */
const canvas = document.getElementById("heroCanvas");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.TorusKnotGeometry(1, 0.35, 100, 16);
const material = new THREE.MeshStandardMaterial({
    color: 0x6cf2ff,
    wireframe: true
});
const knot = new THREE.Mesh(geometry, material);
scene.add(knot);

const light = new THREE.PointLight(0x6cf2ff, 1);
light.position.set(5, 5, 5);
scene.add(light);

function animate() {
    requestAnimationFrame(animate);
    knot.rotation.x += 0.003;
    knot.rotation.y += 0.004;
    renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// GSAP Logic
const modal = document.getElementById("demoModal");
const frame = document.getElementById("demoFrame");
const device = document.getElementById("deviceFrame");

let tl;

function openDemo(el) {
    frame.src = el.dataset.demo;

    device.className = "device-frame " + (el.dataset.device || "laptop");

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    tl = gsap.timeline();
    tl.fromTo(".demo-box",
        { y: 80, rotateX: 15, scale: .85, opacity: 0 },
        { y: 0, rotateX: 0, scale: 1, opacity: 1, duration: .8, ease: "power4.out" }
    );
}

function closeDemo() {
    gsap.to(".demo-box", {
        y: 60,
        rotateX: 10,
        scale: .9,
        opacity: 0,
        duration: .4,
        ease: "power3.in",
        onComplete: () => {
            modal.classList.remove("active");
            frame.src = "";
            document.body.style.overflow = "";
        }
    });
}

function toggleFullscreen() {
    const elem = document.querySelector(".demo-box");

    if (!document.fullscreenElement) {
        elem.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}