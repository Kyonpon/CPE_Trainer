import { Box, Heading } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

function CreateHeading() {
  const location = useLocation();

  const getHeadingText = () => {
    const path = location.pathname;
    if (path.includes("createcb")) {
      return "Create Combinational Logic Circuit";
    }
    if (path.includes("createul")) {
      return "Create Universal Logic Circuit";
    }
    if (path.includes("createmicro")) {
      return "Create Microprocessor Circuit";
    }
    if (path.includes("create")) {
      return "Create New Circuit THIS IS A PLACEHOLDER";
    }
  };

  return (
    <Box>
      <Heading as={"h1"} size={"2xl"} textAlign={"center"}>
        {getHeadingText()}
      </Heading>
    </Box>
  );
}

export default CreateHeading;
