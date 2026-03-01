const styles = {
  mainContainer: {
    width: "100%",
    height: 'calc(100% - 10px)',
    padding: "0px 15px 10px 15px",
    marginBottom: "10px"
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    height: "100%",
    overflowY: "auto",
    padding: '20px'
  },
  breadButtonsBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: "center",
    gap: "10px"
  },
  searchBar: {
    backgroundColor: '#EBEFF3'
  },
  saveDraftBtn: {
    textTransform: 'capitalize',
    height: '30px',
    color: 'white',
    backgroundColor: '#404040',
    borderRadius: '20px',
    width: '100px'
  },
  publishBtn: {
    textTransform: 'capitalize',
    height: '30px',
    borderRadius: '20px',
    backgroundColor: "#0B51C5",
    width: '95px'
  },
  cancelBtn: {
    textTransform: 'capitalize',
    height: '30px',
    width: '85px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px'
  },
  confBtn: {
    height: '30px',
    width: '140px',
    backgroundColor: '#FFFFFF',
    borderRadius: '5px',
  },
  addObjectiveHeading: {
    fontSize: '18',
    color: '#0A51A0',
    letterSpacing: 3
  },
  relavantTherapiesText: {
    fontSize: 15,
    color: '#0A51A0',
    fontWeight: 400,
    marginBottom: '10px',
    letterSpacing: 3
  },
  paper: {
    marginRight: '15px',
    marginLeft: '15px',
    marginBottom: '25px',
    border: '1px solid',
    borderColor: '#dedede',
    width: '100%',
    maxWidth: '930px',
  },
  paper3: {
    marginRight: '15px',
    marginLeft: '15px',
    marginBottom: '25px',
    maxWidth: '960px',
  },
  recyclebin: {
    height: '30px',
    width: '130px',
    marginRight: '25px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #404040',
    borderRadius: '5px'
  },
  sharedBtn: {
    height: '30px',
    width: '160px',
    marginRight: '25px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #404040',
    borderRadius: '5px'
  },
  newFolderBtn: {
    textTransform: 'capitalize',
    height: '30px',
    width: '110px',
    color: '#404040'
  },
  titleText: {
    fontSize: 24,
    fontWeight: 700,
    color: '#000000'
  },
  noItemText: {
    fontSize: 14,
    fontWeight: 400,
    color: '#000000',
    marginLeft: '10px',
    marginRight: '10px'
  },
  noItemTextLink: {
    fontSize: 14,
    fontWeight: 400,
    color: '#0473C7',
    cursor: 'pointer'
  },
  filterIcon: {
    height: '24px',
    width: '24px',
    marginRight: '5px',
    cursor: 'pointer'
  },
  moreIcon: {
    height: '18px',
    width: '18px',
  },
  btnIcon: {
    height: '18px',
    width: '18px',
    marginRight: '5px'
  },
  filterText: {
    fontSize: 15,
    fontWeight: 400,
    color: '#000000',
    marginRight: '15px',
    marginLeft: '10px'
  },
  filterTextClick: {
    fontSize: 15,
    fontWeight: 400,
    color: '#000000',
    marginRight: '15px',
    marginLeft: '10px',
    cursor: 'pointer'
  },
  filterHeadBox: {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    flexWrap: "wrap",
    backgroundColor: '#EBEFF3',
    padding: '10px',
    marginBottom: '10px'
  },
  moreAvatar: {
    height: '24px',
    width: '24px',
    // backgroundColor: theme.palette.secondary.main
  },
  actionsBox: {
    display: "flex",
    alignItems: 'center',
    marginRight: "6px",
    cursor: 'pointer'
  },
  actionIconAdd: {
    color: (theme) => theme.palette.primary.main,
  },
  actionIcon: {
    height: '18px',
    width: '18px',
    color: (theme) => theme.palette.primary.main,
  },
  backIcon: {
    height: '24px',
    width: '24px',
  },
  linkBox: {
    cursor: 'pointer'
  },
  tableRootPaper: {
    border: '1px solid',
    borderColor: '#dedede',
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
  moreMenu: {
    fontSize: 14,
    fontWeight: 400,
    color: '#404040'
  },
  mediumLabel: {
    fontSize: 14
  }
}
export default styles;