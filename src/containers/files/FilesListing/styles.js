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
    alignItems: 'center',
    gap: '10px'
  },
  searchBar: {
    backgroundColor: '#EBEFF3'
  },
  uploadBtn: {
    textTransform: 'capitalize',
    height: '30px',
    width: '110px',
    borderRadius: '20px'
  },
  recyclebin: {
    height: '30px',
    width: '150px',
    marginRight: '25px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #404040',
    borderRadius: '5px',
    color: '#404040'
  },
  sharedBtn: {
    height: '30px',
    width: '200px',
    marginRight: '25px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #404040',
    borderRadius: '5px',
    color: '#404040'
  },
  newFolderBtn: {
    textTransform: 'capitalize',
    height: '30px',
    width: '110px',
    color: '#FFFFFF',
    backgroundColor: '#404040',
    borderRadius: '20px'
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
    cursor: 'pointer',
  },
  moreIcon: {
    height: '18px',
    width: '18px',
  },
  btnIcon: {
    height: '18px',
    width: '18px',
    marginRight: '5px',
    color: '#000000'
  },
  filterText: {
    fontSize: 15,
    fontWeight: 400,
    color: '#FFFFFF',
    marginRight: '15px',
    marginLeft: '10px'
  },
  filterTextClick: {
    fontSize: 15,
    fontWeight: 400,
    color: '#FFFFFF',
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
    backgroundColor: '#13171F',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px 5px 0px 0px'
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
  backIcon: {
    height: '24px',
    width: '24px',
  },
  linkBox: {
    cursor: 'pointer'
  },
  whiteBox: {
    backgroundColor: '#FFFFFF',
    border: '2px solid #EBEFF3',
    borderRadius: '5px'
  }
}
export default styles;