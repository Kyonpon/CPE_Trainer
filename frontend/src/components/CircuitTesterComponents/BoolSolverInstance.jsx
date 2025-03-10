import {
  Box,
  Heading,
  HStack,
  Input,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import BoolExpressTT from "./BoolExpressTT";
//import BoolKmap from "./BoolKmap";
import { useState } from "react";
import PropTypes from "prop-types";

import { moduleHandleInputInstance } from "../../utils/BoolUtils";
function BoolSolverInstance({
  expressionName,
  moduleBoolSolverInstances,
  onDeleteInstance,
  onInput,
}) {
  const [expression, setExpression] = useState("");
  const [validExpression, setValidExpression] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isValidExpression = (expression) => {
    const hasInvalidCharacters = /[^A-Z01+'()^ ]/.test(expression);
    const hasUnmatchedParentheses =
      (expression.match(/\(/g) || []).length !==
      (expression.match(/\)/g) || []).length;
    const hasEmptyParentheses = /\(\s*\)/.test(expression);
    return !(
      hasInvalidCharacters ||
      hasUnmatchedParentheses ||
      hasEmptyParentheses
    );
  };

  const handleInputChange = (e) => {
    const newExpression = e.target.value.trim().toUpperCase();
    setExpression(newExpression);
    setValidExpression(isValidExpression(newExpression));

    if (isValidExpression(newExpression)) {
      onInput(
        expressionName,
        moduleHandleInputInstance(newExpression, expressionName) //This gets the SOP and other attr from utils
      );
    }
  };

  const handleExpressionDelete = () => {
    onDeleteInstance();
  };

  //Responsible for rendering the boolean expression in a more readable format
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

  const currentInstance = moduleBoolSolverInstances[expressionName];
  //console.log("Instance:", expressionName, currentInstance);
  const hasExpressionSOP = currentInstance && currentInstance.ExpressionSOP;

  return (
    <Box m={0} p={0}>
      <VStack spacing={1}>
        <HStack justify="flex-start" w="100%">
          <Heading size="lg" textAlign="left">
            {expressionName}
          </Heading>
          {currentInstance ? (
            <Box>
              <Button onClick={onOpen}>Check Table</Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Truth Table</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <BoolExpressTT finalTT={currentInstance.FinalTT} />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Box>
          ) : (
            <div>No Boolean Expression SOP available for this instance</div>
          )}
        </HStack>

        <Box display="grid" gridTemplateColumns="1fr 1fr .3fr" gap={1} w="100%">
          <Box
            p={4}
            m={0}
            backgroundColor="gray"
            display="flex"
            flexDirection="column"
          >
            <Input
              placeholder="Example Format: (AB)' + AB'C + A'"
              type="text"
              autoComplete="off"
              spellCheck="false"
              value={expression}
              onChange={handleInputChange}
            ></Input>
          </Box>
          <Box
            p={4}
            m={0}
            backgroundColor="gray"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {!validExpression && ( // Conditionally render error message
              <Heading size="md" textAlign="center" color="red.400">
                Invalid Expression! Please check for errors.
              </Heading>
            )}
            {validExpression &&
              expression &&
              hasExpressionSOP && ( // Conditionally render content only if ExpressionSOP exists
                <Heading>
                  {processBooleanExpression(currentInstance.ExpressionSOP)}
                </Heading>
              )}
          </Box>
          <Box
            p={4}
            m={0}
            backgroundColor="red.500"
            borderRadius="10px"
            display="flex"
            flexDirection="column"
            alignContent="center"
            justifyContent="center"
            onClick={handleExpressionDelete}
          >
            <Heading size="md" textAlign="center">
              Delete
            </Heading>
          </Box>
        </Box>

        <HStack justify="space-evenly" spacing={1} w="100%">
          <Box flex="1"></Box>
          <Box flex="1">
            {/* <BoolKmap variables={variables} minTerms={tableData.minTerms} /> */}
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
}

BoolSolverInstance.propTypes = {
  onDeleteInstance: PropTypes.func.isRequired,
  expressionName: PropTypes.string.isRequired,
};

export default BoolSolverInstance;
