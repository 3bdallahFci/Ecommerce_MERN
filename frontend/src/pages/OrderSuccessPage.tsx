import { Box, Button, Typography } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router";


const OrderSuccessPage = () => {

    const navigate = useNavigate()

    return(
        <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
            <CheckCircleOutline sx={{color:"green", fontSize: "200px",position:"relative",top:"100px"}}/>
            <Typography variant="h4" sx={{position:"relative",top:"100px"}}>Thank you for your Order</Typography>
            <Typography sx={{position:"relative",top:"100px"}}>We Started processing it , and we will get back for you</Typography>
            <Button sx={{position:"relative",top:"120px"}} variant="contained" onClick={() => navigate("/")}>Go to Home</Button>
        </Box>
    )

}



export default OrderSuccessPage; 