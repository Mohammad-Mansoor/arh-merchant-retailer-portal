
import { styled } from "@mui/material/styles";
const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
}));

export default StyledForm;