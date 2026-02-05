const styles = {
  modal: {
    position: 'fixed',
    width: '500px',
    backgroundColor: (theme) => theme.palette.background.paper,
    boxShadow: (theme) => theme.shadows[5],
  },
  cancelBtn: {
    backgroundColor: 'white',
    borderColor: 'black',
    border: '1px solid',
    height: '26px',
    marginRight: '15px',
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
};

export default styles;