import { Heading, VStack } from "native-base";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export function Find() {
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Find with code" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">        
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Find a pool with it's unique code
        </Heading>

        <Input 
          mb={2}
          placeholder="Pool's unique code"
        />

        <Button 
          title="Find pool"
        />
      </VStack>
    </VStack>
  )
}