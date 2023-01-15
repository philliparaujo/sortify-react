import { useState } from "react";
import { NavBarVisible } from "./App";

import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext } from "react";

export function Menu({
  isLoggedIn,
  name,
  profile,
  login,
  logout,
  toggleTheme,
}) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { setVisible } = useContext(NavBarVisible);

  const settings = [`Hi ${name}!`, "Open Spotify", "Change theme", "Logout"];
  const settingClick = [
    () => {},
    () => window.open(profile, "_blank", "noreferrer"),
    toggleTheme,
    logout,
  ];

  const handleOpenLoggedInMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseLoggedInMenu = (event) => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            disabled={!isLoggedIn}
            onClick={() => setVisible((prev) => !prev)}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sortify
          </Typography>

          {isLoggedIn ? (
            <Box>
              <IconButton onClick={handleOpenLoggedInMenu}>
                <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
              <Popover
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                keepMounted
                open={Boolean(anchorElUser)}
                onClose={handleCloseLoggedInMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem key={index}>
                    <Typography onClick={settingClick[index]}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Popover>
            </Box>
          ) : (
            <Button color="inherit" onClick={login}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
