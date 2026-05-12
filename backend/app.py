"""OptiSense HMI backend entrypoint."""

from __future__ import annotations

import asyncio
import threading
import time

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO

from data.mock_alarms import TEMPLATES
from engine.ai_explainer import generate_shift_report, get_ai_explanation, initialize_gemini
from engine.alarm_manager import AlarmManager
from engine.isa_scoring import score_alarm_health
from simulator.opc_ua_server import run_opc_ua_server

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:5174"])
socketio = SocketIO(
    app, cors_allowed_origins=["http://localhost:5173", "http://localhost:5174"], async_mode="threading"
)
alarm_manager = AlarmManager()
_update_thread_started = False


@app.get("/api/alarms")
def get_alarms():
    return jsonify(alarm_manager.get_serializable_alarms())


@app.get("/api/health-score")
def get_health_score():
    return jsonify(score_alarm_health(alarm_manager.alarms))


@app.post("/api/alarms/<alarm_id>/acknowledge")
def acknowledge_alarm(alarm_id: str):
    success = alarm_manager.acknowledge_alarm(alarm_id)
    return jsonify({"success": success})


@app.post("/api/alarms/<alarm_id>/snooze")
def snooze_alarm(alarm_id: str):
    payload = request.get_json(silent=True) or {}
    minutes = int(payload.get("minutes", 10))
    success = alarm_manager.snooze_alarm(alarm_id, minutes)
    return jsonify({"success": success, "snoozed_until": minutes})


@app.post("/api/alarms/<alarm_id>/escalate")
def escalate_alarm(alarm_id: str):
    success = alarm_manager.escalate_alarm(alarm_id)
    return jsonify({"success": success})


@app.post("/api/alarms/<alarm_id>/explain")
def explain_alarm(alarm_id: str):
    alarm = next((item for item in alarm_manager.alarms if item["id"] == alarm_id), None)
    if not alarm:
        return jsonify({"error": "Alarm not found"}), 404
    explanation = get_ai_explanation(alarm)
    return jsonify({"id": alarm_id, "explanation": explanation})


@app.post("/api/equipment")
def add_equipment():
    payload = request.get_json(silent=True) or {}
    alarm = alarm_manager.add_equipment(payload)
    return jsonify(alarm)


@app.get("/api/shift-report")
def shift_report():
    return jsonify(generate_shift_report(alarm_manager.alarms))


@app.get("/api/templates")
def get_templates():
    return jsonify(TEMPLATES)


@socketio.on("connect")
def handle_connect():
    socketio.emit("alarm_update", alarm_manager.get_serializable_alarms())
    socketio.emit("health_update", score_alarm_health(alarm_manager.alarms))


def _background_updates():
    while True:
        alarm_manager.update_live_values()
        socketio.emit("alarm_update", alarm_manager.get_serializable_alarms())
        socketio.emit("health_update", score_alarm_health(alarm_manager.alarms))
        time.sleep(4)


def _start_opcua_server():
    asyncio.run(run_opc_ua_server(alarm_manager))


def start_background_threads() -> None:
    global _update_thread_started
    if _update_thread_started:
        return
    _update_thread_started = True
    updater = threading.Thread(target=_background_updates, daemon=True)
    updater.start()
    opcua_thread = threading.Thread(target=_start_opcua_server, daemon=True)
    opcua_thread.start()


if __name__ == "__main__":
    alarm_manager.load_initial_alarms()
    initialize_gemini()
    start_background_threads()
    socketio.run(app, debug=True, use_reloader=False, port=5000, allow_unsafe_werkzeug=True)
