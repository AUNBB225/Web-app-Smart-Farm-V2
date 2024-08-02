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



// สำหรับ Auto และ Auto Time
const autoTimeRef = ref(db, 'button/AutoTimeWater');
const autoMoistureRef = ref(db, 'button/automoisture');

function handleAutoTimeChange(event) {
    if (event.target.checked) {
        set(autoTimeRef, true);
        set(autoMoistureRef, false);
    } else {
        set(autoTimeRef, false);
    }
}

function handleAutoMoistureChange(event) {
    if (event.target.checked) {
        set(autoMoistureRef, true);
        set(autoTimeRef, false);
    } else {
        set(autoMoistureRef, false);
    }
}

onValue(autoTimeRef, (snapshot) => {
    const checkbox = document.getElementById('switchAutoTime');
    checkbox.checked = snapshot.val();
});

onValue(autoMoistureRef, (snapshot) => {
    const checkbox = document.getElementById('switchAuto');
    checkbox.checked = snapshot.val();
});

const autoTimeCheckbox = document.getElementById('switchAutoTime');
autoTimeCheckbox.addEventListener('change', handleAutoTimeChange);

const autoMoistureCheckbox = document.getElementById('switchAuto');
autoMoistureCheckbox.addEventListener('change', handleAutoMoistureChange);


// ... (existing code)

// Add this code for P1 switch
const p1Ref = ref(db, 'button/pumzone1');

function handleP1Change(event) {
    set(p1Ref, event.target.checked);
}

onValue(p1Ref, (snapshot) => {
    const checkbox = document.getElementById('switchPUM1');
    checkbox.checked = snapshot.val();
});

const p1Checkbox = document.getElementById('switchPUM1');
p1Checkbox.addEventListener('change', handleP1Change);


const p2Ref = ref(db, 'button/pumzone2');

function handleP2Change(event) {
    set(p2Ref, event.target.checked);
}

onValue(p2Ref, (snapshot) => {
    const checkbox = document.getElementById('switchPUM2');
    checkbox.checked = snapshot.val();
});

const p2Checkbox = document.getElementById('switchPUM2');
p2Checkbox.addEventListener('change', handleP2Change);

// ... (rest of your existing code)

//-------------------การSETค่า----------------------
        
        //SETค่าM
        const setMRef = ref(db, 'Setmoisture/Setmoisture');
        const setM = document.getElementById('setM');
        


        onValue(setMRef, (snapshot) => {
            const valueM = snapshot.val();
            setM.value = valueM;
        });

        setM.addEventListener('input', (event) => {
            
            const newValueM = event.target.value;
            const numberValueM = parseInt(newValueM);

            set(setMRef, numberValueM);
        });


        const moistureRef = ref(db, 'DTHsensor/moisture');
onValue(moistureRef, (snapshot) => {
    const moisture = snapshot.val();
    document.getElementById('moistureValue').textContent = moisture;
});

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


