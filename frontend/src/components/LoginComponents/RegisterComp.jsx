import { useState } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  VStack,
  Button,
} from "@chakra-ui/react";

function RegisterComp() {
  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        username: newUser,
        password: newPassword,
      });
      alert("Registered!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box bgColor="blue.800" p={3} borderRadius={"xl"}>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <VStack mb={3}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              placeholder="Username"
              type="text"
              id="username"
              value={newUser}
              onChange={(event) => setNewUser(event.target.value)}
            />

            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              placeholder="password"
              type="password"
              id="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </VStack>
          <Button type="submit">Register!</Button>
        </FormControl>
      </form>
    </Box>
  );
}

export default RegisterComp;
