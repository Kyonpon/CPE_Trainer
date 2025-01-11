import {
  VStack,
  Input,
  Button,
  Select,
  Heading,
  Textarea,
  HStack,
  Collapse,
  Box,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const AddText = ({
  content,
  onContentChange,
  onAddContent,
  onDeleteContent,
}) => {
  const [selectedType, setSelectedType] = useState("Text");

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleAddContent = () => {
    onAddContent(selectedType);
  };

  const [isOpen, setIsOpen] = useState([]);

  useEffect(() => {
    setIsOpen((prev) => [...prev, true]);
  }, [content]);

  const toggleCollapse = (index) => {
    setIsOpen((prev) => prev.map((open, i) => (i === index ? !open : open)));
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack align="stretch">
        <VStack width="50%">
          {content.map((item, index) => (
            <Box key={index} width="100%">
              <Button
                size="md"
                onClick={() => toggleCollapse(index)}
                cursor="pointer"
              >
                {`Content ${index + 1} (${item.type})`}
              </Button>
              <Collapse in={isOpen[index]} animateOpacity>
                <VStack spacing={4} align="stretch" width="100%" mt={4}>
                  {item.type === "Text" && (
                    <Textarea
                      placeholder="Content Text"
                      value={item.text}
                      onChange={(event) => {
                        onContentChange(index, event, "text");
                      }}
                      resize="vertical"
                    ></Textarea>
                  )}
                  {item.type === "Image" && (
                    <>
                      <Input
                        placeholder="Image URL"
                        value={item.imageUrl}
                        onChange={(event) =>
                          onContentChange(index, event, "imageUrl")
                        }
                      />
                      <Input
                        placeholder="Alt Text"
                        value={item.altText}
                        onChange={(event) =>
                          onContentChange(index, event, "altText")
                        }
                      />
                    </>
                  )}
                  {item.type === "TextAndImage" && (
                    <>
                      <Textarea
                        placeholder="Content Text"
                        value={item.text}
                        onChange={(event) => {
                          onContentChange(index, event, "text");
                        }}
                        resize="vertical"
                      ></Textarea>
                      <Input
                        placeholder="Image URL"
                        value={item.imageUrl}
                        onChange={(event) =>
                          onContentChange(index, event, "imageUrl")
                        }
                      />
                      <Input
                        placeholder="Alt Text"
                        value={item.altText}
                        onChange={(event) =>
                          onContentChange(index, event, "altText")
                        }
                      />
                    </>
                  )}
                  {item.type === "Code" && (
                    <Textarea
                      placeholder="Content Code"
                      value={item.code}
                      onChange={(event) => {
                        onContentChange(index, event, "code");
                      }}
                      resize="vertical"
                    ></Textarea>
                  )}
                  <Button
                    colorScheme="red"
                    onClick={() => onDeleteContent(index)}
                  >
                    Delete
                  </Button>
                </VStack>
              </Collapse>
            </Box>
          ))}
        </VStack>

        <VStack width="50%">
          <Heading>Select Content Type</Heading>
          <Select value={selectedType} onChange={handleTypeChange}>
            <option value="Text">Text</option>
            <option value="Image">Image</option>
            <option value="TextAndImage">Text and Image</option>
            <option value="Code">Code</option>
          </Select>
          <Button colorScheme="blue" onClick={handleAddContent} width="100%">
            Add Content
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
};

AddText.propTypes = {
  content: PropTypes.array.isRequired,
  onContentChange: PropTypes.func.isRequired,
  onAddContent: PropTypes.func.isRequired,
  onDeleteContent: PropTypes.func.isRequired,
};

export default AddText;
