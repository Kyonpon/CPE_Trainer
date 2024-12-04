import { useParams } from "react-router-dom";
import { useCBCircuits } from "../hooks/zustandCBCircuit";
import { useEffect, useState } from "react";
import TextAndImageComponent from "../components/Experimental/TextAndImageComponent";
import TextComponent from "../components/Experimental/TextComponent";
import ImageComponent from "../components/Experimental/ImageComponent";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Input,
  Textarea,
} from "@chakra-ui/react";

function Activitiescircuitpages() {
  const { id } = useParams(); //Gets the ID in the url
  const { fetchSingleCBCircuit } = useCBCircuits(); //Used in fetchCircuit function
  const [fetchedCircuitContent, setFetchedCircuitContent] = useState([]); //Container for the array content of the fetchedCircuit
  const [fetchedCircuit, setFetchedCircuit] = useState(null); //Container for the whole document of the fetchedCircuit
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false); //State holder to if the update buttons are shown
  const [selectedContent, setSelectedContent] = useState(null); //State holder for what the modal is updating
  const [formData, setFormData] = useState({
    text: "",
    imageUrl: "",
    altText: "",
  }); //Modal Form (This is will be converted to json using the zustand function)

  const { isOpen, onOpen, onClose } = useDisclosure();

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
        setFetchedCircuitContent(fetchedData.content); // Update the state with the latest content
      } else {
        console.error("No content found in the fetched circuit.");
      }
    } catch (error) {
      console.error("Error in fetching circuit:", error);
    }
  };

  //#region Fetching the content of the circuit
  useEffect(() => {
    fetchCircuit();
  }, [id]);

  //#region Dynamically display the right component
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

  //#region Delete content
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

  //#region Update content
  const handleOpenModal = (contentItem) => {
    setSelectedContent(contentItem);
    setFormData({
      text: contentItem.text || "",
      imageUrl: contentItem.imageUrl || "",
      altText: contentItem.altText || "",
    });
    onOpen();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { updateContent } = useCBCircuits();
  const handleSubmit = async () => {
    if (!selectedContent || !selectedContent._id) {
      console.error("No content selected for update.");
      return;
    }

    const payload = {
      contentId: selectedContent._id,
      ...formData, // Includes fields like text, imageUrl, and altText
    };

    try {
      const { success, message, data } = await updateContent(
        fetchedCircuit._id,
        selectedContent._id,
        payload
      );

      if (success) {
        console.log("Content successfully updated:", data);

        // Update the specific item in the state dynamically
        setFetchedCircuitContent((prevContent) =>
          prevContent.map((item) =>
            item._id === selectedContent._id ? { ...item, ...data } : item
          )
        );

        await fetchCircuit();
        // Close the modal after update
        onClose();
      } else {
        console.error("Failed to update content:", message);
      }
    } catch (error) {
      console.error("Error during content update:", error);
    }
  };

  return (
    <div>
      <h1>Activity Page</h1>
      <p>Activity ID: {id}</p>

      {/* Update Content Window */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Content</ModalHeader>
          <ModalCloseButton />
          <Box p={4}>
            {selectedContent?.type === "Text" && (
              <Textarea
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                placeholder="Enter text"
                mb={3}
              />
            )}
            {selectedContent?.type === "Image" && (
              <>
                <Input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  mb={3}
                />
                <Input
                  name="altText"
                  value={formData.altText}
                  onChange={handleInputChange}
                  placeholder="Enter alt text"
                  mb={3}
                />
              </>
            )}
            {selectedContent?.type === "TextAndImage" && (
              <>
                <Textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  placeholder="Enter text"
                  mb={3}
                />
                <Input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  mb={3}
                />
                <Input
                  name="altText"
                  value={formData.altText}
                  onChange={handleInputChange}
                  placeholder="Enter alt text"
                  mb={3}
                />
              </>
            )}
            <Button colorScheme="teal" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </ModalContent>
      </Modal>

      {/* show Update Content Options */}
      <Button
        colorScheme="teal"
        mb={4}
        onClick={() => {
          setShowAdditionalButtons(!showAdditionalButtons);
        }}
      >
        {showAdditionalButtons ? "Hide Edit" : "Edit Content"}
      </Button>

      {/* Each Box for the Content */}
      <VStack align="stretch" spacing={4}>
        {fetchedCircuitContent.map((item) => (
          <Box key={item._id} borderRadius="md" p={4} boxShadow="sm">
            <HStack align="center">
              {/* Render content */}
              <Box flex="1">{renderContent(item)}</Box>

              {/* Conditionally render buttons on the right */}
              {showAdditionalButtons && (
                <VStack spacing={2}>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handleOpenModal(item)}
                  >
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
        </Box>
      )}
    </div>
  );
}

export default Activitiescircuitpages;
