const droneApp = {
    problem: "Banyak Tuna Netra yang kesulitan dalam kegiatan sehari hari",
    solution: "Memberikan panduan jalan untuk Tuna Netra dalam beraktivitas. \nSolusi panduan jalan bagi tunanetra yang komprehensif harus dimulai dari penguatan infrastruktur fisik yang terstandarisasi. \nHal ini melibatkan pemasangan guiding block atau ubin taktil secara konsisten di seluruh area publik, di mana pola garis digunakan untuk memandu arah jalan dan pola titik sebagai peringatan adanya hambatan atau persimpangan. Agar efektif, jalur ini harus bebas dari gangguan permanen seperti kendaraan parkir atau pedagang kaki lima, serta didukung oleh fasilitas penyeberangan yang dilengkapi Audible Traffic Signals (lampu lalu lintas bersuara) untuk menjamin keamanan saat berpindah jalur di jalan raya. Selanjutnya, solusi ini mengintegrasikan teknologi asistif mutakhir sebagai instrumen navigasi real-time. Penggunaan tongkat pintar (smart cane) yang dilengkapi sensor ultrasonik memungkinkan pengguna mendeteksi hambatan yang menggantung di udara yang tidak terjangkau tongkat konvensional. Di sisi digital, aplikasi berbasis kecerdasan buatan (AI) berperan sebagai narator lingkungan yang memberikan informasi lokasi melalui audio, mengenali objek di sekitar, hingga membacakan teks penunjuk jalan. Integrasi ini menciptakan sistem navigasi berlapis yang memadukan kepekaan fisik dengan akurasi data digital. Di balik kecanggihan alat tersebut, kapasitas individu dan dukungan sosial menjadi pilar penentu keberhasilan mobilitas. Para penyandang tunanetra perlu dibekali dengan pelatihan Orientasi dan Mobilitas (O&M) yang intensif untuk mempertajam kemampuan mental mapping dan pemanfaatan indra pendengaran sebagai alat navigasi alami. Secara paralel, masyarakat umum perlu diedukasi mengenai etika pendampingan agar mampu memberikan bantuan yang tepat tanpa merampas kemandirian tunanetra. Sinergi antara kebijakan pemerintah dalam tata kota, inovasi teknologi, dan inklusi sosial inilah yang membentuk ekosistem mobilitas yang benar-benar aksesibel dan aman.",
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

const obstacles = [
    { position: 200, message: "Rintangan terdeteksi. Belok kanan." },
    { position: 350, message: "Rintangan terdeteksi. Belok kiri." },
    { position: 500, message: "Rintangan terdeteksi. Berhenti sebentar." }
];

function startSimulation() {
    const simulation = document.getElementById('simulation');
    const drone = document.getElementById('drone');
    const warning = document.getElementById('warning');
    const batteryBar = document.getElementById('battery');
    let position = 0;
    let batteryLevel = 100; // mulai dari 100%
     const drainRate = 2;       // baterai turun 2% tiap detik
    const intervalTime = 1000;

    warning.style.display = 'none';

    // hapus obstacle lama
    const oldObstacles = simulation.querySelectorAll('.obstacle');
    oldObstacles.forEach(obs => obs.remove());

    // tambahkan obstacle visual
    obstacles.forEach(obstacle => {
        const obstacleEl = document.createElement('div');
        obstacleEl.className = 'obstacle';
        obstacleEl.textContent = '✕';
        obstacleEl.style.left = obstacle.position + 'px';
        simulation.appendChild(obstacleEl);
    });

    const interval = setInterval(() => {
        position += 20;
        batteryLevel -= drainRate;
        batteryBar.value = batteryLevel;

        drone.style.left = position + 'px';

        // cek rintangan
      obstacles.forEach(obstacle => {
            if (position >= obstacle.position && position < obstacle.position + 20) {
                warning.textContent = 'Rintangan terdeteksi! Ikuti instruksi.';
                warning.style.display = 'block';
                speak(obstacle.message);
            }
        });


        // cek baterai
        if (batteryLevel <= 20) {
            warning.textContent = 'Baterai hampir habis!';
            warning.style.display = 'block';
            speak('Baterai drone hampir habis, segera isi ulang.');
        }

        // selesai simulasi
        if (position >= 600) {
            clearInterval(interval);
            warning.style.display = 'none';
            speak('Simulasi selesai.');
        }
        if (batteryLevel <= 0) {
            clearInterval(interval);
            warning.textContent = 'Drone berhenti karena baterai habis!';
            warning.style.display = 'block';
            speak('Baterai habis, drone mendarat darurat.');
        }
    }, intervalTime);
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