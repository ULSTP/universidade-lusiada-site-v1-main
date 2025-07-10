import axios from 'axios'

export class ExternalApiService {
  async fetchExample() {
    const { data } = await axios.get('https://example.com/api')
    return data
  }
}
