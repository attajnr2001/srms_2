import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SchoolIcon from "@mui/icons-material/School";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >

      <MenuItem onClick={() => handleNavigation("/")}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleNavigation("/dashboard/teachers")}>
        Teachers
      </MenuItem>
      <MenuItem onClick={() => handleNavigation("/dashboard/students")}>
        Students
      </MenuItem>
      <MenuItem onClick={() => handleNavigation("/dashboard/subjects")}>
        Sugjects
      </MenuItem>
      <MenuItem onClick={() => handleNavigation("/dashboard/grades")}>
        Grades
      </MenuItem>
      {/* <MenuItem onClick={() => handleNavigation("/dashboard/courses")}>
        Courses
      </MenuItem>
      <MenuItem onClick={() => handleNavigation("/dashboard/reports")}>
        Reports
      </MenuItem> */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <SchoolIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Student Records
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              color="inherit"
              onClick={() => handleNavigation("/dashboard/teachers")}
            >
              Teachers
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation("/dashboard/students")}
            >
              Students
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation("/dashboard/subjects")}
            >
              Subjects
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation("/dashboard/grades")}
            >
              Grades
            </Button>
            {/* <Button
              color="inherit"
              onClick={() => handleNavigation("/dashboard/courses")}
            >
              Courses
            </Button> */}
            {/* <Button
              color="inherit"
              onClick={() => handleNavigation("/dashboard/reports")}
            >
              Reports
            </Button> */}
          </Box>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Navbar;
