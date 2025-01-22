import { Container, Text, useColorMode } from "@chakra-ui/react";
import PropTypes from "prop-types";

const TextComponent = ({ text }) => {
  const { colorMode } = useColorMode();

  const bgColor = colorMode === "dark" ? "gray.700" : "#ababaf";
  const textColor = colorMode === "dark" ? "white" : "black";

  return (
    <Container bg={bgColor} p={4} borderRadius="md" maxWidth="100%" width="95%">
      <Text
        fontSize="2xl"
        color={textColor}
        whiteSpace="pre-wrap" // Preserves line breaks and spaces
        wordBreak="break-word" // Handles long words or URLs
      >
        {text}
      </Text>
    </Container>
  );
};

TextComponent.propTypes = {
  text: PropTypes.string.isRequired,
};

export default TextComponent;
