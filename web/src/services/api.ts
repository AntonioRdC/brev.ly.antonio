import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

export interface Link {
  id: string
  originalUrl: string
  shortCode: string
  accessCount: number
  createdAt: string
}

export interface CreateLinkRequest {
  originalUrl: string
  shortCode?: string
}

export interface CreateLinkResponse {
  id: string
  originalUrl: string
  shortCode: string
  accessCount: number
  createdAt: string
}

export const linkService = {
  async createLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
    const response = await api.post('/links', data)

    return response.data
  },

  async getLinks(): Promise<Link[]> {
    const response = await api.get('/links')

    return response.data
  },

  async getLinkByShortCode(
    shortCode: string
  ): Promise<{ originalUrl: string }> {
    const response = await api.get(`/api/links/${shortCode}`)

    return response.data
  },

  async deleteLink(id: string): Promise<void> {
    await api.delete(`/links/${id}`)
  },

  async exportLinks(): Promise<string> {
    const response = await api.post(
      '/links/export',
      {},
      {
        responseType: 'text',
      }
    )
    return response.data
  },
}
