import {
  Box,
  Container,
  Input,
  useColorModeValue,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUlCircuits } from "../../hooks/zustandUlCircuit";
import { useCBCircuits } from "../../hooks/zustandCBCircuit";
import { useLocation } from "react-router-dom";

function PushDatabaseNewCircuit_try() {
  const [newUniversalLogicCircuit, setNewUniversalLogicCircuit] = useState({
    universalCircuitName: "",
    thumbnailUrl: "",
    content: [
      {
        type: "Text",
        text: "", // Default value for content text
      },
    ],
  });

  const [newCombinationalLogicCircuit, setNewCombinationalLogicCircuit] =
    useState({
      circuitName: "",
      thumbnailUrl: "",
      content: [
        {
          type: "Text",
          text: "", // Default value for content text
        },
      ],
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
      console.log(newCombinationalLogicCircuit);
    } else if (path.includes("createul")) {
      const { success, message } = await createUniversalLogicCircuit(
        newUniversalLogicCircuit
      );
      console.log("Success:", success);
      console.log("Message:", message);
    }
  };

  //#region CONTENT STUFF1
  const handleContentChange = (index, event) => {
    const updatedContent = [...newCombinationalLogicCircuit.content];
    updatedContent[index].text = event.target.value;
    setNewCombinationalLogicCircuit({
      ...newCombinationalLogicCircuit,
      content: updatedContent,
    });
  };

  const handleAddContent = () => {
    const updatedContent = [
      ...newCombinationalLogicCircuit.content,
      {
        type: "Text",
        text: "", // Add an empty text field for new content
      },
    ];
    setNewCombinationalLogicCircuit({
      ...newCombinationalLogicCircuit,
      content: updatedContent,
    });
  };
  //#endregion

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
                      name="circuitName"
                      value={newCombinationalLogicCircuit.circuitName}
                      onChange={(event) =>
                        setNewCombinationalLogicCircuit({
                          ...newCombinationalLogicCircuit,
                          circuitName: event.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Image URL"
                      name="thumbnailUrl"
                      value={newCombinationalLogicCircuit.thumbnailUrl}
                      onChange={(event) =>
                        setNewCombinationalLogicCircuit({
                          ...newCombinationalLogicCircuit,
                          thumbnailUrl: event.target.value,
                        })
                      }
                    />
                    {/* #region Content inputs */}
                    {newCombinationalLogicCircuit.content.map(
                      (content, index) => (
                        <Input
                          key={index}
                          placeholder="Content Text"
                          value={content.text}
                          onChange={(event) =>
                            handleContentChange(index, event)
                          }
                        />
                      )
                    )}
                    <Button colorScheme="blue" onClick={handleAddContent}>
                      Add Content
                    </Button>
                    {/*#endregion*/}
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
                      name="thumbnailUrl"
                      value={newUniversalLogicCircuit.thumbnailUrl}
                      onChange={(event) =>
                        setNewUniversalLogicCircuit({
                          ...newUniversalLogicCircuit,
                          thumbnailUrl: event.target.value,
                        })
                      }
                    />
                    {/* Content inputs */}
                    {newUniversalLogicCircuit.content.map((content, index) => (
                      <Input
                        key={index}
                        placeholder="Content Text"
                        value={content.text}
                        onChange={(event) => handleContentChange(index, event)}
                      />
                    ))}
                    <Button colorScheme="blue" onClick={handleAddContent}>
                      Add Content
                    </Button>
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
