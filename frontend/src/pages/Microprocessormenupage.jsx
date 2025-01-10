import {
  Box,
  Button,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import CreateCard from "../components/CreateCard";
import { useMicroCircuits } from "../hooks/zustandMicroCircuit"; // Ensure you update the import path
import { useEffect, useState } from "react";
import UniversalLogicCard from "../components/UniversalLogicCard";
import EditMenuPageCard from "../components/Experimental/EditMenuPageCard";

function Microprocessormenupage() {
  const { fetchMicroCircuits, microCircuit } = useMicroCircuits();
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null); // State holder for what the modal is updating
  const [formData, setFormData] = useState({
    circuitName: "",
    thumbnailUrl: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  //#region Update content
  const handleOpenModal = (contentItem) => {
    console.log("Opening modal for content:", contentItem);
    setSelectedContent(contentItem);
    setFormData({
      circuitName: contentItem.circuitName || "",
      thumbnailUrl: contentItem.thumbnailUrl || "",
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

  const { updateCircuit } = useMicroCircuits();
  const handleSubmit = async () => {
    if (!selectedContent || !selectedContent._id) {
      console.error("No Circuit selected for update.");
      return;
    }

    const payload = {
      ...formData,
    };

    try {
      const { success, message, data } = await updateCircuit(
        selectedContent._id,
        payload
      );

      if (success) {
        console.log("Content successfully updated:", data);

        await fetchMicroCircuits();

        onClose();
      } else {
        console.error("Failed to update content:", message);
      }
    } catch (error) {
      console.error("Error during content update:", error);
    }
  };

  const { deleteCircuit } = useMicroCircuits();
  const handleDeleteCircuit = async (contentItem) => {
    if (!contentItem._id) {
      console.log("Error in deleting Content: no Content ID provided");
      return;
    }
    try {
      const deleteThisContent = await deleteCircuit(contentItem._id);
      if (deleteThisContent) {
        console.log(contentItem._id);
        console.log("Content Deleted");
        fetchMicroCircuits();
      } else {
        console.log("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  useEffect(() => {
    // Only fetch circuits if the array is empty
    if (microCircuit.length === 0) {
      fetchMicroCircuits();
    }
  }, [fetchMicroCircuits, microCircuit.length]);

  console.log("Microprocessor Circuits", microCircuit);

  return (
    <Box p={4}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Content</ModalHeader>
          <ModalCloseButton />
          <Box p={4}>
            <Input
              name="circuitName"
              value={formData.circuitName}
              onChange={handleInputChange}
              placeholder="New Circuit Name"
              mb={3}
            />
            <Input
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleInputChange}
              placeholder="New Thumbnail URL"
            />
            <Button colorScheme="teal" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </ModalContent>
      </Modal>

      <h1>Microprocessor Circuits</h1>
      <Box display="flex" justifyContent="center" gap="20px" flexFlow="wrap">
        {microCircuit.map((microLogic) => (
          <Box key={microLogic._id} width="300px">
            <UniversalLogicCard
              circuitId={microLogic._id}
              url={`/microcircuit/${microLogic._id}`}
              imgurl={microLogic.thumbnailUrl}
              imgurlalt={microLogic.circuitName}
              title={microLogic.circuitName}
              showAdditionalButtons={showAdditionalButtons}
              onUpdate={() => {
                handleOpenModal(microLogic);
              }}
              OnDelete={() => {
                handleDeleteCircuit(microLogic);
              }}
            />
          </Box>
        ))}
        <CreateCard url="/createmicro" title="Create New Circuit" />
        <EditMenuPageCard
          showAdditionalButtons={showAdditionalButtons}
          setShowAdditionalButtons={setShowAdditionalButtons}
        />
      </Box>
    </Box>
  );
}

export default Microprocessormenupage;
