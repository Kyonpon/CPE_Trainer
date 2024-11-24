import { VStack, Input, Button } from "@chakra-ui/react";

const AddText = ({ content, onContentChange, onAddContent }) => {
  return (
    <VStack spacing={4}>
      {content.map((item, index) => (
        <Input
          key={index}
          placeholder="Content Text"
          value={item.text}
          onChange={(event) => onContentChange(index, event)}
        />
      ))}
      <Button colorScheme="blue" onClick={onAddContent}>
        Add Content
      </Button>
    </VStack>
  );
};

export default AddText;
