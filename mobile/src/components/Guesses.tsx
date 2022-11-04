import { useToast, FlatList } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from '../components/Game'
import { Loading } from './Loading';
import { EmptyMyPollList } from './EmptyMyPollList';

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')

  const toast = useToast()

  async function fetchGames() {
    try {
      setIsLoading(true)
      const response = await api.get(`/polls/${pollId}/games`)
      setGames(response.data.games)

    } catch (err) {
      console.log(err)

      toast.show({
        title: "Couldn't load games",
        placement: "top",
        bgColor: "red.500"
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Both guesses are needed",
          placement: "top",
          bgColor: "red.500"
        })
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })

      toast.show({
        title: "Guess registered, good luck!",
        placement: "top",
        bgColor: "green.500"
      })

      fetchGames()

    } catch (err) {
      console.log(err)

      toast.show({
        title: "Couldn't process guess",
        placement: "top",
        bgColor: "red.500"
      })
    }
  } 

  useEffect(() => {
    fetchGames()
  }, [pollId])

  if(isLoading) {
    return <Loading />
  }

  return (
    <FlatList 
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPollList code={code} />}
    />
  );
}
