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
  TableSortLabel,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { db } from "../helpers/firebase";
import {
  collection,
  getDocs,
  doc as firestoreDoc,
  getDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [teacher, setTeacher] = useState(null);
  const { userId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("lastName");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    fetchTeacherAndStudents();
  }, [userId]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedStudents = React.useMemo(() => {
    const compareFunction = (a, b) => {
      if (
        [
          "test1",
          "test2",
          "test3",
          "midSemExam",
          "finalExam",
          "total",
        ].includes(orderBy)
      ) {
        const aValue =
          orderBy === "total"
            ? calculateTotal(a.id)
            : grades[a.id]?.[orderBy] || 0;
        const bValue =
          orderBy === "total"
            ? calculateTotal(b.id)
            : grades[b.id]?.[orderBy] || 0;
        return (aValue - bValue) * (order === "asc" ? 1 : -1);
      }
      if (["firstName", "lastName"].includes(orderBy)) {
        return (
          a[orderBy].localeCompare(b[orderBy]) * (order === "asc" ? 1 : -1)
        );
      }
      return 0;
    };

    return [...students].sort(compareFunction);
  }, [students, orderBy, order, grades]);

  const filteredStudents = sortedStudents.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TableSortCell = ({ label, property }) => (
    <TableCell>
      <TableSortLabel
        active={orderBy === property}
        direction={orderBy === property ? order : "asc"}
        onClick={() => handleRequestSort(property)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  const fetchTeacherAndStudents = async () => {
    try {
      // Fetch teacher details
      const teacherDoc = await getDocumentById("users", userId);
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
            courseName: course?.name || "N/A",
            subjectName: subject?.name || "N/A",
            className: classData?.name || "N/A",
          };
        })
      );
      setStudents(studentsList);

      // Initialize grades
      const initialGrades = {};
      for (const student of studentsList) {
        const gradeDoc = await getDocumentById("grades", student.id);
        initialGrades[student.id] = gradeDoc?.grades || {
          test1: 0,
          test2: 0,
          test3: 0,
          midSemExam: 0,
          finalExam: 0,
        };
      }
      setGrades(initialGrades);
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

  const handleGradeChange = (studentId, exam, value) => {
    const maxValues = {
      test1: 10,
      test2: 10,
      test3: 10,
      midSemExam: 20,
      finalExam: 50,
    };

    const numValue = Number(value) || 0;
    const limitedValue = Math.min(Math.max(numValue, 0), maxValues[exam]);

    setGrades((prevGrades) => ({
      ...prevGrades,
      [studentId]: {
        ...prevGrades[studentId],
        [exam]: limitedValue,
      },
    }));
  };

  const calculateTotal = (studentId) => {
    const studentGrades = grades[studentId];
    if (!studentGrades) return 0;
    return Object.values(studentGrades).reduce(
      (sum, grade) => sum + (Number(grade) || 0),
      0
    );
  };

  const handleSaveChanges = async () => {
    try {
      const gradesCollection = collection(db, "grades");

      for (const [studentId, studentGrades] of Object.entries(grades)) {
        const gradeDoc = firestoreDoc(gradesCollection, studentId);
        await setDoc(
          gradeDoc,
          {
            studentId: studentId,
            grades: studentGrades,
            teacherId: userId,
            course: teacher.course,
            subject: teacher.subject,
            class: teacher.class,
            timestamp: new Date(),
          },
          { merge: true }
        );
      }

      alert("Grades saved successfully!");
    } catch (error) {
      console.error("Error saving grades:", error);
      alert("Error saving grades. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Grades
      </Typography>
      {teacher && (
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableSortCell label="Last Name" property="lastName" />
              <TableSortCell label="First Name" property="firstName" />
              <TableSortCell label="Test 1" property="test1" />
              <TableSortCell label="Test 2" property="test2" />
              <TableSortCell label="Test 3" property="test3" />
              <TableSortCell label="Mid Sem Exam" property="midSemExam" />
              <TableSortCell label="Final Exam" property="finalExam" />
              <TableSortCell label="Total" property="total" />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                {["test1", "test2", "test3", "midSemExam", "finalExam"].map(
                  (exam) => (
                    <TableCell key={exam}>
                      <TextField
                        type="number"
                        size="small"
                        sx={{ maxWidth: "5rem" }}
                        value={grades[student.id]?.[exam] || 0}
                        onChange={(e) =>
                          handleGradeChange(student.id, exam, e.target.value)
                        }
                        inputProps={{
                          min: 0,
                          max:
                            exam === "midSemExam"
                              ? 20
                              : exam === "finalExam"
                              ? 50
                              : 10,
                        }}
                      />
                    </TableCell>
                  )
                )}
                <TableCell>{calculateTotal(student.id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default Grades;
