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
        <title>Carousel</title>
      </head>
      <body style="height: 100%; width: 100%; margin: 0;">
      
      <div style="overflow: hidden; width: 100%; height: 100%">
        <div style="width: 20%; height: 100%; float: left;">
          <div id="circles" style="width: 100%; overflow: hidden"></div>
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
        
        <div id="image" style="float: left; width: 80%; height: 100%; background-color: black; background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
      </div>
      
      <script>
        let files = ${JSON.stringify(files)};
        tick();
        setInterval(tick, 60 * 1000 * 10);

        function tick() {
          let next = files[Math.floor(Math.random() * files.length)];
          window.image.style.backgroundImage = 'url(/images/' + next + ')';
          console.log(next);
        }

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
          circle.style.height = '4px';
          circle.style.width = '4px';
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
            <div style="width: 12.5%; float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Date</div>
            <div style="width: 12.5%; float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Notes</div>
            <div style="width: 12.5%; float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Fasting</div>
            
            <div style="width: 12.5%; float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Sleep start</div>
            <div style="width: 12.5%; float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Sleep end</div>
            <div style="width: 12.5%; float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Sleepiness</div>
            
            <div style="width: 12.5%; float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Sport time</div>
            <div style="width: 12.5%; float: left; padding: 5px; border-left: 1px solid black; box-sizing: border-box;">Sport Level</div>
          </div>
        </div>
        
        <table style="width: 100%">
          <tr>
            <td style="height: 14px"></td>
          </tr>
          ${_.map(days, day => {
            let color = day.work.success && day.diet.success && day.sport.success ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
            
            return `
              <tr style="background: ${color}">
                <td style="width: 12.5%">${day.date}</td>
                <td style="width: 12.5%">${_.sumBy(day.sessions, session => session.notes)}</td>
                <td style="width: 12.5%">${day.diet.fasting == null ? '-' : day.diet.fasting}</td>
                
                <td style="width: 12.5%;">${day.sleep.start == null ? '-' : day.sleep.start}</td>
                <td style="width: 12.5%;">${day.sleep.end == null ? '-' : day.sleep.end}</td>
                <td style="width: 12.5%;">${day.sleep.sleepiness == null ? '-' : day.sleep.sleepiness}</td>
                
                <td style="width: 12.5%;">${day.sport.time == null ? '-' : day.sport.time}</td>
                <td style="width: 12.5%;">${day.sport.level == null ? '-' : day.sport.level}</td>
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