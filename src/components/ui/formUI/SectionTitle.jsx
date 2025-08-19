import { styled } from "@mui/material/styles";

const SectionTitle = styled("h3")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: "#CD0C02",
  paddingBottom: theme.spacing(1),
  fontWeight: 600,
  fontSize: "1.2rem",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "1px",
    backgroundColor: "#CD0C02",
    borderRadius: "1px",
  },
}));

export default SectionTitle;