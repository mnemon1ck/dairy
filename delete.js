var day = {
  sleep: {
    start: "12:00",
    end: "11:00",
    falling: "00:00",
    awake:  "00:00"
  }
};


let actual_sleep = null;
let minutes_start = parseInt(day.sleep.start.split(':')[0]) * 60 + parseInt(day.sleep.start.split(':')[1]);
let minutes_end = parseInt(day.sleep.end.split(':')[0]) * 60 + parseInt(day.sleep.end.split(':')[1]);
let minutes_falling = parseInt(day.sleep.falling.split(':')[0]) * 60 + parseInt(day.sleep.falling.split(':')[1]);
let minutes_awake = parseInt(day.sleep.awake.split(':')[0]) * 60 + parseInt(day.sleep.awake.split(':')[1]);
if (minutes_end - minutes_start < 0) minutes_end += 24 * 60;
let duration  = minutes_end - minutes_start - minutes_falling - minutes_awake;

let actual_hours = (Math.floor(duration / 60) + '').length == 1 ? '0' + Math.floor(duration / 60) : Math.floor(duration / 60);
let actual_minutes = ((duration % 60) + '').length == 1 ? '0' + (duration % 60) : duration % 60;
actual_sleep = actual_hours + ':' + actual_minutes;

console.log(actual_sleep);