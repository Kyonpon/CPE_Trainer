import { Box, Input } from "@chakra-ui/react";
import PropTypes from "prop-types";

const BoolExpressInput = ({ expression, onExpressionChange }) => {
  const handleInputChange = (e) => {
    onExpressionChange(e.target.value.trim().toUpperCase());
  };

  return (
    <Box p={4} m={0} backgroundColor={"gray"}>
      <Input
        placeholder="Example Format: (AB)' + AB'C + A'"
        type="text"
        autoComplete="off"
        spellCheck="false"
        value={expression}
        onChange={handleInputChange}
      ></Input>
    </Box>
  );
};

// Define prop types
BoolExpressInput.propTypes = {
  expression: PropTypes.string.isRequired,
  onExpressionChange: PropTypes.func.isRequired,
};

export default BoolExpressInput;
