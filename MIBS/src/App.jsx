import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Members from "./pages/Members";
import Cleaning from "./pages/Cleaning";
import Meeting from "./pages/Meeting";
import Notice from "./pages/Notice";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Members />} />
        <Route path="/cleaning" element={<Cleaning />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/notice" element={<Notice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
