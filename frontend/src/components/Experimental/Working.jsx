import React from "react";

function CreateLib() {
  const [newCombinationalLogicCircuit, setNewCombinationalLogicCircuit] =
    useState({
      circuitName: "",
      thumbnailUrl: "",
      content: [],
    });

  const location = useLocation();
  const { createCombiLogicCircuit } = useCBCircuits();

  const handleAddNewCircuit = async () => {
    const { success, message } = await createCombiLogicCircuit(
      newCombinationalLogicCircuit
    );
    console.log("Success: ", success);
    console.log("Message:", message);
    console.log(newCombinationalLogicCircuit);
  };

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
      newContent.ImageUrl = "";
      newContent.altText = "";
    } else if (type === "TextandImage") {
      newContent.text = "";
      newContent.ImageUrl = "";
      newContent.altText = "";
    }
    setNewCombinationalLogicCircuit((prev) => ({
      ...prev,
      content: [...prev.content, newContent],
    }));
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
