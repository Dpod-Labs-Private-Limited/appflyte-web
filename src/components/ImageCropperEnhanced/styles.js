export const styles = {
  cropContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    maxWidth: window.innerHeight,
    maxHeight: window.innerHeight,
    background: '#FFFFFF',
    // top: '50%',
    // left: '50%',
    // transform: 'translate(-50%, -50%)',    
    [(theme) =>theme.breakpoints.up('sm')]: {
      height: 400,
    },
  },
  cropButton: {
    flexShrink: 0,
    marginLeft: 16,
  },
  controls: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    [(theme) =>theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  sliderContainer: {
    display: 'flex',
    flex: '1',
    alignItems: 'center',
    maxWidth: window.innerHeight,
  },
  sliderLabel: {
    [(theme) => theme.breakpoints.down('xs')]: {
      minWidth: 65,
    },
    minWidth: 65
  },
  slider: {
    padding: '22px 0px',
    marginLeft: 16,
    [(theme) =>theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: '0 16px',
    },
  },
  modal: {
    position: 'fixed',
    width: '100%',    
    maxWidth: window.innerHeight,
    maxHeight: window.innerHeight,
    backgroundColor:(theme) => theme.palette.background.paper,
    boxShadow:(theme) => theme.shadows[5],
    padding: '5px'
  },
  cancelBtn: {
    backgroundColor: 'white',
    borderColor: 'black',
    border: '1px solid',
    height: '26px',
    marginRight: '15px',
  },
  saveBtn: {
    height: '26px',
  },
}
