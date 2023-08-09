let increment = 30; // 360/12

for (let i = 0; i < 12; i++) {
  let w = i * increment;
  let hours = document.querySelectorAll(".hours");
  hours[i].style.transform = `rotate(${w}deg)`;
}

let timing = setInterval(() => {
  let arms = document.querySelectorAll(".arms");

  let date = new Date();
  let sec = date.getSeconds();
  let min = date.getMinutes();
    let hour = date.getHours();
    let secDeg = sec * 6;
    let minDeg = min * 6
    let hourDeg = (hour * 30) + (min / 60) * 30;
    arms[0].style.transform = `rotateZ(${hourDeg}deg)`;
    arms[1].style.transform = `rotateZ(${minDeg}deg)`;
    arms[2].style.transform = `rotateZ(${secDeg}deg)`;
    
}, 1000);
