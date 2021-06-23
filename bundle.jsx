import ReactDOM from 'react-dom';
import React from 'react';
import moment from 'moment';

window.moment = moment;

let styles = {
  header: {
    overflow: 'hidden',
    display: 'block',
    height: '20px',
    borderBottom: '1px solid black',
    position: 'fixed',
    width: '100%',
    background: 'white',
    top: '0',
    zIndex: '1'
  },
  stub: {
    width: '10%',
    height: '100%',
    float: 'left',
    borderRight: '1px solid black',
    boxSizing: 'border-box'
  },
  hour: {
    width: 'calc(100% / 24)',
    float: 'left',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box'
  },
  date_header: {
    width: '10%',
    float: 'left',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    borderRight: '1px solid black',
    boxSizing: 'border-box',
    justifyContent: 'center'
  },
  date: {
    display: 'block',
    height: '40px',
    overflow: 'hidden'
  },
  section: {
    display: 'block',
    height: '100%',
    width: 'calc(100% / 6)',
    float: 'left'
  },
  hours: {
    height: '100%',
    width: '90%',
    float: 'left',
    overflow: 'hidden'
  },
  dates: {
    position: 'relative',
    top: '21px',
    display: 'block',
    borderBottom: '1px solid black'
  }
};

class Main extends React.Component {
  constructor(props) {
    super(props);

    if (localStorage.nights == null) localStorage.nights = JSON.stringify([]);
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      let nights = JSON.parse(localStorage.nights);

      if (event.which == 13) {
        let last_night = nights[nights.length - 1];
        let now = Math.ceil(Math.floor(new Date().getTime() / 1000) / 600) * 600;

        if (last_night && last_night.end == Number.MAX_SAFE_INTEGER) last_night.end = now;
        else nights.push({ start: now, end: Number.MAX_SAFE_INTEGER, clicks: [] });

        localStorage.nights = JSON.stringify(nights);

        render();
      }

      if (event.which == 66) {
        let last_night = nights[nights.length - 1];
        let now = Math.ceil(Math.floor(new Date().getTime() / 1000) / 600) * 600;
        if (last_night && last_night.end == Number.MAX_SAFE_INTEGER) {
          last_night.clicks.push(now);
          localStorage.nights = JSON.stringify(nights);
          render();
        }
      }
    });

    document.addEventListener('keyup', event => {
      if (event.which == 33) this.setState({ left_pressed: false });
      if (event.which == 34) this.setState({ right_pressed: false });
    });

    setInterval(() => render(), 30 * 60);
  }

  render() {
    let dates = [];
    // let calendar_start = round_date(Math.floor((new Date().getTime() / 1000) - 1 * 24 * 60 * 60));
    let calendar_start = round_date(1624335179);
    let tomorrow_start = round_date(Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60);
    for (let date = calendar_start; date < tomorrow_start; date += 24 * 60 * 60) dates.push(date);

    return (
      <sleep-tracker style={{ display: 'block' }}>
        <header style={styles.header}>
          <stub style={styles.stub} />
          <hours style={styles.hours}>
            {
              [...Array(24).keys()].map(i => {
                if (i < 10) i = `0${i}:00`;
                else i = `${i}:00`;

                return (
                  <hour
                    key={i}
                    style={{ ...styles.hour, borderRight: i == '23:00' ? 'none' : '1px solid black' }}
                  >
                    {i}
                  </hour>
                );
              })
            }
          </hours>
        </header>
        <dates style={styles.dates}>
          {dates.map((date, index) => this.render_date(date, index == dates.length - 1))}
        </dates>
      </sleep-tracker>
    );
  }

  render_date = (date, is_last) => {
    let hours = [];
    for (let hour = date; hour < date + 24 * 60 * 60; hour += 60 * 60) hours.push(hour);

    return (
      <date
        key={date}
        style={{
          borderBottom: is_last ? 'none' : '1px solid black',
          ...styles.date
        }}
      >
        <date-header style={styles.date_header}>
          {moment.unix(date).format('DD MMMM YYYY')}
        </date-header>
        <hours style={styles.hours}>
          {hours.map(this.render_hour)}
        </hours>
      </date>
    );
  };

  render_hour = (hour, index) => {
    let sections = [];
    for (let section = hour; section < hour + 60 * 60; section += 10 * 60) sections.push(section);

    return (
      <hour
        key={hour}
        style={{
          borderRight: index == 23 ? 'none' : '1px solid black',
          ...styles.hour
        }}
      >
        {sections.map(this.render_section)}
      </hour>
    );
  };

  render_section = (section, index) => {
    let nights = JSON.parse(localStorage.nights);
    let night = nights.find(_ => section >= _.start && section < _.end);

    let color;
    if (night) {
      // let awake = night.clicks.some(click => click == section);
      let awake = night.clicks.filter(click => click == section).length > 1;
      if (awake) color = 'rgb(255, 96, 48, 0.25)';
      else color = '#ccf3ff';
    } else color = 'white';

    return (
      <section
        key={section}
        onMouseEnter={night ? event => event.currentTarget.style.boxShadow = 'inset 0 0 0 1px red' : null}
        onMouseLeave={night ? event => event.currentTarget.style.boxShadow = null : null}
        onClick={night ? () => {
          let awake = night.clicks.some(click => click == section);

          if (awake) night.clicks = night.clicks.filter(_ => _ !== section);
          else night.clicks.push(section, section);

          localStorage.nights = JSON.stringify(nights);

          render();
        } : null}
        style={{
          background: color,
          borderRight: index == 5 ? 'none' : '1px solid rgb(205, 205, 205)',
          ...styles.section
        }}
      />
    )
  }
}

window.render = () => ReactDOM.render(<Main/>, document.querySelector('root'));
render();


function round_date(millis) {
  let date = new Date(millis * 1000);

  date.setSeconds(0);
  date.setMinutes(0);
  date.setHours(0);

  return date.getTime() / 1000;
}