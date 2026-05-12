"""ISA-18.2 style alarm health scoring."""

from __future__ import annotations

import pandas as pd


SEVERITY_WEIGHTS = {
    "CRITICAL": 40,
    "HIGH": 30,
    "MEDIUM": 20,
    "LOW": 10,
    "INFORMATIONAL": 5,
}

TREND_WEIGHTS = {
    "rising": 20,
    "oscillating": 15,
    "stable": 10,
    "falling": 5,
}


def calculate_alarm_rate(alarms: list, window_hours: int = 1) -> float:
    """Calculate alarms per hour. ISA-18.2 target: <=6/hr."""
    if not alarms or window_hours <= 0:
        return 0.0
    frame = pd.DataFrame(alarms)
    total_fires = frame.get("last_fired_count", pd.Series(dtype=float)).sum()
    return float(total_fires) / float(window_hours)


def count_chattering_alarms(alarms: list, threshold_count: int = 5) -> int:
    """Count alarms that fired >threshold_count times today with <30% acknowledgement rate. ISA-18.2 target: 0."""
    if not alarms:
        return 0
    frame = pd.DataFrame(alarms)
    fired = frame.get("last_fired_count", pd.Series(dtype=int)).fillna(0)
    acknowledged = frame.get("acknowledged", pd.Series(dtype=bool)).fillna(False)
    ack_rate = acknowledged.astype(float)
    chattering = (fired > threshold_count) & (ack_rate < 0.3)
    return int(chattering.sum())


def calculate_suppression_ratio(alarms: list) -> float:
    """Percentage of alarms currently snoozed or suppressed. ISA-18.2 target: <5%."""
    if not alarms:
        return 0.0
    frame = pd.DataFrame(alarms)
    snoozed = frame.get("snoozed_until", pd.Series(dtype=object)).notna()
    ratio = (snoozed.sum() / len(frame)) * 100.0
    return float(ratio)


def calculate_priority_distribution(alarms: list) -> dict:
    """Return count per priority level. ISA-18.2 healthy ratio: P1<5%, P2<15%, P3<30%, P4 rest."""
    if not alarms:
        return {f"P{idx}": 0 for idx in range(1, 9)}
    frame = pd.DataFrame(alarms)
    priorities = frame.get("ai_priority", pd.Series(dtype=int)).fillna(8).astype(int)
    counts = priorities.value_counts().to_dict()
    return {f"P{idx}": int(counts.get(idx, 0)) for idx in range(1, 9)}


