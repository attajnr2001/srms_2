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
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { db, auth } from "../helpers/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  getDoc,
  doc as firestoreDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    course: "",
    subject: "",
    class: "",
    status: true,
    role: "teacher",
  });

  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    gender: "",
  });

  useEffect(() => {
    fetchTeachers();
    fetchCourses();
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchTeachers = async () => {
    const usersCollection = collection(db, "users");
    const teachersQuery = query(
      usersCollection,
      where("role", "==", "teacher")
    );
    const teachersSnapshot = await getDocs(teachersQuery);
    const teachersList = await Promise.all(
      teachersSnapshot.docs.map(async (doc) => {
        const teacherData = doc.data();
        const course = await getDocumentById("courses", teacherData.course);
        const subject = await getDocumentById("subjects", teacherData.subject);
        const classData = await getDocumentById("classes", teacherData.class);
        return {
          id: doc.id,
          ...teacherData,
          courseName: course?.name || "N/A",
          subjectName: subject?.name || "N/A",
          className: classData?.name || "N/A",
        };
      })
    );
    setTeachers(teachersList);
  };

  const getDocumentById = async (collectionName, docId) => {
    if (!docId) return null;
    const docRef = firestoreDoc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  const fetchCourses = async () => {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesList = coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setCourses(coursesList);
  };

  const fetchSubjects = async () => {
    const subjectsCollection = collection(db, "subjects");
    const subjectsSnapshot = await getDocs(subjectsCollection);
    const subjectsList = subjectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setSubjects(subjectsList);
  };

  const fetchClasses = async () => {
    const classesCollection = collection(db, "classes");
    const classesSnapshot = await getDocs(classesCollection);
    const classesList = classesSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
    setClasses(classesList);
  };

  const handleAddTeacher = () => {
    setOpenTeacherDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenTeacherDialog(false);
    setNewTeacher({
      name: "",
      email: "",
      course: "",
      subject: "",
      class: "",
      status: true,
      role: "teacher",
    });
  };

  const handleAddStudent = (teacher) => {
    setSelectedTeacher(teacher);
    setOpenStudentDialog(true);
  };

  const handleCloseStudentDialog = () => {
    setOpenStudentDialog(false);
    setNewStudent({
      firstName: "",
      lastName: "",
      gender: "",
    });
    setSelectedTeacher(null);
  };

  const handleCloseTeacherDialog = () => {
    setOpenTeacherDialog(false);
    setNewTeacher({
      name: "",
      email: "",
      course: "",
      subject: "",
      class: "",
      status: true,
      role: "teacher",
    });
  };

  const handleStudentInputChange = (event) => {
    const { name, value } = event.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewStudent = async () => {
    try {
      const studentsCollection = collection(db, "students");
      await addDoc(studentsCollection, {
        ...newStudent,
        course: selectedTeacher.course,
        subject: selectedTeacher.subject,
        class: selectedTeacher.class,
      });

      handleCloseStudentDialog();
      // Optionally, you can fetch and update the students list here
    } catch (error) {
      console.error("Error adding new student: ", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewTeacher = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newTeacher.email,
        "123456"
      );

      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, {
        ...newTeacher,
        uid: userCredential.user.uid,
      });

      fetchTeachers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error adding new teacher: ", error);
    }
  };

  const handleEditTeacher = (teacherId) => {
    console.log("Edit teacher with ID:", teacherId);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Teachers
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAddTeacher}
        sx={{ mb: 2 }}
      >
        Add Teacher
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.courseName}</TableCell>
                <TableCell>{teacher.subjectName}</TableCell>
                <TableCell>{teacher.className}</TableCell>
                <TableCell>{teacher.status ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditTeacher(teacher.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    onClick={() => handleAddStudent(teacher)}
                  >
                    Add Student
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openTeacherDialog} onClose={handleCloseTeacherDialog}>
        <DialogTitle>Add New Teacher</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={newTeacher.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={newTeacher.email}
            onChange={handleInputChange}
          />
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="course-label">Course</InputLabel>
            <Select
              labelId="course-label"
              name="course"
              value={newTeacher.course}
              onChange={handleInputChange}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="subject-label">Subject</InputLabel>
            <Select
              labelId="subject-label"
              name="subject"
              value={newTeacher.subject}
              onChange={handleInputChange}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="class-label">Class</InputLabel>
            <Select
              labelId="class-label"
              name="class"
              value={newTeacher.class}
              onChange={handleInputChange}
            >
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <Typography component="legend">Status</Typography>
            <Switch
              name="status"
              checked={newTeacher.status}
              onChange={(e) =>
                setNewTeacher((prev) => ({
                  ...prev,
                  status: e.target.checked,
                }))
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitNewTeacher}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openStudentDialog} onClose={handleCloseStudentDialog}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            value={newStudent.firstName}
            onChange={handleStudentInputChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={newStudent.lastName}
            onChange={handleStudentInputChange}
          />

          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={newStudent.gender}
              onChange={handleStudentInputChange}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          {selectedTeacher && (
            <>
              <TextField
                margin="dense"
                label="Course"
                type="text"
                fullWidth
                variant="standard"
                value={selectedTeacher.courseName}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                label="Subject"
                type="text"
                fullWidth
                variant="standard"
                value={selectedTeacher.subjectName}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                label="Class"
                type="text"
                fullWidth
                variant="standard"
                value={selectedTeacher.className}
                InputProps={{
                  readOnly: true,
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStudentDialog}>Cancel</Button>
          <Button onClick={handleSubmitNewStudent}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teachers;
