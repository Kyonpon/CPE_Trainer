import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import React from "react";

function BananaSocket({ functionName, isOutputProbe, isActive }) {
  return (
    <Box width="100px" minH="175px" backgroundColor="gray.700">
      <VStack>
        <Heading size="md" color={"white"} textAlign="center">
          {functionName}
        </Heading>
        <Box
          width="75px"
          height="75px"
          border={"1px solid white"}
          borderRadius="50%"
          backgroundColor={isOutputProbe ? "green" : "yellow"}
          display={"flex"}
          justifyContent="center"
          alignItems="center"
        >
          <Box
            width="50px"
            height="50px"
            border={"2px solid black"}
            borderRadius="50%"
            backgroundColor="black"
          ></Box>
        </Box>
        <Box
          mt={2}
          width="35px"
          height="35px"
          backgroundColor={
            isActive ? (isOutputProbe ? "green" : "yellow") : "black"
          }
          borderRadius="50%"
          border={"1px solid white"}
        ></Box>
      </VStack>
    </Box>
  );
}

export default BananaSocket;
