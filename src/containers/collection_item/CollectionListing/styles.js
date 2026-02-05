const styles = {
  breadButtonsBox: {
    height: 56,
    zIndex: 1100,
    position: "fixed",
    left: 'calc(100vw - 210px)',
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
    justifyContent: 'space-between',
    marginTop: '15px',
    marginBottom: '10px'
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
    marginLeft: '5px',
    color:(theme) => theme.palette.secondary.main
  },
  mediaBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
    width: '90px',
    backgroundColor: '#D8D8D8',
    borderRadius: 8
  },
  mediaCard: {
    height: '50px',
    width: '90px',
  },
  tab: {
    fontSize: 15
  }
}
export default styles;