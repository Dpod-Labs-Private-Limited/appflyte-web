/**
 *
 * TextFieldOverridden
 *
 */

import React from 'react';
import { TextField, makeStyles, FilledInput, FormControl, InputLabel } from '@mui/material';
import MuiPhoneNumber from 'material-ui-phone-number';
import ChipInput from 'material-ui-chip-input'
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

const useStylesReddit = {
  root: {
    // border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    transition: (theme) => theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
    '&$focused': {
      backgroundColor: '#F5F5F5',
    },
    "&.MuiInputBase-root.Mui-disabled": {
      backgroundColor: '#F5F5F5',
    },
    "&.MuiFormHelperText-contained": {
      margin: "0px 0px 0px"
    }
  },
  focused: {
    backgroundColor: '#F5F5F5',
  }
};
const useStylesRedditWhite = {
  root: {
    // border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    transition: (theme) => theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#FFFFFF',
    },
    '&$focused': {
      backgroundColor: '#FFFFFF',
    },
    "&.MuiInputBase-root.Mui-disabled": {
      backgroundColor: '#FFFFFF',
    },
    "&.MuiFormHelperText-contained": {
      margin: "0px 0px 0px"
    }
  },
  focused: {
    backgroundColor: '#FFFFFF',
  }
};
const useStylesReddit3 = {
  root: {
    // border: '1px solid #e2e2e1',
    overflow: 'auto',
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    paddingTop: '22px',
    paddingBottom: '10px',
    transition: (theme) => theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
    '&$focused': {
      backgroundColor: '#F5F5F5',
    },
    "&.MuiInputBase-root.Mui-disabled": {
      backgroundColor: '#F5F5F5',
    },
    "&.MuiFormHelperText-contained": {
      margin: "0px 0px 0px"
    }
  },
  // chip: {
  //   backgroundColor : 'red'
  // },
  focused: {
    backgroundColor: '#F5F5F5',
  }
};
const useStylesReddit3White = {
  root: {
    // border: '1px solid #e2e2e1',
    overflow: 'auto',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    paddingTop: '22px',
    paddingBottom: '10px',
    transition: (theme) => theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#FFFFFF',
    },
    '&$focused': {
      backgroundColor: '#FFFFFF',
    },
    "&.MuiInputBase-root.Mui-disabled": {
      backgroundColor: '#FFFFFF',
    },
    "&.MuiFormHelperText-contained": {
      margin: "0px 0px 0px"
    }
  },
  // chip: {
  //   backgroundColor : 'red'
  // },
  focused: {
    backgroundColor: '#FFFFFF',
  }
};
const useStylesReddit2 = {
  helperText: {
    marginLeft: 0,
    paddingLeft: 0,
    marginBottom: 0,
    paddingBottom: 0,
    height: '5px'
  }
};

function TextFieldOverridden(props) {
  const classes = useStylesReddit;
  const classes2 = useStylesReddit2;
  return <TextField
    {...props}
    FormHelperTextProps={{
      className: classes2.helperText
    }}
    InputLabelProps={{
      style: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: '100%',
        paddingRight: '15px'
      }
    }}
    // InputProps={{ classes, disableUnderline: false, ...props.InputProps }} 
    InputProps={{ classes, ...props.InputProps }}
  />;
}
function TextFieldOverriddenWhite(props) {


  const classes = useStylesRedditWhite;
  const classes2 = useStylesReddit2;
  return <TextField
    {...props}
    FormHelperTextProps={{
      className: classes2.helperText
    }}
    InputLabelProps={{
      style: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: '100%',
        paddingRight: '15px'
      }
    }}
    // InputProps={{ classes, disableUnderline: false, ...props.InputProps }} 
    InputProps={{ classes, ...props.InputProps }}
  />;
}

function PhoneNumberFieldOverridden(props) {


  const classes = useStylesReddit;
  const classes2 = useStylesReddit2;

  return <MuiPhoneNumber
    {...props}
    FormHelperTextProps={{
      className: classes2.helperText
    }}
    // InputProps={{ classes, disableUnderline: false, ...props.InputProps }} 
    InputProps={{ classes, ...props.InputProps }}
  />;
}

function chipFieldOverridden(props) {


  const classes = useStylesReddit3;
  const classes2 = useStylesReddit2;

  return <ChipInput
    {...props}
    FormHelperTextProps={{
      className: classes2.helperText
    }}
    // InputProps={{ classes, disableUnderline: false, ...props.InputProps }} 
    InputProps={{ classes, ...props.InputProps }}
  />;
}

function chipFieldOverriddenWhite(props) {

  const classes = useStylesReddit3White;
  const classes2 = useStylesReddit2;

  return <ChipInput
    {...props}
    FormHelperTextProps={{
      className: classes2.helperText
    }}
    // InputProps={{ classes, disableUnderline: false, ...props.InputProps }} 
    InputProps={{ classes, ...props.InputProps }}
  />;
}

TextFieldOverridden.propTypes = {};

export { TextFieldOverridden, PhoneNumberFieldOverridden, chipFieldOverridden, TextFieldOverriddenWhite, chipFieldOverriddenWhite };
