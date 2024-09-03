import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { db } from "../helpers/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  getDoc,
  doc as firestoreDoc,
} from "firebase/firestore";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    course: "",
    population: 0,
  });

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchClasses = async () => {
    const classesCollection = collection(db, "classes");
    const classesSnapshot = await getDocs(classesCollection);
    const classesList = await Promise.all(
      classesSnapshot.docs.map(async (docSnapshot) => {
        const classData = docSnapshot.data();
        const courseDoc = await getDoc(
          firestoreDoc(db, "courses", classData.course)
        );

        return {
          id: docSnapshot.id,
          ...classData,
          courseName: courseDoc.exists()
            ? courseDoc.data().name
            : "Unknown Course",
        };
      })
    );
    setClasses(classesList);
  };

  const fetchCourses = async () => {
    const usersCollection = collection(db, "courses");
    const coursesQuery = query(usersCollection);
    const coursesSnapshot = await getDocs(coursesQuery);
    const coursesList = coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setCourses(coursesList);
  };

  const handleAddClass = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewClass({
      name: "",
      course: "",
      population: 0,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewClass = async () => {
    try {
      const classesCollection = collection(db, "classes");
      await addDoc(classesCollection, newClass);
      fetchClasses(); // Refresh the classes list
      handleCloseDialog();
    } catch (error) {
      console.error("Error adding new class: ", error);
    }
  };

  const handleViewClass = (className) => {
    const selectedClassData = classes.find((cls) => cls.name === className);
    setSelectedClass({ name: className, type: selectedClassData.course });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Classes
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddClass}
        sx={{ mb: 2 }}
      >
        Add Class
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Population</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.courseName}</TableCell>
                <TableCell>{cls.population}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewClass(cls.name)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Class</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Class Name"
            type="text"
            fullWidth
            variant="standard"
            value={newClass.name}
            onChange={handleInputChange}
          />
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="class-teacher-label">Course</InputLabel>
            <Select
              labelId="course"
              name="course"
              value={newClass.course}
              onChange={handleInputChange}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="population"
            label="Population"
            type="number"
            fullWidth
            variant="standard"
            value={newClass.population}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitNewClass}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Classes;
