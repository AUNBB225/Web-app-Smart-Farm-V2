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

// แสดงค่า NPK
let N, P, K;  // ประกาศตัวแปรภายนอกฟังก์ชัน


function getRange(value, middleLow, middleHigh) {
    let range = value < middleLow ? "ต่ำ" : 
                value <= middleHigh ? "กลาง" : "สูง";
    return `${value} ppm (${range})`;
}

const nitrogenRef = ref(db, 'npksensor/N');
onValue(nitrogenRef, (snapshot) => {
    N = snapshot.val();
    console.log(N);
    document.getElementById('NitrogenValue').textContent = getRange(N, 150, 250);
});

const phosphorusRef = ref(db, 'npksensor/P');
onValue(phosphorusRef, (snapshot) => {
    P = snapshot.val();
    console.log(P);
    document.getElementById('phosphorusValue').textContent = getRange(P, 25, 50);
});

const potassiumRef = ref(db, 'npksensor/K');
onValue(potassiumRef, (snapshot) => {
    K = snapshot.val();
    console.log(K);
    document.getElementById('potassiumValue').textContent = getRange(K, 50, 100);
});

// ฟังก์ชันสำหรับดึงข้อมูลจาก Google Sheets
async function fetchPlantData() {
    const SHEET_ID = '13LCdzrWExvsiHEcH9Uo_TpzW5qYjB4AuMtnND-leB9s';
    const API_KEY = 'AIzaSyB2qLlJsTEjiF56dzNovNm9fdkWMTUYLkQ';
    const range = 'NPKพืช!A:D';  // ปรับตามชื่อ sheet และช่วงของข้อมูล
  
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`);
    const data = await response.json();
    
    // ตัดแถวแรกออกและส่งคืนข้อมูลที่เหลือ
    return data.values.slice(1);
}

let columnB, columnC, columnD;  // ประกาศตัวแปรภายนอกฟังก์ชัน

// ดึงข้อมูลจาก Google Sheets
fetchPlantData().then(data => {
    const selectElement = document.getElementById('plantSelect');
  
    // วนลูปเพื่อเพิ่มตัวเลือกใน <select>
    data.forEach((row, index) => {
      const option = document.createElement('option');
      option.value = index;  // ใช้ index ของแถวเป็นค่าของตัวเลือก
      option.text = row[0];  // ใช้ข้อมูลจากคอลั่ม A เป็นข้อความของตัวเลือก
      selectElement.add(option);
    });
  
    // เพิ่ม event listener เมื่อผู้ใช้เลือกตัวเลือก
    selectElement.addEventListener('change', (event) => {
      const selectedIndex = event.target.value;
      const selectedRow = data[selectedIndex];
      // ข้อมูลจากคอลั่ม B, C, D จะถูกเก็บลงในตัวแปร
      columnB = selectedRow[1];
      columnC = selectedRow[2];
      columnD = selectedRow[3];
      // ทำอะไรต่อก็ได้กับข้อมูลที่เลือก
      document.getElementById('NitrogenValue2').textContent = columnB;
      document.getElementById('phosphorusValue2').textContent = columnC;
      document.getElementById('potassiumValue2').textContent = columnD;

      calculateFertilizerN(N);
      calculateFertilizerP(P);
      calculateFertilizerK(K);
    });
});

async function fetchSoilData() {
    const SHEET_ID = '13LCdzrWExvsiHEcH9Uo_TpzW5qYjB4AuMtnND-leB9s';
    const API_KEY = 'AIzaSyB2qLlJsTEjiF56dzNovNm9fdkWMTUYLkQ';
    const range = 'ประเภทดิน!A:B';  // ปรับตามชื่อ sheet และช่วงของข้อมูล
  
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`);
    const data = await response.json();
    
    // ตัดแถวแรกออกและส่งคืนข้อมูลที่เหลือ
    return data.values.slice(1);
}

let bulkSoil;  // ประกาศตัวแปรภายนอกฟังก์ชัน

// ดึงข้อมูลจาก Google Sheets
fetchSoilData().then(data => {
    const selectElement = document.getElementById('soilSelect');
  
    // วนลูปเพื่อเพิ่มตัวเลือกใน <select>
    data.forEach((row, index) => {
      const option = document.createElement('option');
      option.value = index;  // ใช้ index ของแถวเป็นค่าของตัวเลือก
      option.text = row[0];  // ใช้ข้อมูลจากคอลั่ม A เป็นข้อความของตัวเลือก
      selectElement.add(option);
    });
  
    // เพิ่ม event listener เมื่อผู้ใช้เลือกตัวเลือก
    selectElement.addEventListener('change', (event) => {
      const selectedIndex = event.target.value;
      const selectedRow = data[selectedIndex];
      // กำหนดค่าให้กับตัวแปรโกลบอล
      bulkSoil = selectedRow[1];
      // ทำอะไรต่อก็ได้กับข้อมูลที่เลือก
      calculateFertilizerN(N);
      calculateFertilizerP(P);
      calculateFertilizerK(K);
    });
});

// ค่า bulkSoil ที่ได้จากการเลือกประเภทดิน

// คำนวณปริมาณปุ๋ยที่ต้องใช้

// ฟังก์ชันสำหรับคำนวณปริมาณปุ๋ย
function calculateFertilizerN(N) {
     // ค่า bulkSoil ที่ได้จากการเลือกประเภทดิน
    let nitrogenRequirement = (N * 20 * bulkSoil * 10) / 1000000;
    document.getElementById('nitrogen').value = nitrogenRequirement.toFixed(3);
    
}


