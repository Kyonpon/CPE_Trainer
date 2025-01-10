import { Container, Flex, useColorMode, Text, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";

const TextAndImageComponent = ({ text, imageUrl, altText }) => {
  const { colorMode } = useColorMode();

  const bgColor = colorMode === "dark" ? "gray.700 " : "#ababaf";
  const textColor = colorMode === "dark" ? "white" : "black";

  return (
    <Container
      bg={bgColor}
      p={4}
      borderRadius="md"
      maxWidth="100%"
      width="95%"
      mt={2}
      mb={2}
    >
      <Flex
        alignItems={"center"}
        justifyContent={"space-around"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
        gap={2}
      >
        <Text fontSize="2xl" color={textColor}>
          {text}
        </Text>

        <Image
          // src = {imageUrl}
          src={imageUrl} // Add the dynamic URL THIS IS FOR TESTING
          alt={altText}
          maxW="100%" // Make the image width responsive
          height="auto" // Maintain aspect ratio
          objectFit="cover" // Ensure the image covers the container without distortion
          borderRadius="md" // Optional: Add rounded corners to the image
          mb={4} // Add margin-bottom to space the text from the image
        />
      </Flex>
    </Container>
  );
};

TextAndImageComponent.propTypes = {
  text: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  altText: PropTypes.string,
};

export default TextAndImageComponent;
