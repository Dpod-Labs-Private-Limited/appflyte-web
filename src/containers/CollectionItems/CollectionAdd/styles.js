const styles = {
  breadButtonsBox: {
    zIndex: 1100,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  publishBtn: {
    textTransform: 'capitalize',
    width: '100px',
    height: '35px',
    backgroundColor: '#000000',
    color: "#ffffff",
    borderRadius: "20px"
  },
  cancelBtn: {
    textTransform: 'capitalize',
    width: '100px',
    height: '35px',
    backgroundColor: '#DEDEDE',
    borderRadius: "20px",
    borderColor: '#ffffff',
    color: '#000000'
  },
  saveBtn: {
    textTransform: 'capitalize',
    width: '100px',
    height: '35px',
    backgroundColor: '#0B51C5',
    borderRadius: "20px"
  },
  searchBar: {
    backgroundColor: '#EBEFF3'
  },
  tableRootPaper: {
    border: '1px solid',
    borderColor: '#dedede',
  },
  createCollectionTypeBtn: {
    textTransform: 'capitalize',
  },
  refreshBtnBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  refreshIcon: {
    cursor: 'pointer',
    margin: '15px'
  },
  loadingIcon: {
    margin: '15px'
  },
  cloneBtn: {
    cursor: "pointer",
    margin: "15px",
    display: "flex",
    alignItems: "center"
  },
  deleteText: {
    fontSize: 14,
    fontWeight: 400,
    color: '#FA6401',
    marginLeft: '5px'
  },
  borderBox: {
    border: '1px solid black'
  },
  smallBold: {
    fontSize: 14,
    fontWeight: 700,
    color: '#404040'
  },
  smallLight: {
    fontSize: 14,
    fontWeight: 400,
    color: '#404040'
  },
  paper: {
    padding: '25px',
    backgroundColor: '#FFFFFF'
  },
  breadCrumbBold: {
    fontSize: 15,
    fontWeight: 600,
    textTransform: 'capitalize',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: "underline"
    }
  },
  breadCrumbNormal: {
    fontSize: 15,
    fontWeight: 400,
  },
}
export default styles;