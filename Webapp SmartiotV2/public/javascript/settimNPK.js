// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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

document.addEventListener('DOMContentLoaded', (event) => {
    const scheduleRef = ref(db, 'AutoTimeNPK/schedule');
    
    // Listen for changes in the schedule data
    onValue(scheduleRef, (snapshot) => {
        const data = snapshot.val();
        updateScheduleTable(data);
    });

    // Function to update the schedule table
    function updateScheduleTable(data) {
        const tableBody = document.getElementById('schedule-table-body');
        tableBody.innerHTML = ''; // Clear existing rows

        for (let date in data) {
            const times = data[date].times;
            times.forEach((timeData, index) => {
                const row = tableBody.insertRow();
                
                row.insertCell(0).textContent = date;
                row.insertCell(1).textContent = timeData.time;
                row.insertCell(2).textContent = timeData.duration;
                
                const deleteCell = row.insertCell(3);
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '🗑️';
                deleteButton.className = 'btn btn-danger btn-sm';
                deleteButton.onclick = () => deleteSchedule(date, index);
                deleteCell.appendChild(deleteButton);
            });
        }
    }

    // Function to delete a schedule
    function deleteSchedule(date, index) {
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณไม่สามารถย้อนกลับการกระทำนี้ได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                const scheduleRef = ref(db, `AutoTimeNPK/schedule/${date}/times/${index}`);
                remove(scheduleRef).then(() => {
                    Swal.fire(
                        'ลบแล้ว!',
                        'ตารางเวลาถูกลบเรียบร้อยแล้ว',
                        'success'
                    );
                }).catch((error) => {
                    Swal.fire(
                        'เกิดข้อผิดพลาด!',
                        'ไม่สามารถลบตารางเวลาได้',
                        'error'
                    );
                    console.error("Error removing schedule: ", error);
                });
            }
        });
    }

    // Save button event listener
    document.querySelector('#save-button').addEventListener('click', function() {
        let date = document.querySelector('#date-input').value;
        let time = document.querySelector('#time-input').value;
        let duration = document.querySelector('#duration-input').value;

        // ตรวจสอบว่า duration เป็นตัวเลขที่ถูกต้อง
    let durationNumber = parseInt(duration);

        if (date && time && duration) {
            let scheduleRef = ref(db, 'AutoTimeNPK/schedule/' + date + '/times');
            
            // Get current times array or create a new one
            onValue(scheduleRef, (snapshot) => {
                let times = snapshot.val() || [];
                 times.push({time: time, duration: durationNumber});  // บันทึก duration เป็นตัวเลข
                
                // Set the updated times array
                set(scheduleRef, times).then(() => {
                    Swal.fire(
                        'สำเร็จ!',
                        'บันทึกข้อมูลเรียบร้อยแล้ว',
                        'success'
                    );
                    // Clear form inputs
                    document.querySelector('#date-input').value = '';
                    document.querySelector('#time-input').value = '';
                    document.querySelector('#duration-input').value = '';
                }).catch((error) => {
                    Swal.fire(
                        'เกิดข้อผิดพลาด!',
                        'ไม่สามารถบันทึกข้อมูลได้',
                        'error'
                    );
                    console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล: ", error);
                });
            }, {
                onlyOnce: true
            });
        } else {
            Swal.fire(
                'ข้อมูลไม่ครบถ้วน!',
                'กรุณากรอกข้อมูลให้ครบถ้วน',
                'warning'
            );
        }
    });
});