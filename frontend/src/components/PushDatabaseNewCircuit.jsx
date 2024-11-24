import {
  Box,
  Container,
  Input,
  useColorModeValue,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUlCircuits } from "../hooks/zustandUlCircuit";
import { useCBCircuits } from "../hooks/zustandCBCircuit";
import { useLocation } from "react-router-dom";

function PushDatabaseNewCircuit_try() {
  const [newUniversalLogicCircuit, setNewUniversalLogicCircuit] = useState({
    universalCircuitName: "",
    imageUrl: "",
  });

  const [newCombinationalLogicCircuit, setNewCombinationalLogicCircuit] =
    useState({
      combiLogicCircuitName: "",
      imageUrl: "",
    });

  const location = useLocation();
  const { createUniversalLogicCircuit } = useUlCircuits();
  const { createCombiLogicCircuit } = useCBCircuits();

  const handleAddNewCircuit = async () => {
    const path = location.pathname;
    if (path.includes("createcb")) {
      const { success, message } = await createCombiLogicCircuit(
        newCombinationalLogicCircuit
      );
      console.log("Success:", success);
      console.log("Message:", message);
    } else if (path.includes("createul")) {
      const { success, message } = await createUniversalLogicCircuit(
        newUniversalLogicCircuit
      );
      console.log("Success:", success);
      console.log("Message:", message);
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={10}>
        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            {(() => {
              if (location.pathname.includes("createcb")) {
                return (
                  <>
                    <Input
                      placeholder="Circuit Name"
                      name="combiLogicCircuitName"
                      value={newCombinationalLogicCircuit.combiLogicCircuitName}
                      onChange={(event) =>
                        setNewCombinationalLogicCircuit({
                          ...newCombinationalLogicCircuit,
                          combiLogicCircuitName: event.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Image URL"
                      name="imageUrl"
                      value={newCombinationalLogicCircuit.imageUrl}
                      onChange={(event) =>
                        setNewCombinationalLogicCircuit({
                          ...newCombinationalLogicCircuit,
                          imageUrl: event.target.value,
                        })
                      }
                    />
                  </>
                );
              }
              if (location.pathname.includes("createul")) {
                return (
                  <>
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
                  </>
                );
              }
              return null; // Return null if no conditions are met
            })()}
            <Button colorScheme="blue" w="full" onClick={handleAddNewCircuit}>
              Create!
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default PushDatabaseNewCircuit_try;
