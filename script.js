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



let autoSwitchTimeout;

function openDemo(el) {
    const demoUrl = el.dataset.demo;
    const demoName = el.querySelector("h4").innerText.trim();

    frame.src = demoUrl;

    // ✅ TRACK CORRECTLY
    trackDemoView(demoName);       // LOCAL
    trackDemoGA(demoName);         // GA4

    const initialDevice = el.dataset.device || "laptop";
    device.className = "device-frame " + initialDevice;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Entry animation
    gsap.fromTo(".demo-box",
        { y: 80, rotateX: 15, scale: .85, opacity: 0 },
        { y: 0, rotateX: 0, scale: 1, opacity: 1, duration: .8, ease: "power4.out" }
    );

    // 🔁 AUTO DEVICE TOGGLE
    if (initialDevice === "mobile") {
        autoSwitchTimeout = setTimeout(() => {
            switchDevice("laptop");
        }, 3000);
    }
}


function switchDevice(type) {
    gsap.timeline()
        .to("#deviceFrame", {
            scale: .92,
            rotateY: 8,
            duration: .3,
            ease: "power2.in"
        })
        .add(() => {
            device.className = "device-frame " + type;
        })
        .to("#deviceFrame", {
            scale: 1,
            rotateY: 0,
            duration: .5,
            ease: "power4.out"
        });
}



function closeDemo() {
    clearTimeout(autoSwitchTimeout);

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

function trackDemoView(demoName) {
    let demoStats = JSON.parse(localStorage.getItem("demoStats")) || {};

    demoStats[demoName] = (demoStats[demoName] || 0) + 1;

    localStorage.setItem("demoStats", JSON.stringify(demoStats));
}


function renderAnalytics() {
    const grid = document.getElementById("analyticsGrid");
    if (!grid) return;

    const views = JSON.parse(localStorage.getItem("demoViews")) || {};
    grid.innerHTML = "";

    if (Object.keys(views).length === 0) {
        grid.innerHTML = "<p style='color:#94a3b8'>No demo views yet.</p>";
        return;
    }

    for (const demo in views) {
        const card = document.createElement("div");
        card.className = "analytics-card";

        card.innerHTML = `
      <h4>${demo.replace("https://", "")}</h4>
      <p>${views[demo]} views</p>
    `;

        grid.appendChild(card);
    }
}

document.addEventListener("DOMContentLoaded", renderAnalytics);


if (window.location.hash === "#admin") {
    document.getElementById("adminAnalytics").style.display = "block";
    renderAnalytics();
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("isAdmin") === "true") {
        document
            .querySelectorAll("[data-admin-only]")
            .forEach(el => el.style.display = isAdmin ? "inline-block" : "none");

        // Optional: load admin-only data
        if (typeof renderAnalytics === "function") {
            renderAnalytics();
        }
    }
});
function adminLogin(username, password) {
    if (username === "admin" && password === "admin123") {
        localStorage.setItem("isAdmin", "true");
        location.reload();
    } else {
        alert("Invalid credentials");
    }
}
function adminLogout() {
    localStorage.removeItem("isAdmin");
    location.reload();
}

//   Track REAL interactions (not just views)


//   Portfolio view (once per visit)
gtag('event', 'portfolio_view', {
    page_title: document.title
});

function trackDemoGA(demoName) {
    gtag('event', 'demo_view', {
        demo_name: demoName
    });
}

function trackDailyView() {
    const today = new Date().toISOString().slice(0, 10);
    const data = JSON.parse(localStorage.getItem("dailyViews")) || {};

    data[today] = (data[today] || 0) + 1;
    localStorage.setItem("dailyViews", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", trackDailyView);

function renderViewsChart() {
    const ctx = document.getElementById("viewsChart");
    if (!ctx) return;

    const data = JSON.parse(localStorage.getItem("dailyViews")) || {};
    const labels = Object.keys(data);
    const values = Object.values(data);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Portfolio Views',
                data: values,
                tension: 0.4,
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("isAdmin") === "true") {
        renderViewsChart();
    }
});

gtag('event', 'demo_open', {
    demo_name: 'Clinic Website'
});

function trackDemoOpen(demoName) {
    let demoStats = JSON.parse(localStorage.getItem("demoStats")) || {};

    demoStats[demoName] = (demoStats[demoName] || 0) + 1;

    localStorage.setItem("demoStats", JSON.stringify(demoStats));
}
