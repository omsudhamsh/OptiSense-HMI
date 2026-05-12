"""LLM-based alarm explanation engine for OptiSense HMI."""

from __future__ import annotations

import os
from datetime import datetime

import google.generativeai as genai
from dotenv import load_dotenv


FALLBACK_EXPLANATIONS = {
    "ALT-001": (
        "ACS880-07 thermal pattern matches pre-failure signature observed in 3 prior units, "
        "with phase L2 heating faster than expected under current load. Immediate reduction "
        "of torque demand and inspection of cooling airflow can prevent an imminent drive trip."
    ),
    "ALT-002": (
        "AC500 PM573 CPU load is sustained above 90%, indicating scan-cycle saturation and "
        "possible communication task congestion. Prioritize critical tasks and reduce nonessential "
        "I/O polling to avoid scan overruns and downstream timing faults."
    ),
    "ALT-003": (
        "IRB 6700 Joint 3 torque deviation spikes suggest intermittent mechanical drag or payload "
        "imbalance. Continued deviation accelerates gearbox wear and can trigger a protective stop, "
        "so verify payload calibration and joint lubrication promptly."
    ),
    "ALT-004": (
        "CP635 backlight intensity is trending downward below the 70% threshold, consistent with "
        "LED driver aging. Reduced visibility slows operator response during critical alarms, so "
        "plan a backlight replacement in the next maintenance window."
    ),
    "ALT-005": (
        "ACS580 output frequency oscillation indicates unstable feedback or encoder noise. The "
        "resulting speed ripple can desynchronize conveyor timing and wear mechanical components, "
        "so check feedback wiring and retune the drive control loop."
    ),
    "ALT-006": (
        "ACS880-01 cooling fan speed remains below 85% of rated, likely due to filter loading or "
        "bearing wear. While not immediately critical, reduced airflow increases cabinet temperature, "
        "so schedule filter cleaning and fan inspection soon."
    ),
    "ALT-007": (
        "Zenon historian write lag is rising, indicating storage or network contention on the SCADA node. "
        "Delayed writes reduce alarm context accuracy, so verify disk I/O saturation and stagger backup jobs."
    ),
    "ALT-008": (
        "AC500 Safety PLC diagnostic cycle time exceeds 100 ms, suggesting task contention or increased "
        "logic load. Prolonged delays shrink safety margins, so isolate noncritical logic and review safety "
        "task scheduling."
    ),
}


def initialize_gemini() -> None:
    """Configure Gemini with API key from .env."""
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)


def build_alarm_prompt(alarm: dict) -> str:
    """
    Build a detailed prompt for Gemini. Include:
    - Equipment name, type, location
    - Current value vs threshold
    - Trend direction
    - Number of times fired today
    - Downtime cost per hour
    Instruct Gemini to respond in exactly 2-3 sentences:
    1. What is happening technically
    2. Why it is a priority (link to impact)
    3. Recommended immediate action
    """
    return (
        "You are an industrial alarm analyst. Provide a concise alarm explanation in exactly 2-3 sentences. "
        "Sentence 1: what is happening technically. Sentence 2: why it is a priority and the impact. "
        "Sentence 3 (only if needed): immediate recommended action.\n\n"
        f"Equipment: {alarm.get('equipment')}\n"
        f"Type: {alarm.get('equipment_type')}\n"
        f"Location: {alarm.get('location')}\n"
        f"Fault: {alarm.get('fault')}\n"
        f"Value: {alarm.get('value')} {alarm.get('unit')} (threshold {alarm.get('threshold')})\n"
        f"Trend: {alarm.get('trend')}\n"
        f"Fired today: {alarm.get('last_fired_count')}\n"
        f"Downtime cost per hour: ${alarm.get('downtime_cost_per_hour')}\n"
    )


def get_ai_explanation(alarm: dict) -> str:
    """
    Try Gemini first. On any error, fall back to FALLBACK_EXPLANATIONS[alarm['id']].
    Always returns a string. Never raises.
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = build_alarm_prompt(alarm)
        response = model.generate_content(prompt)
        text = getattr(response, "text", None)
        if text:
            return text.strip()
    except Exception:
        pass
    return FALLBACK_EXPLANATIONS.get(
        alarm.get("id", ""),
        "Alarm explanation unavailable. Please review equipment diagnostics.",
    )


def generate_shift_report(alarms: list, shift_duration_hours: int = 8) -> dict:
    """
    Use Gemini to generate shift handover report.
    Returns:
    {
        summary: str,
        critical_events: list,
        unresolved_alarms: list,
        recommended_actions: list,
        health_score_summary: str,
        generated_at: str (ISO timestamp)
    }
    """
    timestamp = datetime.utcnow().isoformat() + "Z"
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        alarm_lines = [
            f"{alarm.get('id')}: {alarm.get('equipment')} - {alarm.get('fault')} "
            f"({alarm.get('severity')}, value {alarm.get('value')} {alarm.get('unit')})"
            for alarm in alarms
        ]
        prompt = (
            "Generate a concise shift handover report for an ISA-18.2 focused HMI. "
            "Return JSON with keys: summary, critical_events, unresolved_alarms, "
            "recommended_actions, health_score_summary. Use short bullet-style strings.\n\n"
            f"Shift duration: {shift_duration_hours} hours\n"
            "Alarms:\n" + "\n".join(alarm_lines)
        )
        response = model.generate_content(prompt)
        text = getattr(response, "text", None)
        if text:
            return {
                "summary": text.strip(),
                "critical_events": [a for a in alarm_lines if "CRITICAL" in a],
                "unresolved_alarms": [
                    a for a in alarm_lines if not _is_acknowledged(a, alarms)
                ],
                "recommended_actions": [
                    "Review critical alarms and confirm mitigations are in place.",
                ],
                "health_score_summary": "Generated by Gemini narrative.",
                "generated_at": timestamp,
            }
    except Exception:
        pass

    critical_events = [
        f"{alarm.get('id')} {alarm.get('fault')}" for alarm in alarms if alarm.get("severity") == "CRITICAL"
    ]
    unresolved = [
        f"{alarm.get('id')} {alarm.get('fault')}" for alarm in alarms if not alarm.get("acknowledged")
    ]
    return {
        "summary": f"Shift report generated for {shift_duration_hours} hour window.",
        "critical_events": critical_events,
        "unresolved_alarms": unresolved,
        "recommended_actions": [
            "Resolve critical alarms and validate suppression list before next shift.",
            "Confirm PLC/drive cooling and performance metrics are within thresholds.",
        ],
        "health_score_summary": "Alarm health score pending Gemini generation.",
        "generated_at": timestamp,
    }


def _is_acknowledged(line: str, alarms: list) -> bool:
    for alarm in alarms:
        if alarm.get("id") in line:
            return bool(alarm.get("acknowledged"))
    return False
