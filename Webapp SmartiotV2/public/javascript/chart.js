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

      /*
Axis line breaks at tick positions.
Learn how to:

  - Apply gaps to circular axis lines.
  - Inverted axis line breaks.
*/
      // JS
      const humidityRef = ref(db, 'DTHsensor/humidity');
      const moistureRef = ref(db, 'DTHsensor/moisture');
      const temperatureRef = ref(db, 'DTHsensor/temperature');

      // ตั้งค่า listener สำหรับการอัปเดตค่า
onValue(moistureRef, (snapshot) => {
    const moisture = snapshot.val();
    console.log(moisture);
  
    // อัปเดตค่าใน chart
    chart1.series(0).points(0).options({ y: moisture }, true);
  });

  onValue(humidityRef, (snapshot) => {
    const humidity = snapshot.val();
    console.log(humidity);
  
    // อัปเดตค่าใน chart
    chart2.series(0).points(0).options({ y: humidity }, true);
  });


  onValue(temperatureRef, (snapshot) => {
    const temperature = snapshot.val();
    console.log(temperature);
  
    // อัปเดตค่าใน chart
    chart3.series(0).points(0).options({ y: temperature }, true);
  });




//-------------- Chart 1
      var chart1 = JSC.chart('chartDiv', {
        debug: true,
        title: {
          label_text: '',
          position: 'center'
        },
        legend_visible: false,
        palette: ['#2AE20E'],
        defaultSeries: {
          type: 'gauge column ',
          shape_label: [
            {
              text: '%name',
              style_fontSize: 15,
              verticalAlign: 'bottom'
            },
            { style_fontSize: 20, verticalAlign: 'middle' }
          ]
        },
        defaultAxis: {
          defaultTick_padding: 10,
          line: { color: '#05FF48', width: 7 }
        },
        xAxis: { spacingPercentage: 0.2 },
        yAxis: [
          {
            line: {
              /*If defined, breaks will be used at tick positions.*/
              breaks_gap: 0.05
            },

            /*Pull labels inside axis line gaps.*/
            defaultTick_padding: -5,
            scale: { range: [0, 100], interval: 10 }
          }
        ],
        series: [
          {
            name: 'ความชื้นในดิน',
            shape_label: [{}, { text: '%sum %' }],
            points: [['value', 0]]
          }
        ]
      });

      //-------------Chart 2

      var chart2 = JSC.chart('chartDiv2', {
        debug: true,
        title: {
          label_text: '',
          position: 'center'
        },
        legend_visible: false,
        palette: ['#0000CD'],
        defaultSeries: {
          type: 'gauge column ',
          shape_label: [
            {
              text: '%name',
              style_fontSize: 15,
              verticalAlign: 'bottom'
            },
            { style_fontSize: 20, verticalAlign: 'middle' }
          ]
        },
        defaultAxis: {
          defaultTick_padding: 10,
          line: { color: '#0000CD', width: 7 }
        },
        xAxis: { spacingPercentage: 0.2 },
        yAxis: [
          {
            line: {
              /*If defined, breaks will be used at tick positions.*/
              breaks_gap: 0.05
            },

            /*Pull labels inside axis line gaps.*/
            defaultTick_padding: -5,
            scale: { range: [0, 100], interval: 10 }
          }
        ],
        series: [
          {
            name: 'ความชื้นสัมพัทธ์',
            shape_label: [{}, { text: '%sum %' }],
            points: [['value', 0]]
          }
        ]
      });

//----------------- Chart 3


var chart3 = JSC.chart('chartDiv3', {
    debug: true,
    title: {
      label_text: '',
      position: 'center'
    },
    legend_visible: false,
    palette: ['#FF7F50'],
    defaultSeries: {
      type: 'gauge column ',
      shape_label: [
        {
          text: '%name',
          style_fontSize: 15,
          verticalAlign: 'bottom'
        },
        { style_fontSize: 20, verticalAlign: 'middle' }
      ]
    },
    defaultAxis: {
      defaultTick_padding: 10,
      line: { color: '#FF7F50', width: 7 }
    },
    xAxis: { spacingPercentage: 0.2 },
    yAxis: [
      {
        line: {
          /*If defined, breaks will be used at tick positions.*/
          breaks_gap: 0.05
        },

        /*Pull labels inside axis line gaps.*/
        defaultTick_padding: -5,
        scale: { range: [0, 100], interval: 10 }
      }
    ],
    series: [
      {
        name: 'อุณหภูมิ',
        shape_label: [{}, { text: '%sum ํC' }],
        points: [['value', 0]]
      }
    ]
  });