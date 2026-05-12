"""Mock alarm data for OptiSense HMI."""


TEMPLATES = {
    "drive": {
        "label": "Industrial Drive",
        "signals": [
            "motor_temp",
            "output_freq",
            "fan_speed",
            "dc_bus_voltage",
        ],
        "default_thresholds": {
            "motor_temp": 85.0,
            "output_freq": 1.5,
            "fan_speed": 85.0,
            "dc_bus_voltage": 680.0,
        },
        "monitoring_points": 12,
    },
    "plc": {
        "label": "PLC Controller",
        "signals": [
            "cpu_load",
            "scan_time",
            "io_latency",
            "memory_utilization",
        ],
        "default_thresholds": {
            "cpu_load": 85.0,
            "scan_time": 40.0,
            "io_latency": 6.0,
            "memory_utilization": 78.0,
        },
        "monitoring_points": 9,
    },
    "robot": {
        "label": "Industrial Robot",
        "signals": [
            "joint_torque",
            "axis_temp",
            "path_deviation",
            "drive_current",
        ],
        "default_thresholds": {
            "joint_torque": 12.0,
            "axis_temp": 78.0,
            "path_deviation": 1.6,
            "drive_current": 22.0,
        },
        "monitoring_points": 18,
    },
    "sensor": {
        "label": "Process Sensor",
        "signals": [
            "signal_noise",
            "drift_rate",
            "response_time",
            "calibration_age",
        ],
        "default_thresholds": {
            "signal_noise": 3.0,
            "drift_rate": 0.8,
            "response_time": 1.5,
            "calibration_age": 180.0,
        },
        "monitoring_points": 6,
    },
}


