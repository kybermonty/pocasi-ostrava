import React, { Component } from 'react';
import Sockette from 'sockette';
import Moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { weather: {} };

    this.ws = new Sockette('wss://pocasi.grames.cz/wss', {
      onmessage: e => { this.updateData(e.data); },
    });
  }

  updateData(data) {
    data = JSON.parse(data);
    data.updated = Moment(data.updated).format('D.M.YYYY H:mm:ss');
    this.setState(prevState => ({
      weather: data
    }));
  }

  render() {
    if (!this.state.weather.updated) {
      return 'Načítám data o počasí...';
    }
    return (
      <table>
        <tbody>
        <tr>
          <td style={{ width: '40px' }}>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
            </svg>
          </td>
          <td style={{ width: '200px' }}>Stav</td>
          <td>{this.state.weather.state}</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M17,17A5,5 0 0,1 12,22A5,5 0 0,1 7,17C7,15.36 7.79,13.91 9,13V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V13C16.21,13.91 17,15.36 17,17M11,8V14.17C9.83,14.58 9,15.69 9,17A3,3 0 0,0 12,20A3,3 0 0,0 15,17C15,15.69 14.17,14.58 13,14.17V8H11Z" />
            </svg>
          </td>
          <td>Teplota</td>
          <td>{this.state.weather.temperature} °C</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z" />
            </svg>
          </td>
          <td>Rychlost větru</td>
          <td>{this.state.weather.wind} km/h</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z" />
            </svg>
          </td>
          <td>Vlhkost</td>
          <td>{this.state.weather.humidity} %</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M17,3H21V5H17V3M17,7H21V9H17V7M17,11H21V13H17.75L17,12.1V11M21,15V17H19C19,16.31 18.9,15.63 18.71,15H21M17,17A5,5 0 0,1 12,22A5,5 0 0,1 7,17C7,15.36 7.79,13.91 9,13V5A3,3 0 0,1 12,2A3,3 0 0,1 15,5V13C16.21,13.91 17,15.36 17,17M11,8V14.17C9.83,14.58 9,15.69 9,17A3,3 0 0,0 12,20A3,3 0 0,0 15,17C15,15.69 14.17,14.58 13,14.17V8H11M7,3V5H3V3H7M7,7V9H3V7H7M7,11V12.1L6.25,13H3V11H7M3,15H5.29C5.1,15.63 5,16.31 5,17H3V15Z" />
            </svg>
          </td>
          <td>Tlak</td>
          <td>{this.state.weather.pressure} hPa</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M11,23A2,2 0 0,1 9,21V19H15V21A2,2 0 0,1 13,23H11M12,1C12.71,1 13.39,1.09 14.05,1.26C15.22,2.83 16,5.71 16,9C16,11.28 15.62,13.37 15,16A2,2 0 0,1 13,18H11A2,2 0 0,1 9,16C8.38,13.37 8,11.28 8,9C8,5.71 8.78,2.83 9.95,1.26C10.61,1.09 11.29,1 12,1M20,8C20,11.18 18.15,15.92 15.46,17.21C16.41,15.39 17,11.83 17,9C17,6.17 16.41,3.61 15.46,1.79C18.15,3.08 20,4.82 20,8M4,8C4,4.82 5.85,3.08 8.54,1.79C7.59,3.61 7,6.17 7,9C7,11.83 7.59,15.39 8.54,17.21C5.85,15.92 4,11.18 4,8Z" />
            </svg>
          </td>
          <td>Kvalita ovzduší</td>
          <td>{this.state.weather.quality}</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
            </svg>
          </td>
          <td>Výstraha</td>
          <td>{this.state.weather.warning||'-'}</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M7,10H12V15H7M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />
            </svg>
          </td>
          <td colSpan="2">Před­pověď - dnes</td>
        </tr>
        <tr>
          <td colSpan="3">{this.state.weather.forecastToday}</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
            </svg>
          </td>
          <td colSpan="2">Před­pověď - zítra</td>
        </tr>
        <tr>
          <td colSpan="3">{this.state.weather.forecastTomorrow||'-'}</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z" />
            </svg>
          </td>
          <td>Východ slunce</td>
          <td>{this.state.weather.sunrise}</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,20.71L15.82,17.6C16.21,17.21 16.21,16.57 15.82,16.18C15.43,15.79 14.8,15.79 14.41,16.18L12,18.59L9.59,16.18C9.2,15.79 8.57,15.79 8.18,16.18C7.79,16.57 7.79,17.21 8.18,17.6L11.29,20.71C11.5,20.9 11.74,21 12,21C12.26,21 12.5,20.9 12.71,20.71Z" />
            </svg>
          </td>
          <td>Západ slunce</td>
          <td>{this.state.weather.sunset}</td>
        </tr>
        <tr>
          <td>
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="#44739e" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
            </svg>
          </td>
          <td>Poslední aktualizace</td>
          <td>{this.state.weather.updated}</td>
        </tr>
        </tbody>
      </table>
    );
  }
}

export default App;
