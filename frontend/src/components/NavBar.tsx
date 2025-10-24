import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import "../../public/App.css";
import { useAuth } from "../Context/AuthContext";
import { Badge, Button } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router";
import ShoppingCart from "@mui/icons-material/ShoppingCart";

const settings = ["My orders", "Logout"];

function NavBar() {
  const navigate = useNavigate();
  const { username, isAuth, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleCloseUserMenu;
  };

  return (
    <AppBar position="static" elevation={0} className="navbar">
      <Container maxWidth="xl">
        <Toolbar disableGutters className="toolbar">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              width={200}
            >
              <AdbIcon sx={{ display: "flex" }} className="logo" />
              <Typography
                variant="h4"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: "flex",
                  fontFamily: "monospace",
                  textDecoration: "none",
                }}
                className="profile"
              >
                3bdallah
              </Typography>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={4}
            >
              <IconButton aria-label="cart" onClick={() => navigate("/cart")}>
                <Badge badgeContent={4} color="secondary">
                  <ShoppingCart sx={{color:"#ffffff"}} />
                </Badge>
              </IconButton>
              {isAuth ? (
                <>
                  <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                      <Box
                        gap={2}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography>{username}</Typography>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                          <Avatar
                            alt={username || ""}
                            src="/static/images/avatar/2.jpg"
                          />
                        </IconButton>
                      </Box>
                    </Tooltip>
                    <Menu
                      sx={{ mt: "45px" }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Typography sx={{ textAlign: "center" }}>
                          My orders
                        </Typography>
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <Typography sx={{ textAlign: "center" }}>
                          Logout
                        </Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleLogin}
                  sx={{ backgroundColor: "#cfa4ff" }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
