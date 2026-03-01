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
    gap: '10px'
  },
  searchBar: {
    backgroundColor: '#EBEFF3'
  },
  saveDraftBtn: {
    textTransform: 'capitalize',
    height: '30px',
    color: 'white',
    backgroundColor: '#404040',
    marginRight: '25px',
    borderRadius: '5px',
    width: '100px'
  },
  uploadBtn: {
    textTransform: 'capitalize',
    height: '30px',
    borderRadius: '20px',
    width: '95px',
    backgroundColor: '#0B51C5'
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
    marginRight: '15px',
    cursor: 'pointer !important'
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
    backgroundColor: (theme) => theme.palette.secondary.main
  },
  actionsBox: {
    display: "flex",
    alignItems: 'center',
    marginRight: "6px",
    cursor: 'pointer'
  },
  actionIconAdd: {
    color: '#FA6401'
  },
  actionIcon: {
    height: '18px',
    width: '18px',
    color: '#FA6401'
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
  greyBox: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#13171F',
    padding: "15px 25px",
    flexWrap: 'wrap',
    overflow: 'auto'
  },
  editSubMenu: {
    cursor: 'pointer',
    display: 'flex',
    width: '100%',
    padding: '20px'
  },
  greyBoxMenuContainer: {
    display: 'flex',
    width: '280px',
    backgroundColor: '#DEDEDE',
    marginTop: '-8px',
    marginBottom: '-8px',
  },
  greyBoxMenu: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    margin: '1px',
    height: '50px'
  },
  greyBoxEditMenu: {
    display: "flex",
    width: "100%",
    height: '40px',
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: '#FFFFFF',
    border: '1px solid black',
    margin: "1px 1px"
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
    fontWeight: 400,
  },
  moveableBoxIcon: {
    height: '18px',
    width: '18px',
    margin: '3px',
    cursor: 'pointer !important'
  },
  moveableBoxMoverIcon: {
    height: '18px',
    width: '18px',
    margin: '3px',
    cursor: 'move'
  },
}
export default styles;