"""OPC UA server simulator."""

import asyncio

from asyncua import Server, ua


async def run_opc_ua_server(alarm_manager):
    """
    Start an OPC-UA server at opc.tcp://0.0.0.0:4840/optisense/
    Create a namespace "OptisenseHMI"
    For each alarm, create a node:
      - ns=2; s=ALARM_ID_value (the current sensor value)
      - ns=2; s=ALARM_ID_status (ACTIVE/ACKNOWLEDGED/NORMAL)
    Update all nodes every 4 seconds from alarm_manager
    Print: "OPC-UA Server running at opc.tcp://localhost:4840/optisense/"
    This is the same protocol ABB hardware uses. In production, swap this URL for a real ABB endpoint.
    """
    server = Server()
    await server.init()
    server.set_endpoint("opc.tcp://0.0.0.0:4840/optisense/")
    namespace_idx = await server.register_namespace("OptisenseHMI")
    objects = server.nodes.objects
    root = await objects.add_object(namespace_idx, "OptisenseHMI")

    value_nodes = {}
    status_nodes = {}
    for alarm in alarm_manager.alarms:
        alarm_id = alarm.get("id")
        value_node = await root.add_variable(
            namespace_idx, f"{alarm_id}_value", float(alarm.get("value", 0.0))
        )
        status_node = await root.add_variable(
            namespace_idx, f"{alarm_id}_status", "NORMAL"
        )
        await value_node.set_writable()
        await status_node.set_writable()
        value_nodes[alarm_id] = value_node
        status_nodes[alarm_id] = status_node

    print("OPC-UA Server running at opc.tcp://localhost:4840/optisense/")

    async with server:
        while True:
            for alarm in alarm_manager.alarms:
                alarm_id = alarm.get("id")
                status = "NORMAL"
                if alarm.get("acknowledged"):
                    status = "ACKNOWLEDGED"
                elif float(alarm.get("value", 0.0)) >= float(alarm.get("threshold", 0.0)):
                    status = "ACTIVE"
                value_node = value_nodes.get(alarm_id)
                status_node = status_nodes.get(alarm_id)
                if value_node:
                    await value_node.write_value(ua.Variant(float(alarm.get("value", 0.0)), ua.VariantType.Float))
                if status_node:
                    await status_node.write_value(status)
            await asyncio.sleep(4)
