import { VStack, Input, Button, Select } from "@chakra-ui/react";
import { useState } from "react";

const AddText = ({ content, onContentChange, onAddContent }) => {
  const [selectedType, setSelectedType] = useState("Text"); // Track the selected content type

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleAddContent = () => {
    onAddContent(selectedType);
  };

  return (
    <VStack spacing={4}>
      {content.map((item, index) => {
        if (item.type === "Text") {
          return (
            <Input
              key={index}
              placeholder="Content Text"
              value={item.text}
              onChange={(event) => onContentChange(index, event)}
            />
          );
        }
        if (item.type === "Image") {
          return (
            <VStack key={index} spacing={2}>
              <Input
                placeholder="Image URL"
                value={item.imageUrl}
                onChange={(event) => onContentChange(index, event, "imageUrl")}
              />
              <Input
                placeholder="Alt Text"
                value={item.altText}
                onChange={(event) => onContentChange(index, event, "altText")}
              />
            </VStack>
          );
        }
        if (item.type === "TextAndImage") {
          return (
            <VStack key={index} spacing={2}>
              <Input
                placeholder="Content Text"
                value={item.text}
                onChange={(event) => onContentChange(index, event, "text")}
              />
              <Input
                placeholder="Image URL"
                value={item.imageUrl}
                onChange={(event) => onContentChange(index, event, "imageUrl")}
              />
              <Input
                placeholder="Alt Text"
                value={item.altText}
                onChange={(event) => onContentChange(index, event, "altText")}
              />
            </VStack>
          );
        }
        return null;
      })}

      {/* Dropdown to select the type */}
      <Select
        placeholder="Select Content Type"
        value={selectedType}
        onChange={handleTypeChange}
      >
        <option value="Text">Text</option>
        <option value="Image">Image</option>
        <option value="TextAndImage">Text and Image</option>
      </Select>

      {/* Add Button */}
      <Button colorScheme="blue" onClick={handleAddContent}>
        Add Content
      </Button>
    </VStack>
  );
};

export default AddText;
