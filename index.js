// data awal yang mendeskripsikan masalah dan fitur
const droneApp = {
    problem: "Banyak Tuna Netra yang kesulitan dalam kegiatan sehari hari",
    solution: "Memberikan panduan jalan untuk Tuna Netra dalam beraktivitas",
    how: "Drone terbang di atas pengguna, kemudian melakukan object detection untuk menentukan jalur aman, ketika ada halangan atau rintangan drone akan memberi peringatan dan intruksi sehingga pengguna mengikuti arahan dari drone untuk melewati rintangan tersebut.",
    features: [
        "Object detection",
        "Voice navigation",
        "GPS",
        "Emergency Location for missing people",
        "Warning battery",
        "Emergency landing to blind people",
        "Powerbank"
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('problem-text').textContent = droneApp.problem;
    document.getElementById('solution-text').textContent = droneApp.solution;
    document.getElementById('how-text').textContent = droneApp.how;

    const list = document.getElementById('features-list');
    droneApp.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        list.appendChild(li);
    });

    document.getElementById('start-sim').addEventListener('click', startSimulation);
    document.getElementById('get-location').addEventListener('click', showLocation);
    document.getElementById('speak-instruction').addEventListener('click', speakInstruction);
});

// simulasi sederhana menggerakkan drone dan menampilkan peringatan
function startSimulation() {
    const drone = document.getElementById('drone');
    const warning = document.getElementById('warning');
    let position = 0;
    warning.style.display = 'none';

    const interval = setInterval(() => {
        position += 20;
        drone.style.left = position + 'px';
        if (position >= 200 && position < 220) {
            warning.textContent = 'Rintangan terdeteksi! Ikuti instruksi.';
            warning.style.display = 'block';
            // suara peringatan jika browser mendukung
            speak('Rintangan terdeteksi. Belok kanan.');
        }
        if (position >= 400) {
            clearInterval(interval);
            warning.style.display = 'none';
            speak('Simulasi selesai.');
        }
    }, 500);
}

// geolokasi
function showLocation() {
    const output = document.getElementById('location-text');
    if (!navigator.geolocation) {
        output.textContent = 'Geolocation tidak didukung oleh browser ini.';
        return;
    }

    output.textContent = 'Mencari lokasi...';
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            output.textContent = `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;
        },
        (err) => {
            output.textContent = 'Gagal mendapatkan lokasi: ' + err.message;
        }
    );
}

// navigasi suara
function speakInstruction() {
    speak('Ikuti drone, berhenti jika ada peringatan, dan pastikan mengikuti jalur aman.');
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'id-ID';
        window.speechSynthesis.speak(msg);
    }
}