//ส่วนการตั้งเวลา
const days = [
    { id: 'sunday', name: 'วันอาทิตย์' },
    { id: 'mondy', name: 'วันจันทร์' },
    { id: 'tuesday', name: 'วันอังคาร' },
    { id: 'wednesday', name: 'วันพุธ' },
    { id: 'thursday', name: 'วันพฤหัสบดี' },
    { id: 'friday', name: 'วันศุกร์' },
    { id: 'saturday', name: 'วันเสาร์' }
  ];
  
  let currentDay = '';
  let scheduleData = {};
  

  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  function initializeScheduleTable() {
    const tableBody = document.getElementById('watering-schedule');
    days.forEach(day => {
        const row = `
          <tr>
            <td>${day.name}</td>
            <td id="${day.id}-status">กำลังโหลด...</td>
            <td><button class="btn btn-primary btn-sm settings-btn" data-day="${day.id}">ตั้งค่า</button></td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    
      // เพิ่ม event listeners หลังจากสร้างปุ่มเสร็จแล้ว
      document.querySelectorAll('.settings-btn').forEach(button => {
        button.addEventListener('click', function() {
          openSettingsModal(this.getAttribute('data-day'));
        });
      });
    loadScheduleData();
  }
  
  function loadScheduleData() {
    const scheduleRef = database.ref('AutoTime/schedule');
    scheduleRef.on('value', (snapshot) => {
      scheduleData = snapshot.val();
      updateAllStatusDisplays();
    });
  }
  
  function updateAllStatusDisplays() {
    days.forEach(day => updateStatusDisplay(day.id));
  }
  
  function updateStatusDisplay(day) {
    const statusElement = document.getElementById(`${day}-status`);
    if (scheduleData[day] && scheduleData[day].enabled) {
      statusElement.textContent = 'เปิดใช้งาน';
      statusElement.classList.add('text-success');
    } else {
      statusElement.textContent = 'ปิดใช้งาน';
      statusElement.classList.remove('text-success');
    }
  }
  
  function openSettingsModal(day) {
    currentDay = day;
    $('#settingsModalLabel').text(`ตั้งค่าการรดน้ำ - ${getDayName(day)}`);
    loadExistingSettings(day);
    $('#settingsModal').modal('show');
  }
  
  function loadExistingSettings(day) {
    const settings = scheduleData[day] || {};
    $('#watering-enabled').prop('checked', settings.enabled || false);
    
    const timesContainer = document.getElementById('times-container');
    timesContainer.innerHTML = '';
    
    if (settings.times) {
      Object.values(settings.times).forEach((time, index) => {
        addTimeSlot(time.time, time.duration);
      });
    } else {
      addTimeSlot();
    }
  }
  
  function addTimeSlot(time = '', duration = '') {
    const timesContainer = document.getElementById('times-container');
    const index = timesContainer.children.length;
    const timeSlot = `
      <div class="form-group time-slot">
        <label for="watering-time-${index}">เวลารดน้ำ</label>
        <input type="time" class="form-control watering-time" id="watering-time-${index}" value="${time}">
        <label for="watering-duration-${index}">ระยะเวลา (นาที)</label>
        <input type="number" class="form-control watering-duration" id="watering-duration-${index}" min="1" max="120" value="${duration}">
      </div>
    `;
    timesContainer.insertAdjacentHTML('beforeend', timeSlot);
  }
  
  function removeTimeSlot(button) {
    button.closest('.time-slot').remove();
  }
  
  function saveSettings() {
    const enabled = $('#watering-enabled').prop('checked');
    const times = [];
    
    document.querySelectorAll('.time-slot').forEach((slot, index) => {
      const time = slot.querySelector('.watering-time').value;
      const duration = parseInt(slot.querySelector('.watering-duration').value);
      if (time && duration) {
        times.push({ time, duration });
      }
    });
    
    const dayRef = database.ref(`AutoTime/schedule/${currentDay}`);
    dayRef.set({ enabled, times })
      .then(() => {
        console.log('บันทึกการตั้งค่าสำเร็จ');
        $('#settingsModal').modal('hide');
      })
      .catch((error) => {
        console.error('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า:', error);

      });
  }

  // เชื่อมต่อฟังก์ชัน saveSettings กับ window object
window.saveSettings = saveSettings;
  
  function getDayName(day) {
    return days.find(d => d.id === day)?.name || day;
  }
  
  // เรียกใช้ฟังก์ชันเริ่มต้นเมื่อโหลดหน้า
  $(document).ready(function() {
    initializeScheduleTable();
  });


//-------------------------------------

// ฟังก์ชันสำหรับดึงข้อมูลจาก Google Sheets
async function fetchPlantData() {
  const SHEET_ID = '13LCdzrWExvsiHEcH9Uo_TpzW5qYjB4AuMtnND-leB9s';
  const API_KEY = 'AIzaSyB2qLlJsTEjiF56dzNovNm9fdkWMTUYLkQ';
  const range = 'ความชื้นพืช!A:B';  // ปรับตามชื่อ sheet และช่วงของข้อมูล

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`);
  const data = await response.json();
  
  // ตัดแถวแรกออกและส่งคืนข้อมูลที่เหลือ
  return data.values.slice(1);
}

// ฟังก์ชันสำหรับเพิ่มตัวเลือกลงใน select
function populatePlantSelect(plants) {
    const select = document.getElementById('plantSelect');
    
    // เพิ่มตัวเลือกเริ่มต้น
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "เลือกชนิดพืช";
    defaultOption.value = "0";
    select.appendChild(defaultOption);

    // เพิ่มตัวเลือกจากข้อมูลพืช
    plants.forEach(plant => {
        if (plant.length >= 2) {  // ตรวจสอบว่ามีข้อมูลครบทั้งชื่อพืชและค่าความชื้น
            const option = document.createElement('option');
            option.textContent = plant[0];  // ชื่อพืช
            option.value = plant[1];  // ค่าความชื้น
            select.appendChild(option);
        }
    });
}

// ฟังก์ชันสำหรับอัปเดต Firebase เมื่อเลือกพืช
function updateFirebase(moisture) {
    const moistureRef = ref(db, 'Setmoisture/Setmoisture');
    set(moistureRef, moisture);
}

// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const plants = await fetchPlantData();
        populatePlantSelect(plants);

        // เพิ่ม event listener สำหรับการเปลี่ยนแปลงใน select
        document.getElementById('plantSelect').addEventListener('change', (event) => {
            const selectedMoisture = event.target.value;
            if (selectedMoisture) {  // ตรวจสอบว่าไม่ใช่ตัวเลือกเริ่มต้น
                updateFirebase(selectedMoisture);
            }
        });
    } catch (error) {
        console.error('Error fetching plant data:', error);
    }
});