function calculateFertilizerP(P) {
    // ค่า bulkSoil ที่ได้จากการเลือกประเภทดิน
   let phosphorusRequirement = (P * 20 * bulkSoil * 10) / 1000000;
   document.getElementById('phosphorus').value = phosphorusRequirement.toFixed(3);
}

function calculateFertilizerK(K) {
    // ค่า bulkSoil ที่ได้จากการเลือกประเภทดิน
   let potassiumRequirement = (K * 20 * bulkSoil * 10) / 1000000;
   document.getElementById('potassium').value = potassiumRequirement.toFixed(3);
   
}

//----------------------------------
// ฟังก์ชันสำหรับดึงข้อมูลปุ๋ยจาก Google Sheets
async function fetchFertilizerData() {
    const SHEET_ID = '13LCdzrWExvsiHEcH9Uo_TpzW5qYjB4AuMtnND-leB9s';
    const API_KEY = 'AIzaSyB2qLlJsTEjiF56dzNovNm9fdkWMTUYLkQ';
    const range = 'ปุ๋ย!A:D';  // ปรับตามชื่อชีทและช่วงข้อมูลของคุณ
  
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`);
    const data = await response.json();
    
    return data.values.slice(1);  // ตัดแถวหัวข้อออกและส่งคืนข้อมูลที่เหลือ
}

// เพิ่มตัวเลือกปุ๋ยและจัดการการเลือก
fetchFertilizerData().then(data => {
    const selectElement = document.getElementById('formula1');
  
    data.forEach((row, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = row[0];  // ข้อมูลจากคอลัมน์ A
        selectElement.add(option);
    });
  
    selectElement.addEventListener('change', (event) => {
        const selectedIndex = event.target.value;
        const selectedRow = data[selectedIndex];
        
        // กำหนดค่าให้กับช่องอินพุตตามปุ๋ยที่เลือก
        document.getElementById('nitrogen1').value = selectedRow[1];  // ข้อมูลจากคอลัมน์ B
        document.getElementById('phosphorus1').value = selectedRow[2];  // ข้อมูลจากคอลัมน์ C
        document.getElementById('potassium1').value = selectedRow[3];  // ข้อมูลจากคอลัมน์ D
    });
});


//-------------------------------------
// ฟังก์ชันรวมตัวแปรทั้งหมดและคำนวณ
function performCalculation() {
    // ดึงค่าความต้องการของพืช N,P,K กก./ไร่
    var columnB = parseFloat(document.getElementById('NitrogenValue2').textContent);
    var columnC = parseFloat(document.getElementById('phosphorusValue2').textContent);
    var columnD = parseFloat(document.getElementById('potassiumValue2').textContent);

    // ดึงค่า NPK กก./ไร่
    var nitrogenRequirement = parseFloat(document.getElementById('nitrogen').value);
    var phosphorusRequirement = parseFloat(document.getElementById('phosphorus').value);
    var potassiumRequirement = parseFloat(document.getElementById('potassium').value);

    // ดึงเปอร์เซ็นต์ของปุ๋ยที่ใช้
    var nitrogen1 = parseFloat(document.getElementById('nitrogen1').value);
    var phosphorus1 = parseFloat(document.getElementById('phosphorus1').value);
    var potassium1 = parseFloat(document.getElementById('potassium1').value);

    // คำนวณปริมาณปุ๋ยที่ต้องใช้
    var N_req = columnB - nitrogenRequirement;
    var P_req = columnC - phosphorusRequirement;
    var K_req = columnD - potassiumRequirement;

    var Fertilizer_N = nitrogen1 > 0 ? N_req / (nitrogen1 / 100) : 0;
    var Fertilizer_P = phosphorus1 > 0 ? P_req / (phosphorus1 / 100) : 0;
    var Fertilizer_K = potassium1 > 0 ? K_req / (potassium1 / 100) : 0;

    var Fertilizer_total = Math.max(Fertilizer_N, Fertilizer_P, Fertilizer_K);

    // คำนวณต่อตารางเมตรและต่อต้น
    var squareMeterPerRai = 1600; // 1 ไร่ = 1600 ตารางเมตร
    var fertilizerPerSquareMeter = Fertilizer_total / squareMeterPerRai;

    // สมมติว่าเรามีข้อมูลจำนวนต้นต่อไร่
    var plantsPerRai = parseFloat(document.getElementById('plantsPerRai').value) || 400;
    var fertilizerPerPlant = Fertilizer_total / plantsPerRai;

    // แสดงผลลัพธ์
    var resultElement = document.querySelector('.fertilizer-amount');
    resultElement.innerHTML = `
        
    
            <span>ต่อไร่: ${Fertilizer_total.toFixed(2)} กก./ไร่</span>
            <br>
            <span>ต่อตารางเมตร: ${fertilizerPerSquareMeter.toFixed(2)} กก./ตร.ม.</span>
            <br>
            <span>ต่อต้น: ${fertilizerPerPlant.toFixed(2)} กก./ต้น</span>
        
    `;

    console.log("ปริมาณปุ๋ยที่ต้องใช้:");
    console.log(`ต่อไร่: ${Fertilizer_total.toFixed(2)} กก./ไร่`);
    console.log(`ต่อตารางเมตร: ${fertilizerPerSquareMeter.toFixed(2)} กก./ตร.ม.`);
    console.log(`ต่อต้น: ${fertilizerPerPlant.toFixed(2)} กก./ต้น`);
}

// เพิ่ม event listener ให้กับปุ่มคำนวณ
document.querySelector('.calculate-button').addEventListener('click', performCalculation);