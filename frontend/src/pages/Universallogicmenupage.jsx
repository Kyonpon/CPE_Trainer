import { Box } from "@chakra-ui/react";
import UniversalLogicCard from "../components/UniversalLogicCard";
import CreateCard from "../components/CreateCard";

function Universallogicmenupage() {
  return (
    <Box pl={4}>
      <h1>Universal Logic Circuits</h1>
      <Box display="flex" justifyContent="center" gap="20px" flexFlow="wrap">
        <UniversalLogicCard
          url="/test"
          imgurl="https://picsum.photos/250"
          imgurlalt="this a picture"
          title="testcircuit"
        ></UniversalLogicCard>
        <CreateCard url="/createul" title="Create New Circuit"></CreateCard>
      </Box>
    </Box>
  );
}

export default Universallogicmenupage;
