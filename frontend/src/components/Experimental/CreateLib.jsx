import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUlCircuits } from "../../hooks/zustandUlCircuit";
import { useCBCircuits } from "../../hooks/zustandCBCircuit";
import { useMicroCircuits } from "../../hooks/zustandMicroCircuit";
import {
  Box,
  Button,
  Container,
  Input,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import AddText from "./AddText";

function CreateLib() {
  const location = useLocation();

  const circuitType = location.pathname.includes("createcb")
    ? "combinational"
    : location.pathname.includes("createmicro")
    ? "microprocessor"
    : "universal";

  const [newCircuit, setNewCircuit] = useState({
    circuitName: "",
    thumbnailUrl: "",
    content: [],
  });

  const zustandFunctions = {
    combinational: useCBCircuits().createCombiLogicCircuit,
    universal: useUlCircuits().createUniversalLogicCircruit,
    microprocessor: useMicroCircuits().createMicroCircuit,
  };

  const handleAddNewCircuit = async () => {
    const createCircuit = zustandFunctions[circuitType];
    if (createCircuit) {
      const { success, message } = await createCircuit(newCircuit);
      console.log("Success:", success);
      console.log("Message:", message);
      console.log(newCircuit);
    }
  };

  const handleContentChange = (index, event, field = "text") => {
    const updatedContent = [...newCircuit.content];
    updatedContent[index][field] = event.target.value;
    setNewCircuit((prev) => ({ ...prev, content: updatedContent }));
  };

  const handleAddContent = (type) => {
    const newContent = { type };
    if (type === "Text") {
      newContent.text = "";
    } else if (type === "Image") {
      newContent.imageUrl = "";
      newContent.altText = "";
    } else if (type === "TextAndImage") {
      newContent.text = "";
      newContent.imageUrl = "";
      newContent.altText = "";
    }
    setNewCircuit((prev) => ({
      ...prev,
      content: [...prev.content, newContent],
    }));
  };

  const handleDeleteContent = (index) => {
    const updatedContent = [...newCircuit.content];
    updatedContent.splice(index, 1);
    setNewCircuit((prev) => ({ ...prev, content: updatedContent }));
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={10} align="stretch">
        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Circuit Name"
              name="circuitName"
              value={newCircuit.circuitName}
              onChange={(event) =>
                setNewCircuit({
                  ...newCircuit,
                  circuitName: event.target.value,
                })
              }
            />
            <Input
              placeholder="Image URL"
              name="thumbnailUrl"
              value={newCircuit.thumbnailUrl}
              onChange={(event) =>
                setNewCircuit({
                  ...newCircuit,
                  thumbnailUrl: event.target.value,
                })
              }
            />
            <AddText
              content={newCircuit.content}
              onContentChange={handleContentChange}
              onAddContent={handleAddContent}
              onDeleteContent={handleDeleteContent}
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

export default CreateLib;
