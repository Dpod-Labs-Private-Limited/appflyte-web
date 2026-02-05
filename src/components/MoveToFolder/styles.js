const folderRowCommon = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '50px',
  cursor: 'pointer',
}
const styles ={
  modal: {
    position: 'fixed',
    width: '500px',
    minHeight: '400px',
    maxHeight: '90%',
    overflow: 'auto',
    backgroundColor:(theme)=> theme.palette.background.paper,
    boxShadow:(theme)=> theme.shadows[5],
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
  folderIcon: {
    height: '28px',
    width: '28px',
  },
  folderName: {
    fontSize: 15,
    fontWeight: 400
  },
  folderRow: {
    ...folderRowCommon
  },
  fileRow: {
    ...folderRowCommon,
    opacity: 0.7
  },
  folderSelected: {
    ...folderRowCommon,
    border: '1px solid #FA6401'
  },
  thumbnail: {
    width: '75px'
  }
};

export default styles;