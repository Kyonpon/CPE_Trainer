import { Box } from "@chakra-ui/react";
import PushDatabaseNewCircuit from "../components/PushDatabaseNewCircuit";
import CreateHeading from "../components/CreateHeading";

const Createpage = () => {
  return (
    <Box pt={10} display="flex">
      <Box display="flex" flexDirection="column" maxW={"container.sm"}>
        <CreateHeading></CreateHeading>
        <PushDatabaseNewCircuit></PushDatabaseNewCircuit>
      </Box>
      <Box display="flex" flexDirection="column"></Box>
    </Box>
  );
};

export default Createpage;
