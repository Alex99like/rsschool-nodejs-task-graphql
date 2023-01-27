import fetch from "node-fetch";

const BASE_URL = `http://127.0.0.1:3000`

type TypeMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH'

export const axios = async <T>(search: string, method: TypeMethod = 'GET', body?: string ): Promise<T> => {
  const res = await fetch(`${BASE_URL}/${search}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body && JSON.stringify(body)
  })

  return await res.json()
}