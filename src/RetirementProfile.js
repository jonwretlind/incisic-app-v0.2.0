import './RetirementProfile.css';
import * as React from 'react';
import Box from '@mui/material/Box';

function RetirementProfile() {
 // const [value, setValue] = React.useState(0);

  /* const handleChange = (event, newValue) => {
    setValue(newValue);
  }; */

  return (
    <Box sx={{
      flexGrow: 1,
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      component: 'div'
    }}>
      <div className="heading h3">My Retirement</div>
      <div className="detail">
        <div>Name: </div>
        <div>Value</div>
      </div>
   </Box>
 )
}

export default RetirementProfile;
