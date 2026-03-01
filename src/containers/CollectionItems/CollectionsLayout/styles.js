const breadcrumbCommon = {
  height: 56,
  zIndex: 1100,
  position: "fixed",
}
const styles = {
  mainContainer: {
    width: "100%",
    height: 'calc(100% - 10px)',
    paddingBottom: "5px",
    marginBottom: "10px"
  },
  sidebar: {
    width: '200px',
    height: '100vh',
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    position: 'fixed',
    paddingBottom: '100px',
    zIndex: 1200
  },
  drawerContentBox: {
    overflow: 'auto',
    position: 'relative',
    height: "100%",
    padding: "10px"
  },
  componentContainer: {
    height: "100%",
    margin: "0px 15px 0px 200px",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    padding: '20px 20px 0px 20px',
    borderRadius: "20px",
    height: "100%",
    overflow: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  breadButtonsBox: {
    // ...breadcrumbCommon,
    // left: '462px',
    // width: 'calc(100% - 470px)'
  },
  breadButtonsBoxAdd: {
    // ...breadcrumbCommon,
    // left: '462px',
    // width: 'calc(100% - 470px)'
  },
  breadButtonsBoxClosed: {
    ...breadcrumbCommon,
    left: '332px',
    width: 'calc(100% - 340px)'
  },
  breadButtonsBoxClosedAdd: {
    ...breadcrumbCommon,
    left: '332px',
    width: 'calc(100% - 340px)'
  },
  button: {
    marginLeft: 10
  },
  cancelBtn: {
    textTransform: 'capitalize',
    height: '35px',
    width: '85px',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px'
  },
  breadCrumbBold: {
    fontSize: 15,
    fontWeight: 600,
    textTransform: 'capitalize',
    cursor: 'pointer'
  },
  breadCrumbNormal: {
    fontSize: 15,
    fontWeight: 400,
  },
  saveDraftBtn: {
    textTransform: 'capitalize',
    height: '35px',
    width: '100px',
    backgroundColor: "#0B51C5",
    borderRadius: '20px'
  },
}
export default styles;