// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAlzFuhs6xdfMegTzZBFawvVlj9uPibrmo",
    authDomain: "iotfirebase-96f81.firebaseapp.com",
    databaseURL: "https://iotfirebase-96f81-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iotfirebase-96f81",
    storageBucket: "iotfirebase-96f81.appspot.com",
    messagingSenderId: "344685924317",
    appId: "1:344685924317:web:eb9ed73ebb2a2d55f97034",
    measurementId: "G-RRYQJNM665"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to update status
function updateStatus(elementId, status) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = status;
        element.className = 'status ' + (status === 'online' ? 'online' : 'offline');
    }
}

// Equipment status
const equipmentRef = ref(db, 'equipment');
onValue(equipmentRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        updateStatus('dhtStatus', data.dht_status);
        updateStatus('npkSensorStatus', data.npk_sensor_status);
        updateStatus('pumpNPKStatus', data.pump_npk_status);
        updateStatus('pumpWaterStatus', data.pump_water_status);
    }
});

// แสดงค่า NPK
const nitrogenRef = ref(db, 'npksensor/N');
onValue(nitrogenRef, (snapshot) => {
    const N = snapshot.val();
    console.log(N);
    document.getElementById('nitrogenValue').textContent = N;
});

const phosphorusRef = ref(db, 'npksensor/P');
onValue(phosphorusRef, (snapshot) => {
    const P = snapshot.val();
    console.log(P);
    document.getElementById('phosphorusValue').textContent = P;
});

const potassiumRef = ref(db, 'npksensor/K');
onValue(potassiumRef, (snapshot) => {
    const K = snapshot.val();
    console.log(K);
    document.getElementById('potassiumValue').textContent = K;
});


// สถานะปุ่มรดปุ๋ย
const autoNPKRef = ref(db, 'button/AutoTimenpk');

function handleAutoNPKChange(event) {
    set(autoNPKRef, event.target.checked);
}

onValue(autoNPKRef, (snapshot) => {
    const checkbox = document.getElementById('npkAutoSwitch');
    checkbox.checked = snapshot.val();
});

const autoNPKCheckbox = document.getElementById('npkAutoSwitch');
autoNPKCheckbox.addEventListener('change', handleAutoNPKChange);

// สถานะปุ่มรดน้ำ
const autoMoistureRef = ref(db, 'button/automoisture');
const autoTimeRef = ref(db, 'button/AutoTimeWater');

function handleAutoMoistureChange(event) {
    if (event.target.checked) {
        set(autoMoistureRef, true);
        set(autoTimeRef, false);
    } else {
        set(autoMoistureRef, false);
    }
}

onValue(autoMoistureRef, (snapshot) => {
    const checkbox = document.getElementById('moistureAutoSwitch');
    checkbox.checked = snapshot.val();
});

onValue(autoTimeRef, (snapshot) => {
    // อัพเดตสถานะของ moistureAutoSwitch เมื่อ AutoTimeWater เปลี่ยน
    const checkbox = document.getElementById('moistureAutoSwitch');
    checkbox.checked = !snapshot.val(); // ถ้า AutoTimeWater เป็น true, moistureAutoSwitch ต้องเป็น false
});

const autoMoistureCheckbox = document.getElementById('moistureAutoSwitch');
autoMoistureCheckbox.addEventListener('change', handleAutoMoistureChange);



// Moisture sensor (assuming it's in the same structure as NPK)
const moistureRef = ref(db, 'DTHsensor/moisture');
onValue(moistureRef, (snapshot) => {
    const moisture = snapshot.val();
    document.getElementById('moistureValue').textContent = moisture;
});

// Temperature and Humidity (assuming they're in the same structure as NPK)
const temperatureRef = ref(db, 'DTHsensor/temperature');
onValue(temperatureRef, (snapshot) => {
    const temperature = snapshot.val();
    document.getElementById('temperatureValue').textContent = temperature;
    const fahrenheit = ((temperature * 9/5) + 32).toFixed(2);
    document.getElementById('fahrenheitValue').textContent = fahrenheit;
});

const humidityRef = ref(db, 'DTHsensor/humidity');
onValue(humidityRef, (snapshot) => {
    const humidity = snapshot.val();
    document.getElementById('humidityValue').textContent = humidity;
});

// Moisture Auto switch (assuming it's structured similarly to NPK auto)
const moistureAutoRef = ref(db, 'button/automoisture');

function handleMoistureAutoChange(event) {
    set(moistureAutoRef, event.target.checked);
}

onValue(moistureAutoRef, (snapshot) => {
    const checkbox = document.getElementById('moistureAutoSwitch');
    checkbox.checked = snapshot.val();
});

const moistureAutoCheckbox = document.getElementById('moistureAutoSwitch');
moistureAutoCheckbox.addEventListener('change', handleMoistureAutoChange);






//สถานะ DTH
let lastValue = null;
let lastUpdateTime = Date.now();
let statusCheckInterval;

