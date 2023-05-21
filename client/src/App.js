import "./App.css";
import SignIn from "./SignIn";
import Home from "./Home";
import HomeRecruiter from "./HomeRecruiter";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="recruiter" element={<HomeRecruiter />} />
            <Route path="login" element={<SignIn />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
