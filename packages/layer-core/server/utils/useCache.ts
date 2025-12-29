import Redis from 'ioredis'

export function useCache () {
  const { private: { redisUrl } } = useRuntimeConfig()
  const client: Redis = new Redis(redisUrl)

  const getItem = async (key: string) => {
    const value = await client.get(key)
    return value
  }

  const setItem = async (key: string, value: string, ttl: number | undefined) => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)

    if (ttl) {
      await client.set(key, stringValue, 'EX', ttl)
    }
    else {
      await client.set(key, stringValue)
    }
  }

  const deleteItem = async (key: string) => {
    await client.del(key)
  }

  return {
    deleteItem,
    getItem,
    setItem,
  }
}
