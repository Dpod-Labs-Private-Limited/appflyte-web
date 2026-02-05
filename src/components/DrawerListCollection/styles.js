const drawerWidth = 350;
const styles = {
  ListHeader: {
    fontWeight: "bold",
    color: "#000000",
    fontSize: 14
  },
  listItemTextStyle: {
    fontWeight: 400,
    color: "#000000",
    fontSize: 14
  },
  listItemTextStyleSelected: {
    fontWeight: 400,
    color: (theme) => theme.palette.secondary.main,
    fontSize: 14
  },
  ListItemIcon: {
    minWidth: '38px',
    marginBottom: '5px',
    color: "#000000",
    height: '18px',
    width: '18px',
  },
};

export default styles;
