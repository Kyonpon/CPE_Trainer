import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Createpage from "./pages/Createpage";
import Homepage from "./pages/Homepage";
import NavBar from "./components/NavBar";
import Loginpage from "./pages/Loginpage";
import Universallogicmenupage from "./pages/Universallogicmenupage";
import Combinationallogicmenupage from "./pages/Combinationallogicmenupage";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Homepage></Homepage>}></Route>
          <Route path="/create" element={<Createpage></Createpage>}></Route>
          <Route path="/createul" element={<Createpage></Createpage>}></Route>
          <Route path="/createcb" element={<Createpage></Createpage>}></Route>
          <Route path="/login" element={<Loginpage></Loginpage>}></Route>
          <Route
            path="/ulcircuitsHome"
            element={<Universallogicmenupage></Universallogicmenupage>}
          ></Route>
          <Route
            path="/cbcircuitsHome"
            element={<Combinationallogicmenupage></Combinationallogicmenupage>}
          ></Route>
        </Routes>
      </Box>
    </>
  );
}

export default App;
