import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <Box sx={{ flexGrow: 1, mb: 5 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            fontWeight={"bold"}
            component="div"
            sx={{ flexGrow: 1, color: "crimson" }}
          >
            SRMS
          </Typography>
          <Button color="inherit">About</Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
          >
            LOGIN
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              We are the top Student Records Platform
            </Typography>
            <Typography variant="h5" paragraph>
              Efficiently manage and track student information with our
              comprehensive solution.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/login"
            >
              LOGIN
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: 400,
                objectFit: "cover",
                borderRadius: 2,
              }}
              alt="Student with textbooks"
              src="https://img.freepik.com/free-photo/young-african-female-student-with-facemask-holding-her-textbooks-campus-area_181624-41232.jpg?t=st=1723973555~exp=1723977155~hmac=0f41c12af0a340caaa324263160da6dfe3daeff972f38a627caaa66fe851a81f&w=740"
            />
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 8 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#FFFACD" }}>
              {" "}
              {/* Light Yellow */}
              <CardContent>
                <IconButton color="primary" sx={{ mb: 2 }}>
                  <SchoolIcon fontSize="large" />
                </IconButton>
                <Typography variant="h5" component="div" gutterBottom>
                  Academic Records
                </Typography>
                <Typography variant="body2">
                  Easily manage and access student academic information.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#E0FFE0" }}>
              {" "}
              {/* Light Green */}
              <CardContent>
                <IconButton color="primary" sx={{ mb: 2 }}>
                  <AssignmentIcon fontSize="large" />
                </IconButton>
                <Typography variant="h5" component="div" gutterBottom>
                  Attendance Tracking
                </Typography>
                <Typography variant="body2">
                  Monitor and analyze student attendance patterns.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#FFE0E0" }}>
              {" "}
              {/* Light Pink */}
              <CardContent>
                <IconButton color="primary" sx={{ mb: 2 }}>
                  <PeopleIcon fontSize="large" />
                </IconButton>
                <Typography variant="h5" component="div" gutterBottom>
                  Parent Communication
                </Typography>
                <Typography variant="body2">
                  Streamline communication between teachers and parents.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Welcome;
