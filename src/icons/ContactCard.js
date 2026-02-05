import React from 'react';
import { SvgIcon } from '@mui/material';

const ContactIcon = (props) => {
    return (
		<SvgIcon viewBox="0 0 24 24" width="35" height="35" style={{width: "30px" , height : "30px"}}>
			<path id="Layer" fill="none" class="shp0" d="M0 0L24 0L24 24L0 24L0 0Z" />
			<path id="Layer" fill="#0091ff" fill-rule="evenodd" class="shp1" d="M5 3L19 3C20.1 3 21 3.9 21 5L21 19C21 20.1 20.1 21 19 21L5 21C3.89 21 3 20.1 3 19L3 5C3 3.9 3.89 3 5 3ZM12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 6 12 6ZM6 18L18 18L18 17C18 15 14 13.9 12 13.9C10 13.9 6 15 6 17L6 18Z" />
		</SvgIcon>
    );
  }

  export default ContactIcon;