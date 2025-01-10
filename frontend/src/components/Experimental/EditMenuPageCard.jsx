import { Button, Card, CardBody } from "@chakra-ui/react";
import PropTypes from "prop-types";

function EditMenuPageCard({ showAdditionalButtons, setShowAdditionalButtons }) {
  return (
    <Card width="300px" height="100%" display="flex" flexDirection="column">
      <CardBody
        display="flex"
        flexDirection="column"
        alignItems="center"
        pt="10"
      >
        <Button
          height="250px"
          width="100%"
          colorScheme="teal"
          fontSize="2em"
          onClick={() => {
            setShowAdditionalButtons(!showAdditionalButtons);
          }}
        >
          {showAdditionalButtons ? "Hide Edit" : "Edit Content"}
        </Button>
      </CardBody>
    </Card>
  );
}

EditMenuPageCard.propTypes = {
  showAdditionalButtons: PropTypes.bool.isRequired,
  setShowAdditionalButtons: PropTypes.bool.isRequired,
};

export default EditMenuPageCard;
