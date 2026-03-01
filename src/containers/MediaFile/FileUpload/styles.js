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
  uploadBtn: {
    textTransform: 'capitalize',
    height: '30px',
    width: '95px',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    border: '1px solid #404040',
    borderRadius: '20px'
  },
  newFolderBtn: {
    textTransform: 'capitalize',
    height: '30px',
    width: '95px',
    borderRadius: '20px',
    backgroundColor: "#0B51C5"
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
    marginRight: '5px'
  },
  moreIcon: {
    height: '18px',
    width: '18px',
  },
  filterText: {
    fontSize: 15,
    fontWeight: 400,
    color: '#000000',
    marginRight: '15px',
    marginLeft: '10px'
  },
  boldText: {
    fontSize: 15,
    fontWeight: 700,
  },
  filterHeadBox: {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    flexWrap: "wrap",
    backgroundColor: '#EBEFF3',
    padding: '10px',
  },
  moreAvatar: {
    height: '24px',
    width: '24px',
    backgroundColor: (theme) => theme.palette.secondary.main,
  },
  actionsBox: {
    display: "flex",
    alignItems: 'center',
    marginRight: "6px",
    cursor: 'pointer'
  },
  dropZone: {
    backgroundColor: '#F5F5F5',
    height: '150px',
    paddingBottom: '20px',
    minHeight: '150px',
    border: '0px solid black',
    padding: 0
  },
  dropZoneFont: {
    fontSize: 14,
    fontWeight: 400,
    color: '#404040'
  },
  paper: {
    // width: '100%',
    marginRight: '15px',
    marginLeft: '15px',
    marginBottom: '25px',
    border: '1px solid',
    borderColor: '#dedede',
    maxWidth: '930px',
  },
  addObjectiveHeading: {
    fontSize: 14,
    fontWeight: 400,
    color: '#0A51A0',
    letterSpacing: 3,
  },
  uploadLoadingBox: {
    position: 'fixed',
    bottom: '35px',
    right: '150px',
    zIndex: 2100,
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    minHeight: '120px',
    boxShadow: (theme) => theme.shadows[5],
    backgroundColor: 'white'
  },
  uploadingHeaderBox: {
    display: 'flex',
    height: '40px',
    paddingLeft: '15px',
    paddingRight: '15px',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: (theme) => theme.palette.primary.main,
  },
  uploadingText: {
    fontSize: 15,
    fontWeight: 400,
    color: '#FFFFFF',
  },
  closeIcon: {
    height: '20px',
    width: '20px',
    color: '#FFFFFF',
    cursor: 'pointer'
  },
  tickIcon: {
    height: '18px',
    width: '18px',
    marginRight: '15px'
  },
  failedIcon: {
    height: '18px',
    width: '18px',
    marginRight: '15px',
    color: 'red'
  },
  previewChip: {
    minWidth: 100,
    maxWidth: 210,
    // backgroundColor: theme.palette.secondary.main,
    // color: 'white',
    marginTop: '10px'
  },
  previeGrid: {
    margin: '50px'
  },
  mediumLabel: {
    fontSize: 14
  }
}
export default styles;