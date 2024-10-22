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
import { useUlcircuits } from "../hooks/zustandUlCircuit";
import { useLocation } from "react-router-dom"; // Import useLocation

function PushDatabaseNewCircuit() {
  const [newUniversalLogicCircuit, setNewUniversalLogicCircuit] = useState({
    universalCircuitName: "",
    imageUrl: "",
  });
  const location = useLocation();
  // Determine the heading based on the current URL
  const getHeadingText = () => {
    const path = location.pathname;
    if (path.includes("createcb")) {
      return "Create Combinational Logic Circuit";
    }
    if (path.includes("createul")) {
      return "Create Universal Logic Circuit";
    }
    if (path.includes("create")) {
      return "Create New Circuit";
    }
    return "Manage Circuits"; // Default heading or based on other conditions
  };

  const { createUniversalLogicCircuit } = useUlcircuits();
  const handleAddNewCircuit = async () => {
    console.log(newUniversalLogicCircuit);
    const { success, message } = await createUniversalLogicCircuit(
      newUniversalLogicCircuit
    );
    console.log("Success:", success), console.log("Message", message);
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={10}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"}>
          {getHeadingText()} {/* Use the dynamic heading */}
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
              name="universalCircuitName"
              value={newUniversalLogicCircuit.universalCircuitName}
              onChange={(event) =>
                setNewUniversalLogicCircuit({
                  ...newUniversalLogicCircuit,
                  universalCircuitName: event.target.value,
                })
              }
            />
            <Input
              placeholder="Image URL"
              name="imageUrl"
              value={newUniversalLogicCircuit.imageUrl}
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
