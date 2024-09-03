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
import Students from "./components/Students";
import Grades from "./components/Grades";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard/:userId" element={<Dashboard />}>
          <Route path="students" element={<Students />} />
          <Route path="grades" element={<Grades />} />
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
