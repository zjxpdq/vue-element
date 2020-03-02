import i from './../../utils/axios'

export const app = {
  login: params => i.post('', params)
}
