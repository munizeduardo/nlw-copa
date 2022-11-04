import { Text } from 'native-base';

export function EmptyRakingList() {
  return (
    <Text color="white" fontSize="sm" textAlign="center">
      Ranking not generated, {'\n'} 
      waiting for results.
    </Text>
  );
}