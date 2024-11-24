import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUlCircuits } from "../../hooks/zustandUlCircuit";
import { useCBCircuits } from "../../hooks/zustandCBCircuit";
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
  const location = useLocation(); //This is used to determined what Create is the page

  //#region States in Create
  const [newUniversalLogicCircuit, setNewUniversalLogicCircuit] = useState({
    universalCircuitName: "",
    thumbnailUrl: "",
    content: [
      {
        type: "Text",
        text: "",
      },
    ],
  });

  const [newCombinationalLogicCircuit, setNewCombinationalLogicCircuit] =
    useState({
      //combinationalCircuitName: "",
      circuitName: "",
      thumbnailUrl: "",
      content: [],
    });

  const [newMicroprocessorCircuit, setNewMicroprocessorCircuit] = useState({
    microprocessorCircuitName: "",
    thumbnailUrl: "",
    content: [{ type: "Text", text: "" }],
  });

  //#endrgion

  //#region Zustand calls
  const { createUniversalLogicCircruit } = useUlCircuits();
  const { createCombiLogicCircuit } = useCBCircuits();

  //TO DO:
  //const {createMicroCircuit} = useMicroCircuits();

  const handleAddNewCircuit = async () => {
    const path = location.pathname;
    if (path.includes("createcb")) {
      const { success, message } = await createCombiLogicCircuit(
        newCombinationalLogicCircuit
      );
      console.log("Success: ", success);
      console.log("Message:", message);
      console.log(newCombinationalLogicCircuit);
    } else if (path.includes("createul")) {
      const { success, message } = await createUniversalLogicCircruit(
        newUniversalLogicCircuit
      );
      console.log("Success: ", success);
      console.log("Message:", message);
      console.log(newUniversalLogicCircuit);
    } else if (path.includes("createmicro")) {
      console.log("Create Micro");
    }
  };
  //#endregion

  //#region CONTENT STUFF1
  const handleContentChange = (index, event, field = "text") => {
    const updatedContent = [...newCombinationalLogicCircuit.content];
    updatedContent[index][field] = event.target.value;
    setNewCombinationalLogicCircuit({
      ...newCombinationalLogicCircuit,
      content: updatedContent,
    });
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
    setNewCombinationalLogicCircuit((prev) => ({
      ...prev,
      content: [...prev.content, newContent],
    }));
  };
  //#endregion

  const handleDeleteContent = (index) => {
    const updatedContent = [...newCombinationalLogicCircuit.content];
    updatedContent.splice(index, 1); // Remove content at the specified index
    setNewCombinationalLogicCircuit({
      ...newCombinationalLogicCircuit,
      content: updatedContent,
    });
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
            {location.pathname.includes("createcb") && (
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
                <AddText
                  content={newCombinationalLogicCircuit.content}
                  onContentChange={handleContentChange}
                  onAddContent={handleAddContent}
                  onDeleteContent={handleDeleteContent}
                />
              </>
            )}
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
