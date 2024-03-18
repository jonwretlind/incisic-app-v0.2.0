import logo from './img/cropped-RGB_Incisic_Final.png';
import './App.css';
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import HomeIcon from '@mui/icons-material/esm/Home';
import UserIcon from '@mui/icons-material/esm/PersonOutline';
import AppWindow from './AppWindow';
import { ThemeProvider } from '@mui/material/styles';
import Theme from './helpers/theme';

function App() {
  return (
    <ThemeProvider theme={Theme}>
    <div className="App">
      <header className="App-header">
        <div className="col1">
          <HomeIcon />
          <UserIcon />
        </div>
        <div className="col2">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Financial Well-Being Through Sound Instruction
          </p>
        </div>
      </header>
      <AppWindow />
    </div>
    </ThemeProvider>
  );
}
export default hot(App);
