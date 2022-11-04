import { useEffect, useState } from "react";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from '@react-navigation/native'

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../services/api";
import { PollCardProps } from "../components/PollCard";
import { PollHeader } from "../components/PollHeader";
import { EmptyMyPollList } from "../components/EmptyMyPollList";
import { Option } from "../components/Option";
import { Share } from "react-native";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string
}

export function Details() {
  const [optionSelected, setOptionSelected] = useState<'Your guesses' | 'Poll Ranking'>('Your guesses')
  const [isLoading, setIsLoading] = useState(false)
  const [pollDetails, setPollDetails] = useState<PollCardProps>({} as PollCardProps)

  const toast = useToast()
  const route = useRoute()

  const { id } = route.params as RouteParams

  async function fetchPollDetails() {
    try {
      setIsLoading(true)

      const response = await api.get(`/polls/${id}`)
      setPollDetails(response.data.poll)

    } catch (err) {
      console.log(err)
      toast.show({
        title: "Couldn't load poll details",
        placement: "top",
        bgColor: "red.500"
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code
    })
  }

  useEffect(() => {
    fetchPollDetails()
  }, [id])

  if(isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header 
        title={pollDetails.title} 
        showBackButton 
        showShareButton 
        onShare={handleCodeShare}
      />

      {
        pollDetails._count?.participants > 0 ?
        <VStack px={5} flex={1}>
          <PollHeader data={pollDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option 
              title="Your guesses" 
              isSelected={optionSelected === 'Your guesses'} 
              onPress={() => setOptionSelected('Your guesses')}
            />
            <Option 
              title="Poll Ranking"
              isSelected={optionSelected === 'Poll Ranking'}
              onPress={() => setOptionSelected('Poll Ranking')}
            />
          </HStack>

          <Guesses pollId={pollDetails.id} code={pollDetails.code} />
        </VStack> :

        <EmptyMyPollList code={pollDetails.code} />
      }
    </VStack> 
  )
}