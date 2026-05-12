"""Alarm correlation and state tracking."""

from __future__ import annotations

import math
import random
from datetime import datetime, timedelta

from data.mock_alarms import TEMPLATES, load_mock_alarms
from engine.isa_scoring import calculate_priority_score


class AlarmManager:
    def __init__(self):
        self.alarms = []
        self.history = {}
        self.acknowledged = set()
        self.snoozed = {}

    def load_initial_alarms(self) -> None:
        """Load from mock_alarms.py and calculate initial priority scores."""
        self.alarms = load_mock_alarms()
        self.history = {
            alarm["id"]: list(alarm.get("history", [])) for alarm in self.alarms
        }
        for alarm in self.alarms:
            alarm["priority_score"] = calculate_priority_score(alarm, self.alarms)
        self.alarms.sort(key=lambda item: item.get("priority_score", 0), reverse=True)

    def update_live_values(self) -> None:
        """
        Simulate live sensor updates. For each alarm:
        - Add realistic noise to current value (+/-2-5% depending on trend direction)
        - Rising trend: value increases by 0.3-0.8 per update
        - Oscillating: sine wave variation
        - Falling/stable: minimal change
        - Update history list (keep last 6 values)
        - Recalculate priority scores
        - Sort alarms by priority score descending
        """
        now = datetime.utcnow()
        for alarm in self.alarms:
            snoozed_until = alarm.get("snoozed_until")
            if snoozed_until and isinstance(snoozed_until, datetime):
                if snoozed_until <= now:
                    alarm["snoozed_until"] = None
                    self.snoozed.pop(alarm["id"], None)

            current_value = float(alarm.get("value", 0.0))
            trend = str(alarm.get("trend", "stable")).lower()
            noise_pct = random.uniform(0.02, 0.05)
            noise = current_value * random.uniform(-noise_pct, noise_pct)

            if trend == "rising":
                current_value += random.uniform(0.3, 0.8) + noise
            elif trend == "falling":
                current_value -= random.uniform(0.2, 0.6) + noise
            elif trend == "oscillating":
                phase = alarm.get("_osc_phase", random.uniform(0.0, math.pi))
                amplitude = max(0.5, abs(current_value - float(alarm.get("threshold", 0))) * 0.2)
                current_value = current_value + math.sin(phase) * amplitude + noise
                alarm["_osc_phase"] = phase + 0.6
            else:
                current_value += noise * 0.4

            alarm["value"] = float(round(current_value, 2))
            history = self.history.get(alarm["id"], [])
            history.append(alarm["value"])
            self.history[alarm["id"]] = history[-6:]
            alarm["history"] = self.history[alarm["id"]]

            if alarm["value"] >= float(alarm.get("threshold", 0)):
                alarm["last_fired_count"] = int(alarm.get("last_fired_count", 0)) + 1

        for alarm in self.alarms:
            alarm["priority_score"] = calculate_priority_score(alarm, self.alarms)

        self.alarms.sort(key=lambda item: item.get("priority_score", 0), reverse=True)

    def acknowledge_alarm(self, alarm_id: str) -> bool:
        for alarm in self.alarms:
            if alarm["id"] == alarm_id:
                alarm["acknowledged"] = True
                self.acknowledged.add(alarm_id)
                return True
        return False

    def snooze_alarm(self, alarm_id: str, minutes: int) -> bool:
        for alarm in self.alarms:
            if alarm["id"] == alarm_id:
                snooze_until = datetime.utcnow() + timedelta(minutes=minutes)
                alarm["snoozed_until"] = snooze_until
                self.snoozed[alarm_id] = snooze_until
                return True
        return False

    def escalate_alarm(self, alarm_id: str) -> bool:
        for alarm in self.alarms:
            if alarm["id"] == alarm_id:
                alarm["severity"] = "CRITICAL"
                alarm["ai_priority"] = 1
                alarm["acknowledged"] = False
                return True
        return False

    def add_equipment(self, equipment_data: dict) -> dict:
        equipment_type = equipment_data.get("equipment_type", "drive")
        template = TEMPLATES.get(equipment_type, TEMPLATES["drive"])
        alarm_id = f"ALT-{len(self.alarms) + 1:03d}"
        threshold = float(
            equipment_data.get(
                "threshold",
                next(iter(template["default_thresholds"].values())),
            )
        )
        alarm = {
            "id": alarm_id,
            "equipment": equipment_data.get("equipment", template["label"]),
            "location": equipment_data.get("location", "New Line"),
            "fault": equipment_data.get("fault", "New equipment alarm"),
            "severity": equipment_data.get("severity", "LOW"),
            "value": float(equipment_data.get("value", threshold * 0.9)),
            "unit": equipment_data.get("unit", "units"),
            "threshold": threshold,
            "trend": equipment_data.get("trend", "stable"),
            "ai_priority": int(equipment_data.get("ai_priority", 6)),
            "ai_confidence": float(equipment_data.get("ai_confidence", 0.65)),
            "ai_reason": equipment_data.get("ai_reason", "Awaiting AI analysis."),
            "history": [float(equipment_data.get("value", threshold * 0.9))] * 6,
            "equipment_type": equipment_type,
            "downtime_cost_per_hour": int(
                equipment_data.get("downtime_cost_per_hour", 3000)
            ),
            "last_fired_count": int(equipment_data.get("last_fired_count", 0)),
            "acknowledged": False,
            "snoozed_until": None,
        }
        alarm["priority_score"] = calculate_priority_score(alarm, self.alarms + [alarm])
        self.alarms.append(alarm)
        self.history[alarm_id] = list(alarm["history"])
        return alarm

    def get_serializable_alarms(self) -> list:
        serialized = []
        for alarm in self.alarms:
            item = dict(alarm)
            snoozed_until = item.get("snoozed_until")
            if isinstance(snoozed_until, datetime):
                item["snoozed_until"] = snoozed_until.isoformat() + "Z"
            serialized.append(item)
        return serialized
