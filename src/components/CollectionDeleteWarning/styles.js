const styles = {
  modal: {
    position: 'fixed',
    width: '600px',
    maxHeight: '600px',
    borderRadius: '5px',
    backgroundColor: (theme) => theme.palette.background.paper,
    boxShadow:(theme) => theme.shadows[5],
    overflow: 'auto'
  },
  cancelBtn: {
    backgroundColor: 'white',
    borderColor: 'black',
    border: '1px solid',
    height: '26px',
    marginRight: '15px',
    textTransform: 'capitalize',
  },
  cancelBtnOverwrite: {
    backgroundColor: 'white',
    color: '#404040',
    border: '1px solid',
    height: '25px',
    marginRight: '15px',
    borderRadius: 10
  },
  successMsg: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: '10px'
  },
  errorFont: {
    fontSize: 14,
    fontWeight: 600,
    color: '#F91515',
  },
  itemFont: {
    fontSize: 13,
    fontWeight: 400,
    color: '#404040'
  },
  nameHeader: {
    fontSize: 13,
    fontWeight: 700,
    color: '#404040'
  },
  resolveLink: {
    fontSize: 13,
    fontWeight: 400,
    color: '#FA6401',
    cursor: 'pointer'
  },
  titleBar: {
    display: 'flex',
    width: '100%',
    height: '60px',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 25px'
  },
  title: {
    fontSize: 15,
    fontWeight: 500,
    color: '#0A51A0',
    letterSpacing: 3
  }
}

export default styles;