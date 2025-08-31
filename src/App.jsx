// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Global Styles
import "bootstrap/dist/css/bootstrap.min.css";

//custom style
import "./assets/CSS/style.scss";

// Pages / Components
import Home from "./Component/Frontent/Home";
import Personal from "./Component/Frontent/Personal";
import Admin from "./Component/Frontent/Admin";
import Test from "./Component/Frontent/Test";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Home />} />

        {<Route path="/persional" element={<Personal />} />}
        {<Route path="/admin" element={<Admin />} />}
        {<Route path="/test" element={<Test />} />}
      </Routes>
    </Router>
  );
}

export default App;
