import { useState, useCallback } from 'react'

function normalizeResponseData(value) {
  if (Array.isArray(value)) return value

  if (value && typeof value === 'object') {
    if (Array.isArray(value.data)) return value.data

    if (value.data && typeof value.data === 'object' && Array.isArray(value.data.data)) {
      return value.data.data
    }
  }

  return value
}

export function useApi(apiFunc) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFunc(...args)
      const normalizedData = normalizeResponseData(res.data.data)
      setData(normalizedData)
      return normalizedData
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan, coba lagi.'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunc])

  return { data, loading, error, execute }
}

export function useMutation(apiFunc) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFunc(...args)
      return normalizeResponseData(res.data.data)
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan, coba lagi.'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunc])

  return { loading, error, execute }
}