import { alignItems, justifyContent } from "@mui/system";

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
    justifyContent: 'flex-end'
  },
  breadButtonsBoxFieldSet: {
    zIndex: 199,
    position: "fixed",
    left: 'calc(100vw - 357px)',
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
    backgroundColor: '#0B51C5',
    width: '160px',
    height: '35px',
    borderRadius: '20px',
  },
  refreshBtnBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end'
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
    color: (theme) => theme.palette.secondary.main,
    marginLeft: '5px'
  },
  tab: {
    fontSize: 15
  }
};

export default styles;