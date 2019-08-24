import { callApi } from '../helpers/apiHelper';

class FighterService {
  async getFighters() {
    try {
      const endpoint = '/user'; // fighters.json
      const apiResult = await callApi(endpoint, 'GET');
  
      return JSON.parse(apiResult);
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(_id) {
    try {
      const endpoint = `/user/${_id}`;
      const apiDetailResult = await callApi(endpoint, 'GET');

      return apiDetailResult;
    } catch (error) {
      throw error;
    }
  }

  async updateFighter(_id) {
    try {
      const endpoint = `/user/${_id}`;
      const apiUpdateResult = await callApi(endpoint, 'PUT');

      return apiUpdateResult;
    } catch (error) {
      throw error;
    }
  }

  async deleteFighter(_id) {
    try {
      const endpoint = `/user/${_id}`;
      await callApi(endpoint, 'DELETE');

    } catch (error) {
      throw error;
    }
  }
}
  
export const fighterService = new FighterService();