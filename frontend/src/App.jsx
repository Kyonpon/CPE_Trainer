import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Createpage from "./pages/Createpage";
import Homepage from "./pages/Homepage";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
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
