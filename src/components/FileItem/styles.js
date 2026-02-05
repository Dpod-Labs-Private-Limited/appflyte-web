const rootBoxCommon = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '150px',
  width: '150px',
  borderRadius: '5px',
  marginBottom: '15px',
  cursor: 'pointer'
}
const styles = {
  rootBox: {
    ...rootBoxCommon,
    border: '1px solid #DEDEDE',
  },
  rootBoxSelected: {
    ...rootBoxCommon,
    border: '1px solid #FA6401',
  },
  fileTypeIcon: {
    height: '48px',
    width: '48px',
    color: '#666666'
  },
  thumbnail: {
    height: '146px',
    objectFit: "contain"
  },
  svgIconThumbnail: {
    height: '48px',
    width: '48px',
    objectFit: "contain"
  },
  nameText: {
    fontSize: 14,
    fontWeight: 400,
    color: '#000000',
    maxWidth: '150px'
  }
}
export default styles;