import fetch from "node-fetch";

const BASE_URL = `http://127.0.0.1:3000`

export const axios = {
  get: async <T>(search: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}/${search}`)
    return await res.json()
  },
  post: async <T>(search: string, body: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}/${search}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    return await res.json()
  }
}