import { useSocket } from './useSocket'

const API_URL = 'http://localhost:5000'

const postJson = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  })
  return response.json()
}

export function useLiveData() {
  const { alarms, healthScore, connectionStatus } = useSocket()

  const acknowledgeAlarm = async (alarmId) => postJson(`/api/alarms/${alarmId}/acknowledge`)
  const snoozeAlarm = async (alarmId, minutes) =>
    postJson(`/api/alarms/${alarmId}/snooze`, { minutes })
  const escalateAlarm = async (alarmId) => postJson(`/api/alarms/${alarmId}/escalate`)

  const fetchExplanation = async (alarm) => {
    if (!alarm?.id) return ''
    try {
      const data = await postJson(`/api/alarms/${alarm.id}/explain`)
      return data?.explanation || ''
    } catch (error) {
      return ''
    }
  }

  const addEquipment = async (payload) => {
    try {
      return await postJson('/api/equipment', payload)
    } catch (error) {
      return null
    }
  }

  return {
    alarms,
    healthScore,
    connectionStatus,
    acknowledgeAlarm,
    snoozeAlarm,
    escalateAlarm,
    fetchExplanation,
    addEquipment
  }
}
