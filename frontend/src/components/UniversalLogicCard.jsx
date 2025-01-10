import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Button,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
function UniversalLogicCard(props) {
  return (
    <Card maxW="300px" height="100%" display="flex" flexDirection="column">
      <CardBody
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Link to={props.url}>
          {" "}
          <Image
            boxSize="250px"
            src={props.imgurl}
            alt={props.imgurlalt}
            borderRadius="lg"
            objectFit="cover"
          />
        </Link>

        <Stack mt="6" spacing="3" flexGrow={1} justify="space-between">
          <Heading size="xl" textAlign="center">
            {props.title}
          </Heading>{" "}
          {props.showAdditionalButtons && (
            <VStack spacing={2}>
              <Button colorScheme="teal" size="sm" onClick={props.onUpdate}>
                Update
              </Button>
              <Button colorScheme="red" size="sm" onClick={props.OnDelete}>
                Delete
              </Button>
            </VStack>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}

UniversalLogicCard.propTypes = {
  url: PropTypes.string,
  imgurl: PropTypes.string,
  imgurlalt: PropTypes.string,
  title: PropTypes.string,
  showAdditionalButtons: PropTypes.bool,
  circuitId: PropTypes.string,
  onUpdate: PropTypes.func,
  OnDelete: PropTypes.func,
};

export default UniversalLogicCard;
