import { useState } from "react";
import { Heading, Text, VStack, useToast } from "native-base";

import Logo from '../assets/logo.svg'

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function New() {
  const [title, setTitle] = useState('')
  const [isCreatingPoll, setIsCreatingPoll] = useState(false)

  const toast = useToast()

  async function handleCreatePoll() {
    if(!title.trim()) {
      return toast.show({
        title: 'Your new poll needs a title!',
        placement: 'top',
        bgColor: 'red.500'
      })
    }

    try {
      setIsCreatingPoll(true)

      await api.post('/polls', { title })

      toast.show({
        title: 'Nice! Poll created!',
        placement: 'top',
        bgColor: 'green.500'
      })

      setTitle('')

    } catch (err) {
      console.log(err)

      toast.show({
        title: 'Something went wrong. Please try again.',
        placement: 'top',
        bgColor: 'red.500'
      })

      throw err
    } finally {
      setIsCreatingPoll(false)
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Create new poll" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
        
        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
          Create your own poll {'\n'} and share it with your friends!
        </Heading>

        <Input 
          mb={2}
          placeholder="Name your poll"
          onChangeText={setTitle}
          value={title}
        />

        <Button 
          title="Create my poll"
          onPress={handleCreatePoll}
          isLoading={isCreatingPoll}
        />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          After creating your poll, you will receive a code that you can use to invite your friends.
        </Text>
      </VStack>
    </VStack>
  )
}