def load_mock_alarms():
    """Return a list of mock alarm records for testing."""
    return [
        {
            "id": "ALT-001",
            "equipment": "ABB ACS880-07 Industrial Drive",
            "location": "Line 4 - Mixer Bay",
            "fault": "Overtemperature Phase L2",
            "severity": "CRITICAL",
            "value": 94.3,
            "unit": "C",
            "threshold": 85.0,
            "trend": "rising",
            "ai_priority": 1,
            "ai_confidence": 0.94,
            "ai_reason": (
                "Phase L2 stator temperature continues to climb above the 85C limit, "
                "indicating thermal runaway in the drive power stage. This pattern is "
                "consistent with insulation stress that can lead to immediate trip and "
                "unplanned line downtime. Reduce load and inspect cooling airflow and "
                "terminal torque immediately."
            ),
            "history": [88.6, 89.9, 91.2, 92.7, 93.5, 94.3],
            "equipment_type": "drive",
            "downtime_cost_per_hour": 18000,
            "last_fired_count": 9,
            "acknowledged": False,
            "snoozed_until": None,
        },
        {
            "id": "ALT-002",
            "equipment": "ABB AC500 PLC PM573",
            "location": "Packaging Cell 2",
            "fault": "CPU Load Sustained >90%",
            "severity": "HIGH",
            "value": 93.7,
            "unit": "%",
            "threshold": 85.0,
            "trend": "stable",
            "ai_priority": 2,
            "ai_confidence": 0.88,
            "ai_reason": (
                "PLC CPU utilization is pinned above 90% for multiple scan cycles, "
                "suggesting task overload or a stuck communication routine. Sustained "
                "load risks scan-time overrun and control lag, which can cascade into "
                "downstream station faults. Review cyclic tasks and reduce noncritical "
                "communications during peak load."
            ),
            "history": [92.8, 93.1, 93.3, 93.6, 93.7, 93.7],
            "equipment_type": "plc",
            "downtime_cost_per_hour": 12000,
            "last_fired_count": 7,
            "acknowledged": False,
            "snoozed_until": None,
        },
        {
            "id": "ALT-003",
            "equipment": "ABB IRB 6700 Robot Unit 04",
            "location": "Weld Cell A",
            "fault": "Joint 3 Torque Deviation",
            "severity": "HIGH",
            "value": 18.4,
            "unit": "Nm deviation",
            "threshold": 12.0,
            "trend": "oscillating",
            "ai_priority": 3,
            "ai_confidence": 0.84,
            "ai_reason": (
                "Joint 3 torque deviation spikes intermittently beyond 12 Nm, pointing "
                "to a mechanical load imbalance or drive gain drift. Recurrent spikes "
                "increase wear on the harmonic gearbox and can push the robot into a "
                "protective stop. Inspect payload calibration and verify axis tuning "
                "before the next production batch."
            ),
            "history": [14.9, 17.1, 13.8, 18.4, 15.6, 17.9],
            "equipment_type": "robot",
            "downtime_cost_per_hour": 15000,
            "last_fired_count": 6,
            "acknowledged": False,
            "snoozed_until": None,
        },
        {
            "id": "ALT-004",
            "equipment": "ABB CP635 Control Panel",
            "location": "Operator Station 1",
            "fault": "Display Backlight Degradation",
            "severity": "MEDIUM",
            "value": 62.0,
            "unit": "% brightness",
            "threshold": 70.0,
            "trend": "falling",
            "ai_priority": 4,
            "ai_confidence": 0.79,
            "ai_reason": (
                "Backlight intensity has dropped below 70% and is declining steadily, "
                "indicating LED driver aging or voltage sag. Reduced visibility slows "
                "operator response time and increases the likelihood of missed alarms. "
                "Schedule panel backlight service during the next planned stop."
            ),
            "history": [68.4, 67.2, 66.1, 64.8, 63.2, 62.0],
            "equipment_type": "panel",
            "downtime_cost_per_hour": 6500,
            "last_fired_count": 4,
            "acknowledged": False,
            "snoozed_until": None,
        },
        {
            "id": "ALT-005",
            "equipment": "ABB ACS580 General Purpose Drive",
            "location": "Conveyor Line 7",
            "fault": "Output Frequency Fluctuation",
            "severity": "MEDIUM",
            "value": 2.3,
            "unit": "Hz deviation",
            "threshold": 1.5,
            "trend": "oscillating",
            "ai_priority": 5,
            "ai_confidence": 0.81,
            "ai_reason": (
                "Drive output frequency is oscillating around the setpoint with a 2.3 Hz "
                "deviation, likely caused by unstable feedback or a worn encoder. "
                "Oscillation increases belt wear and can desynchronize downstream timing. "
                "Verify encoder signal integrity and retune the speed loop."
            ),
            "history": [1.4, 2.2, 1.6, 2.3, 1.7, 2.1],
            "equipment_type": "drive",
            "downtime_cost_per_hour": 9000,
            "last_fired_count": 5,
            "acknowledged": False,
            "snoozed_until": None,
        },
        {
            "id": "ALT-006",
            "equipment": "ABB ACS880-01 Cabinet Drive",
            "location": "Utilities Room",
            "fault": "Cooling Fan Speed Reduced",
            "severity": "LOW",
            "value": 78.0,
            "unit": "% rated speed",
            "threshold": 85.0,
            "trend": "stable",
            "ai_priority": 6,
            "ai_confidence": 0.73,
            "ai_reason": (
                "Cooling fan speed is holding at 78% of rated, suggesting filter loading "
                "or fan bearing wear. While immediate trip risk is low, reduced airflow "
                "raises cabinet temperature and accelerates component aging. Replace or "
                "clean intake filters at the next maintenance window."
            ),
            "history": [79.2, 78.7, 78.4, 78.1, 78.0, 78.0],
            "equipment_type": "drive",
            "downtime_cost_per_hour": 4000,
            "last_fired_count": 3,
            "acknowledged": False,
            "snoozed_until": None,
        },
        {
            "id": "ALT-007",
            "equipment": "ABB Zenon SCADA Server Node 2",
            "location": "Control Room",
            "fault": "Historian Database Write Lag",
            "severity": "LOW",
            "value": 4.8,
            "unit": "s lag",
            "threshold": 2.0,
            "trend": "rising",
            "ai_priority": 7,
            "ai_confidence": 0.76,
            "ai_reason": (
                "Historian write latency is trending upward, indicating disk or network "
                "contention on the SCADA node. Prolonged lag can delay alarm context and "
                "reduce data fidelity during investigations. Check storage IO queue depth "
                "and confirm backup jobs are not overlapping peak load."
            ),
            "history": [3.1, 3.5, 3.9, 4.2, 4.6, 4.8],
            "equipment_type": "scada",
            "downtime_cost_per_hour": 3500,
            "last_fired_count": 2,
            "acknowledged": False,
            "snoozed_until": None,
        },
        {
            "id": "ALT-008",
            "equipment": "ABB AC500 Safety PLC PS501",
            "location": "Safety Cell 3",
            "fault": "Diagnostic Cycle Time Exceeded",
            "severity": "INFORMATIONAL",
            "value": 105.0,
            "unit": "ms",
            "threshold": 100.0,
            "trend": "stable",
            "ai_priority": 8,
            "ai_confidence": 0.7,
            "ai_reason": (
                "Safety diagnostic cycle time is slightly above the 100 ms limit, which "
                "can occur when safety tasks share CPU with standard logic. While no trip "
                "has occurred, extended delays reduce safety margin during high-speed "
                "operations. Review safety task scheduling and isolate noncritical tasks."
            ),
            "history": [101.0, 102.4, 103.2, 104.1, 104.6, 105.0],
            "equipment_type": "safety_plc",
            "downtime_cost_per_hour": 2500,
            "last_fired_count": 1,
            "acknowledged": False,
            "snoozed_until": None,
        },
    ]
