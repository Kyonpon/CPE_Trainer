import { Card, CardBody, Stack, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { BsPlusSquareDotted } from "react-icons/bs";

function CreateCard(props) {
  return (
    <Link to={props.url}>
      <Card width="300px" height="100%" display="flex" flexDirection="column">
        <CardBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          pt="10"
        >
          <BsPlusSquareDotted fontSize="150px" />
          <Stack mt="2" spacing="3" flexGrow={1} justify="center">
            <Heading size="xl" textAlign="center">
              {props.title}
            </Heading>{" "}
          </Stack>
        </CardBody>
      </Card>
    </Link>
  );
}

CreateCard.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
};
export default CreateCard;
