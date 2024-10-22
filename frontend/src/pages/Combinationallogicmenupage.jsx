import { Box } from "@chakra-ui/react";
import CreateCard from "../components/CreateCard";

function Combinationallogicmenupage() {
  return (
    <Box p={4}>
      <h1>Combinational Logic Circuits</h1>
      <Box display="flex" justifyContent="center" gap="20px" flexFlow="wrap">
        <CreateCard url="/createcb" title="Create New Circuit"></CreateCard>
      </Box>
    </Box>
  );
}

export default Combinationallogicmenupage;
