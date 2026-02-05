const styles = {
  modal: {
    position: 'fixed',
    width: '660px',
    minHeight: '400px',
    maxHeight: '90%',
    overflow: 'auto',
    backgroundColor:(theme)=> theme.palette.background.paper,
    boxShadow:(theme)=> theme.shadows[5],
  },
};

export default styles;