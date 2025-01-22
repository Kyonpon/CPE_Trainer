import { Box } from "@chakra-ui/react";
import ActivityCircuitCard from "../../components/ActivitiesLibComponents/ActivityCircuitCard";
import CreateCard from "../../components/ActivitiesLibComponents/CreateCard";

function Universallogicmenupage() {
  return (
    <Box pl={4}>
      <h1>Universal Logic Circuits</h1>
      <Box display="flex" justifyContent="center" gap="20px" flexFlow="wrap">
        <ActivityCircuitCard
          url="/test"
          imgurl="https://picsum.photos/250"
          imgurlalt="this a picture"
          title="testcircuit"
        ></ActivityCircuitCard>
        <CreateCard url="/createul" title="Create New Circuit"></CreateCard>
      </Box>
    </Box>
  );
}

export default Universallogicmenupage;
