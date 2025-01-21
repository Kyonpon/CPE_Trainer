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
import { useCBCircuits } from "../hooks/zustandCBCircuit";
import { useEffect, useState } from "react";
import UniversalLogicCard from "../components/UniversalLogicCard";
import EditMenuPageCard from "../components/Experimental/EditMenuPageCard";
import { useLogin } from "../hooks/zustandUsers";

function Combinationallogicmenupage() {
  const { fetchCBCircuits, combiLogicCircuit } = useCBCircuits();
  const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null); //State holder for what the modal is updating
  const [formData, setFormData] = useState({
    circuitName: "",
    thumbnailUrl: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { admin } = useLogin();
  const [editable, setEditable] = useState(false);

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

  const { updateCircuit } = useCBCircuits();
  const handleSubmit = async () => {
    if (!selectedContent || !selectedContent._id) {
      console.error("No Circuit selected for update.");
      return;
    }

    const payload = {
      ...formData, // Includes fields like text, imageUrl, and altText
    };

    try {
      const { success, message, data } = await updateCircuit(
        selectedContent._id,
        payload
      );

      if (success) {
        console.log("Content successfully updated:", data);

        await fetchCBCircuits();

        onClose();
      } else {
        console.error("Failed to update content:", message);
      }
    } catch (error) {
      console.error("Error during content update:", error);
    }
  };

  const { deleteCircuit } = useCBCircuits();
  const handleDeleteCircuit = async (contentItem) => {
    if (!contentItem._id) {
      console.log("Error in deleting Content no Content ID provided");
      return;
    }
    try {
      const deleteThisContent = await deleteCircuit(contentItem._id);
      if (deleteThisContent) {
        console.log(contentItem._id);
        console.log("Content Deleted");
        fetchCBCircuits();
      } else {
        console.log("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };
  useEffect(() => {
    // Only fetch circuits if the array is empty
    if (combiLogicCircuit.length === 0) {
      fetchCBCircuits();
    }
    setEditable(admin);
  }, [fetchCBCircuits, combiLogicCircuit.length]);

  console.log("CB Circuits", combiLogicCircuit);
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
            ></Input>
            <Input
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleInputChange}
              placeholder="New Thumbnail URL"
            ></Input>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </ModalContent>
      </Modal>

      <h1>Combinational Logic Circuits</h1>
      <Box display="flex" justifyContent="center" gap="20px" flexFlow="wrap">
        {combiLogicCircuit.map((combiLogic) => (
          <Box key={combiLogic._id} width="300px">
            <UniversalLogicCard
              circuitId={combiLogic._id}
              url={`/cbcircuit/${combiLogic._id}`}
              imgurl={combiLogic.thumbnailUrl}
              imgurlalt={combiLogic.combiLogicCircuitName}
              title={combiLogic.circuitName}
              showAdditionalButtons={showAdditionalButtons}
              onUpdate={() => {
                handleOpenModal(combiLogic);
              }}
              OnDelete={() => {
                handleDeleteCircuit(combiLogic);
              }}
            ></UniversalLogicCard>
          </Box>
        ))}
        {editable && (
          <>
            <CreateCard url="/createcb" title="Create New Circuit"></CreateCard>
            <EditMenuPageCard
              showAdditionalButtons={showAdditionalButtons}
              setShowAdditionalButtons={setShowAdditionalButtons}
            ></EditMenuPageCard>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Combinationallogicmenupage;
