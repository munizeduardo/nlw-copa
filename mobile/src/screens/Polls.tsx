import { useCallback, useState } from 'react';
import { VStack, Icon, useToast, FlatList } from 'native-base';
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { api } from '../services/api';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { PollCard, PollCardProps } from '../components/PollCard';
import { EmptyPollList } from '../components/EmptyPollList';

export function Polls() {
  const [isListLoading, setIsListLoading] = useState(true)
  const [polls, setPolls] = useState<PollCardProps[]>([])

  const { navigate } = useNavigation()
  const toast = useToast()

  async function fetchPolls() {
    try {
      setIsListLoading(true)
      const response = await api.get('/polls')
      setPolls(response.data.polls)

    } catch (err) {
      console.log(err)
      toast.show({
        title: "Couldn't find the polls",
        placement: "top",
        bgColor: "red.500"
      })
    } finally {
      setIsListLoading(false)


    }
  }

  useFocusEffect(useCallback(() => {
    fetchPolls()
  }, []))

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title="My polls"
      />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button
          title="Find pool with code"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find')}
        />
      </VStack>

      {
        isListLoading ? <Loading /> :
        <FlatList 
        data={polls}
        keyExtractor={item => item.id}
        renderItem={({ item }) => 
        (
          <PollCard
            data={item}
            onPress={() => navigate('details', { id: item.id })}
          />
        )}
        px={5}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{ pb: 10}}
        ListEmptyComponent={() => <EmptyPollList />}
      />}
    </VStack>
  )
}