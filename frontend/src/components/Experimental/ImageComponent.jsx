import { Container, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ImageComponent = ({ imageUrl, altText }) => {
  //#region Testing different Image sizes
  // Function to generate random image dimensions for testing small and large HD photos
  const getRandomImageSize = () => {
    // Generate random size categories: small (300x200), medium (1280x720), or large (1920x1080)
    const sizeCategory = Math.floor(Math.random() * 4); // 0, 1, or 2

    switch (sizeCategory) {
      case 0:
        return "300/200"; // Small Image
      case 1:
        return "1280/720"; // HD (720p)
      case 2:
        return "1920/1080"; // Full HD (1080p)
      case 3:
        return "3840/2160"; // 4K resolution

      default:
        return "300/200"; // Default to small image
    }
  };

  // Generate a random number (or timestamp) to prevent caching and get a new image each time
  const randomUrl = `https://picsum.photos/${getRandomImageSize()}`;

  //#endregion

  return (
    <Container>
      <Image
        // src = {imageUrl}
        src={randomUrl} // Add the dynamic URL THIS IS FOR TESTING
        alt={altText}
        maxW="100%" // Make the image width responsive
        height="auto" // Maintain aspect ratio
        objectFit="cover" // Ensure the image covers the container without distortion
        borderRadius="md" // Optional: Add rounded corners to the image
        mb={4} // Add margin-bottom to space the text from the image
      />
    </Container>
  );
};

ImageComponent.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  altText: PropTypes.string,
};

export default ImageComponent;
