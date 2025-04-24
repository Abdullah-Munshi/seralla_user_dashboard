import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
      <Toaster
      // toastOptions={{
      //   success: {
      //     duration: 2000,
      //     iconTheme: {
      //       primary: "green",
      //       secondary: "black",
      //     },
      //   },
      // }}
      />
    </>
  );
};

export default App;
