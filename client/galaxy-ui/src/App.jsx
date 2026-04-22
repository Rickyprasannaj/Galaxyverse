import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

import Home from "./pages/Home";
import Gels from "./pages/Gels";
import Signals from "./pages/Signals";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected App Layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/gels" element={<Gels />} />
        <Route path="/signals" element={<Signals />} />
        <Route path="/chat/:galaxyId" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;