def score_alarm_health(alarms: list) -> dict:
    """
    Master function aligned to ISA-18.2 alarm performance guidance. Returns:
    {
        overall_score: int (0-100, 100 = perfect ISA-18.2 compliance),
        grade: str ("A"/"B"/"C"/"D"/"F"),
        alarm_rate: float,
        alarm_rate_status: str ("ok"/"warning"/"critical"),
        chattering_count: int,
        chattering_status: str,
        suppression_ratio: float,
        suppression_status: str,
        priority_distribution: dict,
        recommendations: list of str (specific actionable recommendations)
    }
    """
    alarm_rate = calculate_alarm_rate(alarms)
    chattering_count = count_chattering_alarms(alarms)
    suppression_ratio = calculate_suppression_ratio(alarms)
    priority_distribution = calculate_priority_distribution(alarms)

    alarm_rate_status = "ok"
    if alarm_rate > 10:
        alarm_rate_status = "critical"
    elif alarm_rate > 6:
        alarm_rate_status = "warning"

    chattering_status = "ok"
    if chattering_count > 2:
        chattering_status = "critical"
    elif chattering_count > 0:
        chattering_status = "warning"

    suppression_status = "ok"
    if suppression_ratio >= 10:
        suppression_status = "critical"
    elif suppression_ratio >= 5:
        suppression_status = "warning"

    total_alarms = max(len(alarms), 1)
    p1_ratio = (priority_distribution.get("P1", 0) / total_alarms) * 100.0
    p2_ratio = (priority_distribution.get("P2", 0) / total_alarms) * 100.0
    p3_ratio = (priority_distribution.get("P3", 0) / total_alarms) * 100.0

    overall_score = 100.0
    if alarm_rate > 6:
        overall_score -= min(30.0, (alarm_rate - 6) * 3.0)
    overall_score -= chattering_count * 10.0
    if suppression_ratio > 5:
        overall_score -= (suppression_ratio - 5.0) * 1.5
    if p1_ratio > 5:
        overall_score -= 10.0
    if p2_ratio > 15:
        overall_score -= 8.0
    if p3_ratio > 30:
        overall_score -= 5.0

    overall_score = max(0.0, min(100.0, overall_score))
    if overall_score >= 90:
        grade = "A"
    elif overall_score >= 80:
        grade = "B"
    elif overall_score >= 70:
        grade = "C"
    elif overall_score >= 60:
        grade = "D"
    else:
        grade = "F"

    recommendations = []
    if alarm_rate_status != "ok":
        recommendations.append(
            "Reduce overall alarm rate by rationalizing nuisance alarms and tuning thresholds."
        )
    if chattering_status != "ok":
        recommendations.append(
            "Suppress or reconfigure chattering alarms with poor acknowledgement rates."
        )
    if suppression_status != "ok":
        recommendations.append(
            "Review long-lived suppressions and confirm they are still required."
        )
    if p1_ratio > 5:
        recommendations.append(
            "Reclassify excessive P1 alarms; reserve P1 for safety or immediate trip risk."
        )
    if p2_ratio > 15:
        recommendations.append(
            "Validate P2 criteria to keep the priority distribution within ISA-18.2 targets."
        )
    if p3_ratio > 30:
        recommendations.append(
            "Consolidate P3 alarms and remove redundant notifications where possible."
        )

    return {
        "overall_score": int(round(overall_score)),
        "grade": grade,
        "alarm_rate": float(round(alarm_rate, 2)),
        "alarm_rate_status": alarm_rate_status,
        "chattering_count": int(chattering_count),
        "chattering_status": chattering_status,
        "suppression_ratio": float(round(suppression_ratio, 2)),
        "suppression_status": suppression_status,
        "priority_distribution": priority_distribution,
        "recommendations": recommendations,
    }


def calculate_priority_score(alarm: dict, all_alarms: list) -> float:
    """
    Score 0-100. Weighted formula (ISA-18.2 aligned weighting guide):
    - severity_weight (40%): CRITICAL=40, HIGH=30, MEDIUM=20, LOW=10, INFO=5
    - trend_weight (20%): rising=20, oscillating=15, stable=10, falling=5
    - recurrence_weight (25%): based on last_fired_count relative to other alarms
    - downtime_cost_weight (15%): normalized downtime_cost_per_hour
    Returns float. Higher = more urgent.
    """
    frame = pd.DataFrame(all_alarms) if all_alarms else pd.DataFrame([alarm])
    max_fires = frame.get("last_fired_count", pd.Series(dtype=float)).max()
    max_fires = max(float(max_fires) if pd.notna(max_fires) else 0.0, 1.0)
    max_cost = frame.get("downtime_cost_per_hour", pd.Series(dtype=float)).max()
    max_cost = max(float(max_cost) if pd.notna(max_cost) else 0.0, 1.0)

    severity_weight = SEVERITY_WEIGHTS.get(str(alarm.get("severity", "")).upper(), 5)
    trend = str(alarm.get("trend", "stable")).lower()
    trend_weight = TREND_WEIGHTS.get(trend, 10)

    last_fired = float(alarm.get("last_fired_count", 0))
    recurrence_weight = (last_fired / max_fires) * 25.0

    downtime = float(alarm.get("downtime_cost_per_hour", 0))
    downtime_weight = (downtime / max_cost) * 15.0

    score = float(severity_weight) + float(trend_weight) + recurrence_weight + downtime_weight
    return max(0.0, min(100.0, score))
