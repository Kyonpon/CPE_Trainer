import { Box } from "@chakra-ui/react";
import PushDatabaseNewCircuit from "../components/PushDatabaseNewCircuit";
import CreateHeading from "../components/CreateHeading";
import PushDatabaseNewCircuit_try from "../components/Experimental/AllPushData";
import CreateLib from "../components/Experimental/CreateLib";

const Createpage = () => {
  return (
    <Box pt={10} display="flex">
      <Box display="flex" flexDirection="column" maxW={"container.sm"}>
        <CreateHeading></CreateHeading>

        {/* <PushDatabaseNewCircuit_try></PushDatabaseNewCircuit_try> */}
        <CreateLib></CreateLib>
      </Box>
      <Box display="flex" flexDirection="column"></Box>
    </Box>
  );
};

export default Createpage;
