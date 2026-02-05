const styles = theme => ({
  modal: {
    position: 'fixed',
    width: '500px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  cancelBtn: {
    backgroundColor: 'white',
    borderColor: 'black',
    border: '1px solid',
    height: '26px',
    textTransform: 'capitalize',
  },
  saveBtn: {
    height: '26px',
    textTransform: 'capitalize',
  },
  addObjectiveHeading: {
    fontSize: '18',
    color: '#0A51A0',
    letterSpacing: 3
  },
  errorLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'red',
  },
  moveableBox: {
    display: 'flex',
    height: '25px',
    minWidth: '120px',
    maxWidth: '220px',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '1px solid #404040',
    borderRadius: '5px',
    padding: '5px',
    margin: '10px'
  },
  moveableBoxText: {
    fontSize: 13,
    fontWeight: 400
  },
  moveableBoxIcon: {
    height: '18px',
    width: '18px',
    margin: '3px',
    cursor: 'pointer'
  },
});

export default styles;