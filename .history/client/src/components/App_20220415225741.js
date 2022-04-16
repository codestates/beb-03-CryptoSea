import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import MainPage from "../routers/page/MainPage.js";
import CreatePage from "../routers/page/CreatePage.js";
import MyAccount from "../routers/page/MyAccount.js";
import Navbar from "./Navbar.js";
import checkRopsten from "../Controller/checkRopsten";

function App() {
  useEffect(() => {
    checkRopsten();
  }, []);

  const [isSearch, setIsSearch] = useState();

  return (
    <>
      <Navbar setIsSearch={setIsSearch} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/myAccounts" element={<MyAccount />} />
      </Routes>
    </>
  );
}

export default App;