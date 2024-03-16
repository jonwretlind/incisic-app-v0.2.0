
import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    primary: {
      light: '#4f83cc',
      main: '#01579b',
      dark: '#002f6c',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffc046',
      main: '#ff8f00',
      dark: '#c56000',
      contrastText: '#f5f5f5',
    },
  },
});

export default Theme
