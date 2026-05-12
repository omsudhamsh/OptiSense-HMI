import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

export function useSocket() {
  const [alarms, setAlarms] = useState([])
  const [healthScore, setHealthScore] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const socketRef = useRef(null)
  const retryRef = useRef(0)
  const retryTimerRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const cleanupSocket = () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners()
        socketRef.current.close()
        socketRef.current = null
      }
    }

    const scheduleReconnect = () => {
      if (!isMounted) return
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
      const delay = Math.min(30000, 1000 * 2 ** retryRef.current)
      retryRef.current += 1
      setConnectionStatus('reconnecting')
      retryTimerRef.current = setTimeout(() => {
        cleanupSocket()
        connectSocket()
      }, delay)
    }

    const connectSocket = () => {
      const socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: false
      })
      socketRef.current = socket

      socket.on('connect', () => {
        retryRef.current = 0
        setConnectionStatus('connected')
      })

      socket.on('disconnect', () => {
        setConnectionStatus('disconnected')
        scheduleReconnect()
      })

      socket.on('connect_error', () => {
        scheduleReconnect()
      })

      socket.on('alarm_update', (data) => {
        if (isMounted) {
          setAlarms(Array.isArray(data) ? data : [])
        }
      })

      socket.on('health_update', (data) => {
        if (isMounted) {
          setHealthScore(data || null)
        }
      })
    }

    connectSocket()

    return () => {
      isMounted = false
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
      cleanupSocket()
    }
  }, [])

  return { alarms, healthScore, connectionStatus }
}
