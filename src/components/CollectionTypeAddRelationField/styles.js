const relationBoxCommon = {
  width: '48px',
  height: '48px',
  marginRight: '20px',
  marginTop: '20px',
  cursor: 'pointer'
}
const styles = {
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
    marginRight: '15px',
    textTransform: 'capitalize',
  },
  addObjectiveHeading: {
    fontSize: '18',
    color: '#0A51A0',
    letterSpacing: 3
  },
  localHeadBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '35px',
    width: "100%",
    padding: '10px',
    borderRadius: 5,
    backgroundColor: '#DEDEDE',
    marginBottom: '15px',
    marginTop: '20px'
  },
  addCircleIcon: {
    marginRight: '5px',
    height: '24px',
    width: '24px',
    cursor: 'pointer'
  },
  localText: {
    fontSize: 14,
    fontWeight: 500,
    marginLeft: '5px',
  },
  formControl: {
    marginRight: '10px',
    width: '150px',
  },
  fieldTypeText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#404040'
  },
  lightLabel: {
    fontSize: 13,
    fontWeight: 400,
    color: '#404040'
  },
  relationIcon: {
    ...relationBoxCommon,
    color: 'yellow',
  },
  relationIconSelected: {
    ...relationBoxCommon,
    color: (theme) => theme.palette.secondary.main,
  },
  tab: {
    fontSize: 15,
  },
  mediumLabel: {
    fontSize: 14
  }
};

export default styles;