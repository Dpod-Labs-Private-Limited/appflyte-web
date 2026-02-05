const rootBoxCommon = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '10px',
  height: '150px',
  width: '150px',
  border: '1px solid #DEDEDE',
  cursor: 'pointer',
  borderRadius: 5
}
const styles = {
  rootBox: {
    ...rootBoxCommon
  },
  rootBoxSelected: {
    ...rootBoxCommon,
    backgroundColor: '#F3F5F7'
  },
  fieldTypeName: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 700,
    color: '#000000',
    marginTop: '10px',
    marginBottom: '15px'
  },
  fieldTypeDesc: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 400,
    color: '#000000'
  },
}

export default styles;