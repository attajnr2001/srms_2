import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { School, Person, Class } from "@mui/icons-material";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../helpers/firebase";

const Widget = ({ icon, title, count, onClick }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "action.hover",
      },
    }}
    onClick={onClick}
  >
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" component="div">
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {count}
      </Typography>
    </Box>
    {icon}
  </Paper>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);

  useEffect(() => {
    // Listener for students
    const unsubStudents = onSnapshot(collection(db, "students"), (snapshot) => {
      setStudentCount(snapshot.size);
    });

    // Listener for classes
    const unsubClasses = onSnapshot(collection(db, "classes"), (snapshot) => {
      setClassCount(snapshot.size);
    });

    // Listener for teachers (users with role "teacher")
    const teachersQuery = query(
      collection(db, "users"),
      where("role", "==", "teacher")
    );
    const unsubTeachers = onSnapshot(teachersQuery, (snapshot) => {
      setTeacherCount(snapshot.size);
    });

    // Cleanup function
    return () => {
      unsubStudents();
      unsubClasses();
      unsubTeachers();
    };
  }, []);

  const handleTeacherClick = () => {
    navigate("/dashboard/teachers");
  };

  return (
    <Box>
      <Navbar />
      <Container sx={{ marginTop: "2rem" }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Widget
              icon={<School fontSize="large" color="primary" />}
              title="Students"
              count={studentCount}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Widget
              icon={<Person fontSize="large" color="primary" />}
              title="Teachers"
              count={teacherCount}
              onClick={handleTeacherClick}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Widget
              icon={<Class fontSize="large" color="primary" />}
              title="Classes"
              count={classCount}
            />
          </Grid>
        </Grid>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Dashboard;
