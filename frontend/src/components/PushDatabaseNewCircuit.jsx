import {
  Box,
  Container,
  Heading,
  Input,
  useColorModeValue,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

function PushDatabaseNewCircuit() {
  const [newUniversalLogicCircuit, setNewUniversalLogicCircuit] = useState({
    ulCircuitName: "",
    imageUrl: "",
  });

  const handleAddNewCircuit = () => {
    console.log(newUniversalLogicCircuit);
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={10}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"}>
          {/* Make this dynamic */}
          Create New Circuit
        </Heading>
        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              placeholder="Circuit Name"
              name="circuit"
              value={newUniversalLogicCircuit.circuit}
              onChange={(event) =>
                setNewUniversalLogicCircuit({
                  ...newUniversalLogicCircuit,
                  ulCircuitName: event.target.value,
                })
              }
            />
            <Input
              placeholder="Image URL"
              name="image"
              value={newUniversalLogicCircuit.image}
              onChange={(event) =>
                setNewUniversalLogicCircuit({
                  ...newUniversalLogicCircuit,
                  imageUrl: event.target.value,
                })
              }
            />

            <Button colorScheme="blue" w="full" onClick={handleAddNewCircuit}>
              Create!
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default PushDatabaseNewCircuit;
