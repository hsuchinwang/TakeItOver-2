import { AsyncStorage } from 'react-native';
import * as Config from '../constants/config';
export async function getMyUser() {
  const username = await AsyncStorage.getItem('@UserName');
    let response = await fetch(
      `http://${Config.SERVER_IP}:${Config.PORT}/get_my_user`,
      {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          'name': username,
        })
     }
    )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
    return response[0];
}
export async function api_buyHint(cost, puzzle, puzzle_result) {
  const username = await AsyncStorage.getItem('@UserName');
  // const userCountry = await AsyncStorage.getItem('@UserCountry');
    let response = await fetch(
      `http://${Config.SERVER_IP}:${Config.PORT}/buy_hint`,
      {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          'name': username,
          'puzzle': puzzle,
          'puzzle_result': puzzle_result,
          'cost': cost,
        })
     }
    )
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
    return response;
}