import { useEffect, useState } from 'react'

const STORAGE_KEY = 'optisense_role'

export function useRole() {
  const [role, setRole] = useState('operator')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'operator' || stored === 'engineer') {
      setRole(stored)
    }
  }, [])

  const toggleRole = () => {
    setRole((prev) => {
      const next = prev === 'operator' ? 'engineer' : 'operator'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  return { role, toggleRole }
}
