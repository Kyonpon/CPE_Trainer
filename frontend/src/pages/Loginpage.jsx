import { Box, Heading, HStack } from "@chakra-ui/react";
import LoginComp from "../components/LoginComp";
import RegisterComp from "../components/RegisterComp";

function Loginpage() {
  return (
    <Box>
      <Heading>LOGIN PAGE</Heading>
      <HStack>
        <LoginComp></LoginComp>
        <RegisterComp></RegisterComp>
      </HStack>
    </Box>
  );
}

export default Loginpage;