function updateDHTStatus(isOnline) {
    const statusDot = document.getElementById('dhtStatus');
    const statusText = document.getElementById('dhtStatusText');

    if (isOnline) {
        statusDot.className = 'status-dot online';
        statusText.textContent = 'Online';
    } else {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Offline';
    }
}

function checkOfflineStatus() {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime > 3000) { // 3 วินาที
        updateDHTStatus(false);
    }
}

const controPUMwaterRef = ref(db, 'status/statusDTH');
onValue(controPUMwaterRef, (snapshot) => {
    const newValue = snapshot.val();
    if (newValue !== lastValue) {
        lastValue = newValue;
        lastUpdateTime = Date.now();
        updateDHTStatus(true);
        
        // รีเซ็ตตัวจับเวลา
        clearInterval(statusCheckInterval);
        statusCheckInterval = setInterval(checkOfflineStatus, 1000); // ตรวจสอบทุก 1 วินาที
    }
});

// เริ่มต้นตรวจสอบสถานะ offline
statusCheckInterval = setInterval(checkOfflineStatus, 1000);



//สถานะ NPKsensor

let lastValue2 = null;
let lastUpdateTime2 = Date.now();
let statusCheckInterval2;

function updateDHTStatus2(isOnline) {
    const statusDot = document.getElementById('npkSensorStatus');
    const statusText = document.getElementById('npkStatusText');

    if (isOnline) {
        statusDot.className = 'status-dot online';
        statusText.textContent = 'Online';
    } else {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Offline';
    }
}

function checkOfflineStatus2() {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime2 > 5000) { // 3 วินาที
        updateDHTStatus2(false);
    }
}

const controPUMNPKRef2 = ref(db, 'status/NPKsensor');
onValue(controPUMNPKRef2, (snapshot) => {
    const newValue = snapshot.val();
    if (newValue !== lastValue2) {
        lastValue2 = newValue;
        lastUpdateTime2 = Date.now();
        updateDHTStatus2(true);
        
        // รีเซ็ตตัวจับเวลา
        clearInterval(statusCheckInterval2);
        statusCheckInterval2 = setInterval(checkOfflineStatus2, 1000); // ตรวจสอบทุก 1 วินาที
    }
});

// เริ่มต้นตรวจสอบสถานะ offline
statusCheckInterval2 = setInterval(checkOfflineStatus2, 1000);


//สถานะ ควบคุมการรดปุ๋ย
let lastValue3 = null;
let lastUpdateTime3 = Date.now();
let statusCheckInterval3;

function updateDHTStatus3(isOnline) {
    const statusDot = document.getElementById('pumpNPKStatus');
    const statusText = document.getElementById('pumStatusText');

    if (isOnline) {
        statusDot.className = 'status-dot online';
        statusText.textContent = 'Online';
    } else {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Offline';
    }
}

function checkOfflineStatus3() {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime3 > 3000) { // 3 วินาที
        updateDHTStatus3(false);
    }
}

const controPUMNPKRef3 = ref(db, 'status/ControPUMNPK');
onValue(controPUMNPKRef3, (snapshot) => {
    const newValue = snapshot.val();
    if (newValue !== lastValue3) {
        lastValue3 = newValue;
        lastUpdateTime3 = Date.now();
        updateDHTStatus3(true);
        
        // รีเซ็ตตัวจับเวลา
        clearInterval(statusCheckInterval3);
        statusCheckInterval3 = setInterval(checkOfflineStatus3, 1000); // ตรวจสอบทุก 1 วินาที
    }
});

// เริ่มต้นตรวจสอบสถานะ offline
statusCheckInterval3 = setInterval(checkOfflineStatus3, 1000);


//สถานะส่วนการควบคุมปั๊มน้ำ

let lastValue4 = null;
let lastUpdateTime4 = Date.now();
let statusCheckInterval4;

function updateDHTStatus4(isOnline) {
    const statusDot = document.getElementById('pumpWaterStatus');
    const statusText = document.getElementById('pumWaterStatusText');

    if (isOnline) {
        statusDot.className = 'status-dot online';
        statusText.textContent = 'Online';
    } else {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Offline';
    }
}

function checkOfflineStatus4() {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime4 > 3000) { // 3 วินาที
        updateDHTStatus4(false);
    }
}

const controPUMNPKRef4 = ref(db, 'status/ControPUMWATER');
onValue(controPUMNPKRef4, (snapshot) => {
    const newValue = snapshot.val();
    if (newValue !== lastValue4) {
        lastValue4 = newValue;
        lastUpdateTime4 = Date.now();
        updateDHTStatus4(true);
        
        // รีเซ็ตตัวจับเวลา
        clearInterval(statusCheckInterval4);
        statusCheckInterval4 = setInterval(checkOfflineStatus4, 1000); // ตรวจสอบทุก 1 วินาที
    }
});

// เริ่มต้นตรวจสอบสถานะ offline
statusCheckInterval4 = setInterval(checkOfflineStatus4, 1000);

//set ค่าความชื้น
