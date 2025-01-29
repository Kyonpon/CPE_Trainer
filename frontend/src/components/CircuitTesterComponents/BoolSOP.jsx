import { Box, Heading, Text } from "@chakra-ui/react";
import { generateSOP } from "../../utils/BoolUtils";
import PropTypes from "prop-types";

const BoolSOP = ({ variables, minTerms }) => {
  if (!minTerms || minTerms.length === 0 || variables.length < 2) return null;

  const minimizedExpression = generateSOP(minTerms, variables);

  function processBooleanExpression(expression) {
    const result = [];
    let i = 0;

    // Loop through the string and process characters
    while (i < expression.length) {
      if (expression[i] === "'") {
        // Overline the previous character
        const previousChar = expression[i - 1];
        result[result.length - 1] = (
          <Text key={i - 1} as="span" css={{ textDecoration: "overline" }}>
            {previousChar}
          </Text>
        );
      } else if (expression[i] !== "'") {
        // Just push the regular characters
        result.push(expression[i]);
      }
      i++;
    }

    return result;
  }

  return (
    <Box>
      {!minimizedExpression ? (
        <h1>No SOP generated</h1>
      ) : (
        <Heading size="md">
          {processBooleanExpression(minimizedExpression)}
        </Heading>
      )}
    </Box>
  );
};
// Define PropTypes for the component with length validation
BoolSOP.propTypes = {
  variables: PropTypes.array.isRequired, // Array of variables
  minTerms: PropTypes.array, // Array of minterms
};
export default BoolSOP;
