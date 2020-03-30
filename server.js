var fs = require('fs');
var chokidar = require('chokidar');
var _ = require('lodash');
var http = require('http');
var moment = require('moment');

var server = http.createServer((req, res) => {
  var days = [];
  _.reverse(fs.readdirSync('./days')).forEach(file => {
    if (file == '.example') return;

    let json = JSON.parse(fs.readFileSync('./days/' + file + '/json.json').toString('utf8'));

    days.push({
      date: file,
      ...json
    });
  });

  if (req.url.startsWith('/images')) {
    let img = fs.readFileSync('.' + req.url);
    res.writeHead(200, {'Content-Type': 'image/jpg'});
    return res.end(img, 'binary');
  }

  if (req.url == '/motivation') {
    let files = fs.readdirSync('./images');

    return res.end(`
      <!DOCTYPE html>
      <html lang="en" style="height: 100%">
      <head>
        <meta charset="UTF-8">
        <title>Motivation</title>
      </head>
      <body style="height: 100%; width: 100%; margin: 0;">
      
      <video id="video" autoplay style="height: 30%; width: 100%; background: black"></video>
      
      <div id="image" style="height: 35%; background-color: black; background-size: contain; background-repeat: no-repeat; background-position: center;"></div>      
      <div style="height: 20%;">
        <div id="circles" style="width: 100%; overflow: hidden; margin-bottom: 20px;"></div>
        <div style="font-size: 24px; width: 100%;">
          <div style="overflow: hidden">
            <div style="float: left; margin-left: 2px;">Часов:</div> 
            <div style="float: right; font-weight: bold; margin-right: 5px;" id="hours"></div> 
          </div>
          <div style="overflow: hidden">
            <div style="float: left; margin-left: 2px;" >Дней:</div>
            <div style="float: right; font-weight: bold; margin-right: 5px;" id="days"></div> 
          </div>
          <div style="overflow: hidden">
            <div style="float: left; margin-left: 2px;">Гексов:</div>
            <div style="float: right; font-weight: bold; margin-right: 5px;" id="gexes"></div> 
          </div>
          <div style="overflow: hidden">
            <div style="float: left; margin-left: 2px;">Лет:</div>
            <div style="float: right; font-weight: bold; margin-right: 5px" id="years"></div> 
          </div>
        </div>
      </div>
      
      <hr>
      <div style="overflow: hidden; font-size: 28px;">
        <div style="float: left; width: 25%;">
          <div>- Ничего не получится</div>
          <div>- Смакование результата</div>
          <div>- Возмедзие Паше</div>
          <div>- Потрогать лицо</div>
          <div>- Опустить руку</div>
          <div>- Открыть ютюб</div>
          <div>- Проверить валюты</div>
          <div>- Посмотреть корону</div>
          <div>- Пересесть на стул</div>
          <div>- Съесть что-либо</div>         
        </div>
        <div style="float: left; width: 25%;">
          <div>- Раздражение на боба</div>
          <div>- Иду в компайлер</div>
          <div>- Уменьшение фокуса</div>
          <div>- Поковырять нос</div>
          <div>- Сходить в туалет</div>
          <div>- Бросаю фокус на пол</div>
          <div>- Не до результата</div>
          <div>- Частичное движение</div>
          <div>- Движение по инерции</div>
          <div>- Письменная фиксация</div>
          <div>- Избегание тестинга</div>
        </div>
      </div>      
      
      <script>
        navigator.getUserMedia({ video: true }, (stream) => {
          window.video.srcObject = stream;
        }, () => console.log('error'));
      </script>
      
      <script>
        let files = ${JSON.stringify(files)};
        let next = files[Math.floor(Math.random() * files.length)];
        window.image.style.backgroundImage = 'url(/images/' + next + ')';
        console.log(next);
          
        setTimeout(() => location.reload(), 1000 * 60 * 8);

        let left = 0;        
        for (let i = new Date(1991, 7, 31); i < new Date(2045, 7, 31); i.setDate(i.getDate() + 6)) {
          let circle = document.createElement('div');
          if (i < new Date()) circle.style.background = 'black';
          if (i >= new Date()) {
            circle.style.background = 'white';
            left += 6;
          }
          circle.style.float = 'left';
          circle.style.border = '1px solid black';
          circle.style.margin = '2px';
          circle.style.height = '6px';
          circle.style.width = '6px';
          circle.style.borderRadius = '50%';
          window.circles.appendChild(circle);
        }
        
        window.hours.innerHTML = left * 24;
        window.days.innerHTML = left;
        window.gexes.innerHTML = Math.ceil(left / 6);
        window.years.innerHTML = Math.ceil(left / 365);
      </script>
      
      </body>
      </html>
    `);
  }


  if (req.url == '/stats') {
    return res.end(`
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Метрики</title>
        <style>
          table {
            border-collapse: collapse;
          }
          td, th {
            border: 1px solid #00000018;
            padding: 5px;
          }
          tr:hover {
            background: lightblue;
            cursor: default;          
          }  
        </style>
      </head>
      
      <body style="font-family: monospace">
        <div style="position: fixed; margin-right: 7px; background: gray; color: white; width: calc(100% - 16px)">
          <div style="overflow: hidden; width: 100%">
            <div style="width: calc(100% / 8); float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Date</div>
            <div style="width: calc(100% / 8); float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Notes</div>
            <div style="width: calc(100% / 8); float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Fasting</div>
            
            <div style="width: calc(100% / 8); float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Sleep start</div>
            <div style="width: calc(100% / 8); float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Sleep end</div>
            <div style="width: calc(100% / 8); float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Actual sleep</div>
            <div style="width: calc(100% / 8); float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Sleepiness</div>
            
            <div style="width: calc(100% / 8); float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Sport Level</div>
          </div>
        </div>
        
        <table style="width: 100%">
          <tr>
            <td style="height: 14px"></td>
          </tr>
          ${_.map(days, day => {
            let sprints = _.every(day.sprints, sprint => sprint !== null);
            let color = sprints && day.diet.success && day.sport.success ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';

            let actual_sleep = null;
            if (day.sleep.start && day.sleep.end && day.sleep.falling && day.sleep.awake) {
              let minutes_start = parseInt(day.sleep.start.split(':')[0]) * 60 + parseInt(day.sleep.start.split(':')[1]);
              let minutes_end = parseInt(day.sleep.end.split(':')[0]) * 60 + parseInt(day.sleep.end.split(':')[1]);
              let minutes_falling = parseInt(day.sleep.falling.split(':')[0]) * 60 + parseInt(day.sleep.falling.split(':')[1]);
              let minutes_awake = parseInt(day.sleep.awake.split(':')[0]) * 60 + parseInt(day.sleep.awake.split(':')[1]);
              if (minutes_end - minutes_start < 0) minutes_end += 24 * 60;
              let duration  = minutes_end - minutes_start - minutes_falling - minutes_awake;
              let actual_hours = (Math.floor(duration / 60) + '').length == 1 ? '0' + Math.floor(duration / 60) : Math.floor(duration / 60);
              let actual_minutes = ((duration % 60) + '').length == 1 ? '0' + (duration % 60) : duration % 60;
              actual_sleep = actual_hours + ':' + actual_minutes;
            }
                  
            return `
              <tr 
                onclick="window['modal-${day.date}'].style.display = 'flex';" 
                style="background: ${color}"
              >
                <td style="width: calc(100% / 8)">
                  ${day.date}
                  <div 
                    id="modal-${day.date}" 
                    style="position: fixed; background: rgba(0, 0, 0, 0.8); top: 0; left: 0; right: 0; bottom: 0; display: none;"
                    onclick="if (event.target == event.currentTarget) {event.currentTarget.style.display = 'none'; event.stopPropagation(); }"
                  >
                    <div style="height: 80%; width: 80%; background: white; border: 1px solid black; margin: auto; padding: 20px;">
                      <h1 style="text-align: center">${day.date}</h1>
                      <table style="width: 100%">
                        <tr>
                          <td style="width: 50%">Notes</td>
                          <td style="width: 50%">${day.work.notes == null ? '-' : day.work.notes}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">OS</td>
                          <td style="width: 50%">${day.os && day.os.length ? _.map(day.os, ach => `<div>- ${ach}</div>`).join('') : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Motivation</td>
                          <td style="width: 50%">${day.motivation && day.motivation.length ? _.map(day.motivation, ach => `<div>- ${ach}</div>`).join('') : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Pills</td>
                          <td style="width: 50%">${day.pills ? _.map(day.pills, (amount, pill) => `<div>- ${pill} (${amount})</div>`).join('') : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Diet.success</td>
                          <td style="width: 50%">${typeof day.diet.success == 'boolean' ? day.diet.success : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Diet.fasting</td>
                          <td style="width: 50%">${typeof day.diet.fasting == 'boolean' ? day.diet.fasting : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Sport.success</td>
                          <td style="width: 50%">${typeof day.sport.success == 'boolean' ? day.sport.success : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Sport.time</td>
                          <td style="width: 50%">${day.sport.time ? day.sport.time : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Sport.level</td>
                          <td style="width: 50%">${day.sport.level ? day.sport.level : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Sleep.start</td>
                          <td style="width: 50%">${day.sleep.start ? day.sleep.start : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Sleep.end</td>
                          <td style="width: 50%">${day.sleep.end ? day.sleep.end : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Sleep.falling</td>
                          <td style="width: 50%">${day.sleep.falling ? day.sleep.falling : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Sleep.awake</td>
                          <td style="width: 50%">${day.sleep.awake ? day.sleep.awake : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Sleep.sleepiness</td>
                          <td style="width: 50%">${day.sleep.sleepiness ? day.sleep.sleepiness : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Stretching</td>
                          <td style="width: 50%">${typeof day.stretching == 'boolean' ? day.stretching : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Drills</td>
                          <td style="width: 50%">${day.drills && day.drills.length ? _.map(day.drills, drill => `<div>- ${drill}</div>`).join('') : '-'}</td>
                        </tr>
                        <tr>
                          <td style="width: 50%">Comment</td>
                          <td style="width: 50%">${day.comment ? day.comment : '-'}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </td>
                <td style="width: calc(100% / 8)">${day.work.notes == null ? '-' : day.work.notes}</td>
                <td style="width: calc(100% / 8)">${day.diet.fasting == null ? '-' : day.diet.fasting}</td>
                
                <td style="width: calc(100% / 8);">${day.sleep.start == null ? '-' : day.sleep.start}</td>
                <td style="width: calc(100% / 8);">${day.sleep.end == null ? '-' : day.sleep.end}</td>
                <td style="width: calc(100% / 8);">${actual_sleep == null ? '-' : actual_sleep}</td>
                <td style="width: calc(100% / 8);">${day.sleep.sleepiness == null ? '-' : day.sleep.sleepiness}</td>
                
                <td style="width: calc(100% / 8);">${day.sport.level == null ? '-' : day.sport.level}</td>
              </tr>`
          }).join('\n')}
        </table>
      </body>
    </html>
    `);
  }

  res.end('wrong url');
});

server.listen(8888, () => console.log('listening'));


// if (req.url == '/sleep') {
//   return res.end(`
//       <!DOCTYPE html>
//       <html lang="en" style="height: 100%">
//         <head>
//           <meta charset="UTF-8">
//           <title>Сон</title>
//         </head>
//         <style>
//           table {
//             border-collapse: collapse;
//           }
//           td, th {
//             border: 1px solid black;
//             padding: 5px;
//           }
//           tr:hover {
//             background: lightblue;
//             cursor: default;
//           }
//         </style>
//         <body style="height: 100%; width: 100%; margin: 8px;">
//           <table style="width: 6580px">
//             ${_.map([1], day => {
//     // if (day.sleep.length == 0 || day.sleep.length == 1) return null;
//
//     let sleep_start = 21;
//     let sleep_end = 140;
//     let clicks = ['2020:03:21 00:21:00', '2020:03:21 03:00:00', '2020:03:21 11:00:00'];
//
//     return `
//                 <tr>
//                   <td>${day}</td>
//                   <td style="overflow: hidden; white-space: nowrap">
//                     ${_.map(_.range(0, 1440, 10), section => {
//       let section_start = section;
//       let section_end = section_start + 10;
//
//       let color;
//       if (section_start >= sleep_start && section_end < sleep_end) {
//         let awake = _.find(clicks, click => {
//           let time = click.split(' ')[1];
//           let hours = parseInt(time.split(':')[0]);
//           let minutes = parseInt(time.split(':')[1]);
//           let click_minutes = hours * 60 + minutes;
//
//           return click_minutes >= section_start && click_minutes < section_end;
//         });
//         color = awake ? 'red' : 'green';
//       } else color = 'white';
//
//       let section_hh = Math.floor(section / 60) + '';
//       section_hh = section_hh.length == '1' ? '0' + section_hh : section_hh;
//
//       let section_mm = Math.floor(section % 60) + '';
//       section_mm = section_mm.length == '1' ? '0' + section_mm : section_mm;
//
//       return (`
//                         <span style="float: left; background: ${color}; border: 1px solid black; padding: 4px; margin-right: -1px;">
//                           ${section_hh + ':' + section_mm}
//                         </span>
//                       `)
//     }).join('')}
//                   </td>
//                 </tr>
//               `;
//   }).join('')}
//           </table>
//         </body>
//       </html>
//     `);
// }