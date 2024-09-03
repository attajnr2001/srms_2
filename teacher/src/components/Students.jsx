import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { db } from "../helpers/firebase";
import {
  collection,
  getDocs,
  doc as firestoreDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    fetchTeacherAndStudents();
  }, [userId]);

  const fetchTeacherAndStudents = async () => {
    try {
      // Fetch teacher details
      const teacherDoc = await getDocumentById("users", userId);
      console.log(userId)
      if (!teacherDoc || teacherDoc.role !== "teacher") {
        console.error("Teacher not found or invalid role");
        return;
      }
      setTeacher(teacherDoc);

      // Fetch students matching teacher's course, subject, and class
      const studentsCollection = collection(db, "students");
      const q = query(
        studentsCollection,
        where("course", "==", teacherDoc.course),
        where("subject", "==", teacherDoc.subject),
        where("class", "==", teacherDoc.class)
      );
      const studentsSnapshot = await getDocs(q);

      const studentsList = await Promise.all(
        studentsSnapshot.docs.map(async (doc) => {
          const studentData = doc.data();
          const course = await getDocumentById("courses", studentData.course);
          const subject = await getDocumentById(
            "subjects",
            studentData.subject
          );
          const classData = await getDocumentById("classes", studentData.class);
          return {
            id: doc.id,
            ...studentData,
            name: course?.name || "N/A",
            subjectName: subject?.name || "N/A",
            className: classData?.name || "N/A",
          };
        })
      );
      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching teacher and students:", error);
    }
  };

  const getDocumentById = async (collectionName, docId) => {
    if (!docId) return null;
    const docRef = firestoreDoc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedStudent(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Students
      </Typography>
      {teacher && (
        <Typography variant="subtitle1" gutterBottom>
         My Students
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.subjectName}</TableCell>
                <TableCell>{student.className}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewStudent(student)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openViewDialog} onClose={handleCloseViewDialog}>
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box>
              <Typography>
                <strong>First Name:</strong> {selectedStudent.firstName}
              </Typography>
              <Typography>
                <strong>Last Name:</strong> {selectedStudent.lastName}
              </Typography>
              <Typography>
                <strong>Gender:</strong> {selectedStudent.gender}
              </Typography>
              <Typography>
                <strong>Course:</strong> {selectedStudent.name}
              </Typography>
              <Typography>
                <strong>Subject:</strong> {selectedStudent.subjectName}
              </Typography>
              <Typography>
                <strong>Class:</strong> {selectedStudent.className}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Students;
