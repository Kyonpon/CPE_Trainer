import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Createpage from "./pages/ActivitiesLibPages/Createpage";
import Homepage from "./pages/Homepage";
import NavBar from "./components/NavBar";
import Loginpage from "./pages/Loginpage";
import Universallogicmenupage from "./pages/ActivitiesLibPages/Universallogicmenupage";
import Combinationallogicmenupage from "./pages/ActivitiesLibPages/Combinationallogicmenupage";
import Activitiescircuitpages from "./pages/ActivitiesLibPages/Activitiescircuitpages";
import Microprocessormenupage from "./pages/ActivitiesLibPages/Microprocessormenupage";

function App() {
  return (
    <>
      <Box minH={"100vh"}>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Homepage></Homepage>}></Route>
          <Route path="/create" element={<Createpage></Createpage>}></Route>
          <Route path="/createul" element={<Createpage></Createpage>}></Route>
          <Route path="/createcb" element={<Createpage></Createpage>}></Route>
          <Route
            path="/createmicro"
            element={<Createpage></Createpage>}
          ></Route>
          <Route path="/login" element={<Loginpage></Loginpage>}></Route>
          <Route
            path="/ulcircuitsHome"
            element={<Universallogicmenupage></Universallogicmenupage>}
          ></Route>
          <Route
            path="/cbcircuitsHome"
            element={<Combinationallogicmenupage></Combinationallogicmenupage>}
          ></Route>
          <Route
            path="/microprocessorHome"
            element={<Microprocessormenupage></Microprocessormenupage>}
          ></Route>
          <Route
            path="/cbcircuit/:id"
            element={
              <Activitiescircuitpages circuitType="CB"></Activitiescircuitpages>
            }
          ></Route>
          <Route
            path="/microcircuit/:id"
            element={
              <Activitiescircuitpages circuitType="Micro"></Activitiescircuitpages>
            }
          ></Route>
          <Route
            path="/ulcircuit/:id"
            element={
              <Activitiescircuitpages circuitType="UL"></Activitiescircuitpages>
            }
          ></Route>
        </Routes>
      </Box>
    </>
  );
}

export default App;
