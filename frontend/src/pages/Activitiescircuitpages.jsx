import { useParams } from "react-router-dom";
import { useCBCircuits } from "../hooks/zustandCBCircuit";
import { useEffect, useState } from "react";
import TextAndImageComponent from "../components/Experimental/TextAndImageComponent";
import TextComponent from "../components/Experimental/TextComponent";
import ImageComponent from "../components/Experimental/ImageComponent";
import { Box, Button, HStack, VStack, Text } from "@chakra-ui/react";
import TestingDialog from "../components/Experimental/TestingDialogBox";

function Activitiescircuitpages() {
  const { id } = useParams();
  const { fetchSingleCBCircuit } = useCBCircuits();
  const [fetchedCircuitContent, setFetchedCircuitContent] = useState([]);
  const [fetchedCircuit, setFetchedCircuit] = useState(null);
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);

  useEffect(() => {
    const fetchCircuit = async () => {
      if (!id) {
        console.error("Wrong URL Format");
        return;
      }

      try {
        const fetchedData = await fetchSingleCBCircuit(id);
        console.log("Fetched Data:", fetchedData);

        if (fetchedData?.content && fetchedData.content.length > 0) {
          setFetchedCircuit(fetchedData);
          setFetchedCircuitContent(fetchedData.content);
        } else {
          console.error("No content found in the fetched circuit.");
        }
      } catch (error) {
        console.error("Error in fetching circuit:", error);
      }
    };

    fetchCircuit();
  }, [id]);

  const renderContent = (contentItem) => {
    switch (contentItem.type) {
      case "Text":
        return <TextComponent key={contentItem._id} text={contentItem.text} />;
      case "Image":
        return (
          <ImageComponent
            key={contentItem._id}
            imageUrl={contentItem.imageUrl}
            altText={contentItem.altText}
          />
        );
      case "TextAndImage":
        return (
          <TextAndImageComponent
            key={contentItem._id}
            text={contentItem.text}
            imageUrl={contentItem.imageUrl}
            altText={contentItem.altText}
          />
        );
      default:
        return null;
    }
  };

  const { deleteSingleContent } = useCBCircuits();
  const handleDeleteContent = async (contentItem) => {
    if (!contentItem._id) {
      console.log("Error in deleting Content no Content ID provided");
      return;
    }
    try {
      const deleteThisContent = await deleteSingleContent(
        fetchedCircuit._id,
        contentItem._id
      );
      if (deleteThisContent) {
        console.log("Content Deleted");

        // Update the state to remove the deleted item
        setFetchedCircuitContent((prevContent) =>
          prevContent.filter((item) => item._id !== contentItem._id)
        );
      } else {
        console.log("Failed to delete", fetchedCircuit._id, contentItem._id);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  return (
    <div>
      <h1>Activity Page</h1>
      <p>Activity ID: {id}</p>

      <Button
        colorScheme="teal"
        mb={4}
        onClick={() => {
          setShowAdditionalButtons(!showAdditionalButtons);
        }}
      >
        {showAdditionalButtons ? "Hide Edit" : "Edit Content"}
      </Button>

      <VStack align="stretch" spacing={4}>
        {fetchedCircuitContent.map((item) => (
          <Box key={item._id} borderRadius="md" p={4} boxShadow="sm">
            <HStack align="center">
              {/* Render content */}
              <Box flex="1">{renderContent(item)}</Box>

              {/* Conditionally render buttons on the right */}
              {showAdditionalButtons && (
                <VStack spacing={2}>
                  <Button colorScheme="teal" size="sm">
                    Update
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => {
                      handleDeleteContent(item);
                    }}
                  >
                    Delete
                  </Button>
                </VStack>
              )}
            </HStack>
          </Box>
        ))}
      </VStack>

      {showAdditionalButtons && (
        <Box
          mt={4}
          p={4}
          border="1px solid teal"
          borderRadius="md"
          boxShadow="md"
        >
          <Text fontSize={"3xl"} textAlign={"center"}>
            {" "}
            This is for Adding new content{" "}
          </Text>
          <TestingDialog></TestingDialog>
        </Box>
      )}
    </div>
  );
}

export default Activitiescircuitpages;
