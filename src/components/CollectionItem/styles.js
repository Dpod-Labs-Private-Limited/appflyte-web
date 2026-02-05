const languageChipCommom = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  textOverflow: "ellipsis",
  whiteSpace: 'nowrap',
  height: '25px',
  width: '60px',
  fontSize: 12,
  fontWeight: 400,
  cursor: "pointer",
  borderRadius: 5,
  padding: '5px',
  marginRight: '10px',
  marginBottom: '10px'
}
const styles = {
  photoSelector: {
    height: '125px',
    width: '250px',
    backgroundColor: '#F5F5F5',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  photoIcon: {
    height: '32px',
    width: '32px'
  },
  radioLabelText: {
    fontSize: 15,
    fontWeight: 500
  },
  fieldSetSingleBoxContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    border: '2px solid #EBEFF3',
    borderRadius: '5px',
    padding: '10px',
    margin: '10px 0px'
  },
  fieldSetSingleBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: '70px',
    maxHeight: '100px',
    flexWrap: 'nowrap',
    padding: '10px',
    margin: '10px 0px'
  },
  fieldSetText: {
    fontSize: 15,
    fontWeight: 400,
    margin: '15px'
  },
  fieldSetNestedBox: {
    width: '100%',
    border: '2px solid #EBEFF3',
    borderRadius: '5px',
    padding: '22px',
    margin: '10px 0px'

  },
  arrowIcon: {
    height: '24px',
    width: '24px',
    marginRight: '15px'
  },
  deleteIcon: {
    height: '24px',
    width: '24px',
  },
  inputHidden: {
    display: 'none',
  },
  addIcon: {
    cursor: 'pointer',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  errorLabel: {
    fontSize: 12,
    color: 'red',
  },
  closeIcon: {
    height: '24px',
    width: '24px',
    cursor: 'pointer',
    marginLeft: '15px'
  },
  languageChipCoxSelected: {
    ...languageChipCommom,
    backgroundColor: '#FA6401',
    color: '#FFFFFF',
  },
  languageChipCox: {
    ...languageChipCommom,
    backgroundColor: '#FFFFFF',
    border: '1px solid #FA6401',
    color: '#FA6401',
  },
  multiSelectCustomRoot: {
    border: '1px solid #EBEFF3',
    width: '250px',
    minHeight: '250px',
    maxHeight: '450px',
    overflow: 'auto',
    padding: '15px'
  },
  multiSelectCustomItem: {
    width: '100%',
    height: '50px',
    padding: '10px',
    backgroundColor: 'white',
    cursor: "pointer",
    "&:hover": {
      backgroundColor: '#EBEFF3', 
    }
  },
  multiSelectCustomItemSelected: {
    width: '100%',
    height: '50px',
    padding: '10px',
    backgroundColor: '#EBEFF3',
    cursor: "pointer"
  },
  menuText: {
    fontSize: 14,
    fontWeight: 500
  },
  mediumLabel: {
    fontSize: 14,
  }
}
export default styles;