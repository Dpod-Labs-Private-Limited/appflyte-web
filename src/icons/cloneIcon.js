import React from 'react';
import { SvgIcon } from '@mui/material';

const CloneOutline = (props) => {
    return (
      <SvgIcon height="24px" viewBox="0 0 24 24" width="24px" fill="#000000" {...props}>
      	<path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </SvgIcon>
    );
  }

  const deletebtn = (props) => {
    return (
      <SvgIcon height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
      	< path d = "M0 0h24v24H0V0z"fill = "none" /> < path d = "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/>
      </SvgIcon>
    );
  }

  export default CloneOutline;