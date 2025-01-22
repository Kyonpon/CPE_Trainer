import { Box } from "@chakra-ui/react";
import CreateHeading from "../../components/ActivitiesLibComponents/CreatePage/CreateHeading";
import CreateLib from "../../components/ActivitiesLibComponents/CreatePage/CreateLib";

const Createpage = () => {
  return (
    <Box pt={10} display="flex">
      <Box display="flex" flexDirection="column" maxW={"container.sm"}>
        <CreateHeading></CreateHeading>
        <CreateLib></CreateLib>
      </Box>
      <Box display="flex" flexDirection="column"></Box>
    </Box>
  );
};

export default Createpage;
