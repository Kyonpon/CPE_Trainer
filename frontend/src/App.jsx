import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Createpage from "./pages/Createpage";
import Homepage from "./pages/Homepage";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <Box minH={"100vh"}>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Homepage></Homepage>}></Route>
          <Route path="/create" element={<Createpage></Createpage>}></Route>
        </Routes>
      </Box>
    </>
  );
}

export default App;
