import { Card, CardBody, Image, Stack, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function HomeCards(props) {
  return (
    <Link to={props.url}>
      <Card maxW="300px" height="100%" display="flex" flexDirection="column">
        <CardBody
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Image
            boxSize="250px"
            src={props.imgurl}
            alt={props.imgurlalt}
            borderRadius="lg"
            objectFit="cover"
          />
          <Stack mt="6" spacing="3" flexGrow={1} justify="space-between">
            <Heading fontSize="3xl" textAlign="center">
              {props.title}
            </Heading>{" "}
          </Stack>
        </CardBody>
      </Card>
    </Link>
  );
}

HomeCards.propTypes = {
  url: PropTypes.string,
  imgurl: PropTypes.string,
  imgurlalt: PropTypes.string,
  title: PropTypes.string,
};

export default HomeCards;
