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
  Snackbar,
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

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: "",
    course: "",
    population: 0,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchSubjects();
    fetchCourses();
  }, []);

  const fetchSubjects = async () => {
    try {
      const subjectsCollection = collection(db, "subjects");
      const subjectsSnapshot = await getDocs(subjectsCollection);
      const subjectsList = await Promise.all(
        subjectsSnapshot.docs.map(async (docSnapshot) => {
          const subjectData = docSnapshot.data();
          let courseName = "Unknown Course";
          let teacherName = "Unknown Teacher";

          if (subjectData.course) {
            const courseDoc = await getDoc(
              firestoreDoc(db, "courses", subjectData.course)
            );
            if (courseDoc.exists()) {
              courseName = courseDoc.data().name;
            }
          }

          if (subjectData.subjectTeacher) {
            const teacherDoc = await getDoc(
              firestoreDoc(db, "users", subjectData.subjectTeacher)
            );
            if (teacherDoc.exists()) {
              teacherName = teacherDoc.data().name;
            }
          }

          return {
            id: docSnapshot.id,
            ...subjectData,
            courseName,
            teacherName,
          };
        })
      );
      setSubjects(subjectsList);
    } catch (error) {
      console.error("Error fetching subjects: ", error);
      setSnackbarMessage("Error fetching subjects. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, "courses");
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCourses(coursesList);
    } catch (error) {
      console.error("Error fetching courses: ", error);
      setSnackbarMessage("Error fetching courses. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleAddSubject = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewSubject({
      name: "",
      course: "",
      population: 0,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewSubject = async () => {
    if (!newSubject.name || !newSubject.course) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const subjectsCollection = collection(db, "subjects");
      await addDoc(subjectsCollection, newSubject);
      fetchSubjects(); // Refresh the subjects list
      handleCloseDialog();
      setSnackbarMessage("Subject added successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding new subject: ", error);
      setSnackbarMessage("Error adding new subject. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleViewSubject = (subjectName) => {
    const selectedSubjectData = subjects.find(
      (subject) => subject.name === subjectName
    );
    setSelectedSubject({
      name: subjectName,
      type: selectedSubjectData.course,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Subjects
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddSubject}
        sx={{ mb: 2 }}
      >
        Add Subject
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
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.courseName}</TableCell>
                <TableCell>{subject.population}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewSubject(subject.name)}
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
        <DialogTitle>Add New Subject</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Subject Name"
            type="text"
            fullWidth
            variant="standard"
            value={newSubject.name}
            onChange={handleInputChange}
            required
          />
          <FormControl fullWidth variant="standard" margin="dense" required>
            <InputLabel id="subject-course-label">Course</InputLabel>
            <Select
              labelId="course"
              name="course"
              value={newSubject.course}
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
            value={newSubject.population}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitNewSubject}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Subjects;
