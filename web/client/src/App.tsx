import * as Moment from 'moment';
import * as React from 'react';
import Sockette from 'sockette';

import { TableDoubleRow } from "./components/Table/doubleRow";
import { TableRow } from "./components/Table/row";
import {
  FORECAST_TODAY_ICON, FORECAST_TOMORROW_ICON, HUMIDITY_ICON, PRESSURE_ICON, QUALITY_ICON,
  STATE_ICON, SUNRISE_ICON, SUNSET_ICON, TEMPERATURE_ICON, UPDATED_ICON, WARNING_ICON, WIND_ICON
} from "./constants";

interface IWeather {
  state: string;
  temperature: string;
  wind: string;
  humidity: string;
  pressure: string;
  quality: string;
  warning: string;
  forecastToday: string;
  forecastTomorrow: string;
  sunrise: string;
  sunset: string;
  updated: string;
}
interface IState {
  ws: any;
  weather: IWeather;
};

class App extends React.Component<any, IState> {
  constructor(props) {
    super(props);
  }

  public componentWillMount() {
    this.setState({
      ws: new Sockette('wss://pocasi.grames.cz/wss', {
        onmessage: e => { this.updateData(e.data); },
      })
    })
  }

  public updateData(data) {
    data = JSON.parse(data);
    data.updated = Moment(data.updated).format('D.M.YYYY H:mm:ss');
    this.setState({
      weather: data
    });
  }

  public render() {
    if (!this.state.weather) {
      return 'Načítám data o počasí...';
    }
    return (
      <table>
        <tbody>
          <TableRow
            title="Stav"
            icon={STATE_ICON}
            value={this.state.weather.state}
          />
          <TableRow
            title="Teplota"
            icon={TEMPERATURE_ICON}
            value={this.state.weather.temperature + ' °C'}
          />
          <TableRow
            title="Rychlost větru"
            icon={WIND_ICON}
            value={this.state.weather.wind + ' km/h'}
          />
          <TableRow
            title="Vlhkost"
            icon={HUMIDITY_ICON}
            value={this.state.weather.humidity + ' %'}
          />
          <TableRow
            title="Tlak"
            icon={PRESSURE_ICON}
            value={this.state.weather.pressure + ' hPa'}
          />
          <TableRow
            title="Kvalita ovzduší"
            icon={QUALITY_ICON}
            value={this.state.weather.quality}
          />
          <TableRow
            title="Výstraha"
            icon={WARNING_ICON}
            value={this.state.weather.warning}
          />
          <TableDoubleRow
            title="Před­pověď - dnes"
            icon={FORECAST_TODAY_ICON}
            value={this.state.weather.forecastToday}
          />
          <TableDoubleRow
            title="Před­pověď - zítra"
            icon={FORECAST_TOMORROW_ICON}
            value={this.state.weather.forecastTomorrow}
          />
          <TableRow
            title="Východ slunce"
            icon={SUNRISE_ICON}
            value={this.state.weather.sunrise}
          />
          <TableRow
            title="Západ slunce"
            icon={SUNSET_ICON}
            value={this.state.weather.sunset}
          />
          <TableRow
            title="Poslední aktualizace"
            icon={UPDATED_ICON}
            value={this.state.weather.updated}
          />
        </tbody>
      </table>
    );
  }
}

export default App;
