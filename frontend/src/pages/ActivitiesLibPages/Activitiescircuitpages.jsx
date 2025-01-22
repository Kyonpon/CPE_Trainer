import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useCBCircuits } from "../../hooks/zustandCBCircuit";
import { useMicroCircuits } from "../../hooks/zustandMicroCircuit";
import { useEffect, useState } from "react";
import TextAndImageComponent from "../../components/ActivitiesLibComponents/ActivityPageComponents/TextAndImageComponent";
import TextComponent from "../../components/ActivitiesLibComponents/ActivityPageComponents/TextComponent";
import AddContentType from "../../components/ActivitiesLibComponents/ActivityPageComponents/AddContentType";
import ImageComponent from "../../components/ActivitiesLibComponents/ActivityPageComponents/ImageComponent";
import CodeComponent from "../../components/ActivitiesLibComponents/ActivityPageComponents/CodeComponent";

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
function Activitiescircuitpages({ circuitType }) {
  const [fetchedCircuitContent, setFetchedCircuitContent] = useState([]); // Container for circuit content
  const [fetchedCircuit, setFetchedCircuit] = useState(null); // Container for circuit document
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false); // Show/hide update buttons
  const [selectedContent, setSelectedContent] = useState(null); // Content being updated

  const { id } = useParams(); // Gets the ID in the URL

  const cbcStore = useCBCircuits();
  const microStore = useMicroCircuits();

  const store = circuitType === "CB" ? cbcStore : microStore;

  const {
    fetchSingleCircuit,
    updateAddContent,
    deleteSingleContent,
    updateContent,
  } = store;

  const [formData, setFormData] = useState({
    text: "",
    imageUrl: "",
    altText: "",
    code: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateNewContent, setUpdateNewContent] = useState({
    content: [],
  });

  //#region CONTENT HANDLING
  const handleContentChange = (index, event, field = "text") => {
    const updatedContent = [...updateNewContent.content];
    updatedContent[index][field] = event.target.value;
    setUpdateNewContent({
      ...updateNewContent,
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
    } else if (type === "Code") {
      newContent.code = "";
    }
    setUpdateNewContent((prev) => ({
      ...prev,
      content: [...prev.content, newContent],
    }));
  };

  const handleUpdateDeleteContent = (index) => {
    const updatedContent = [...updateNewContent.content];
    updatedContent.splice(index, 1);
    setUpdateNewContent({
      ...updateNewContent,
      content: updatedContent,
    });
  };

  const handleUpdateNewContent = async () => {
    const circuitId = id;
    const { content } = updateNewContent;

    for (const item of content) {
      if (item.type === "Text" && !item.text?.trim()) {
        alert("Text content cannot be empty.");
        return;
      }
      if (
        item.type === "Image" &&
        (!item.imageUrl?.trim() || !item.altText?.trim())
      ) {
        alert("Image URL and Alt Text cannot be empty.");
        return;
      }
      if (
        item.type === "TextAndImage" &&
        (!item.text?.trim() || !item.imageUrl?.trim() || !item.altText?.trim())
      ) {
        alert("Text, Image URL, and Alt Text cannot be empty.");
        return;
      }
      if (item.type === "Code" && !item.code?.trim()) {
        alert("Code content cannot be empty.");
        return;
      }

      const newContent = {
        type: item.type,
        ...(item.text && { text: item.text }),
        ...(item.imageUrl && { imageUrl: item.imageUrl }),
        ...(item.altText && { altText: item.altText }),
        ...(item.code && { code: item.code }),
      };

      const response = await updateAddContent(circuitId, item.type, newContent);

      if (!response?.success) {
        alert(
          `Failed to add content: ${response?.message || "FE, Unknown error"}`
        );
        return;
      }
    }

    alert("All content added successfully!");
  };

  //#endregion

  const fetchCircuit = async () => {
    if (!id) {
      console.error("Wrong URL Format");
      return;
    }

    try {
      const fetchedData = await fetchSingleCircuit(id);
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

  useEffect(() => {
    fetchCircuit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      case "Code":
        return <CodeComponent key={contentItem._id} code={contentItem.code} />;
      default:
        return null;
    }
  };

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

  const handleOpenModal = (contentItem) => {
    setSelectedContent(contentItem);
    setFormData({
      text: contentItem.text || "",
      imageUrl: contentItem.imageUrl || "",
      altText: contentItem.altText || "",
      code: contentItem.code || "",
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

  const handleSubmit = async () => {
    if (!selectedContent || !selectedContent._id) {
      console.error("No content selected for update.");
      return;
    }

    const payload = {
      contentId: selectedContent._id,
      ...formData,
    };

    try {
      const { success, message, data } = await updateContent(
        fetchedCircuit._id,
        selectedContent._id,
        payload
      );

      if (success) {
        setFetchedCircuitContent((prevContent) =>
          prevContent.map((item) =>
            item._id === selectedContent._id ? { ...item, ...data } : item
          )
        );

        await fetchCircuit();
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
            {selectedContent?.type === "Code" && (
              <Textarea
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Enter Code"
                mb={3}
              ></Textarea>
            )}
            <Button colorScheme="teal" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </ModalContent>
      </Modal>

      <Button
        colorScheme="teal"
        mb={4}
        onClick={() => {
          setShowAdditionalButtons(!showAdditionalButtons);
        }}
      >
        {showAdditionalButtons ? "Hide Edit" : "Edit Content"}
      </Button>

      <VStack align="stretch" spacing={1}>
        {fetchedCircuitContent.map((item) => (
          <Box key={item._id} borderRadius="md" boxShadow="sm">
            <HStack align="center">
              <Box flex="1">{renderContent(item)}</Box>

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

      {/*This is where it updates and add new content*/}
      {showAdditionalButtons && (
        <Box
          mt={4}
          p={4}
          border="1px solid teal"
          borderRadius="md"
          boxShadow="md"
        >
          <Text fontSize={"3xl"} textAlign={"center"}>
            This is for Adding new content
          </Text>

          <AddContentType
            content={updateNewContent.content}
            onContentChange={handleContentChange}
            onAddContent={handleAddContent}
            onDeleteContent={handleUpdateDeleteContent}
          ></AddContentType>

          <Button
            colorScheme="blue"
            w="full"
            onClick={handleUpdateNewContent}
            mt={2}
          >
            Create!
          </Button>
        </Box>
      )}
    </div>
  );
}

// Add PropTypes validation
Activitiescircuitpages.propTypes = {
  circuitType: PropTypes.oneOf(["CB", "Micro"]).isRequired,
};

export default Activitiescircuitpages;
