import { Box, Button } from "@chakra-ui/react";
import BoolSolverInstance from "../../components/CircuitTesterComponents/BoolSolverInstance";

function CircuitTesterHome() {
  return (
    <Box p={2} m={0} w="100vw" backgroundColor="purple.700">
      <h1>BOOLEAN FUNCTION SOLVER</h1>
      <BoolSolverInstance />
      <Button mt={2}>Add Another Output</Button>
    </Box>
  );
}

export default CircuitTesterHome;
