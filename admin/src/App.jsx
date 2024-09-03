import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./helpers/Theme";
import Classes from "./components/Classes";
import Teachers from "./components/Teachers";
import Subjects from "./components/Subjects";
import Students from "./components/Students";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route path="" element={<Classes />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="students" element={<Students />} />
        </Route>
      </>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
