import { useState } from "react";
import { Heading, useToast, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function Find() {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const toast = useToast()
  const { navigate } = useNavigation()

  async function handleJoinPoll() {
    try {
      setIsLoading(true)

      if(!code.trim()) {
        return toast.show({
          title: 'Need a code',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post('/polls/join', { code })

      toast.show({
        title: 'Successfully joined this poll!',
        placement: 'top',
        bgColor: 'green.500'
      })

      setCode('')
      navigate('polls')

    } catch (err) {
      console.log(err)
      setIsLoading(false)

      if(err.response?.data?.message === 'Poll not found') {
        return toast.show({
          title: "Couldn't find poll",
          placement: "top",
          bgColor: "red.500"
        })
      }

      if(err.response?.data?.message === 'You have already joined this poll') {
        return toast.show({
          title: "You have already joined this poll",
          placement: "top",
          bgColor: "red.500"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Find with code" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">        
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Find a poll with it's unique code
        </Heading>

        <Input 
          mb={2}
          placeholder="Poll's unique code"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button 
          title="Find poll"
          isLoading={isLoading}
          onPress={handleJoinPoll}
        />
      </VStack>
    </VStack>
  )
}