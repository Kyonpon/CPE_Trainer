#include "serializedPacket.h"
#include <Arduino.h>
#include <ArduinoJson.h>

String sendResult()
{
    Serial2.begin(115200);
    String data;
    if (Serial2.available())
    {
        data = Serial2.readStringUntil('\n');
        data.trim(); // Removes leading and trailing whitespace, including newlines
        Serial.println(data);
    }
    if (data.length() > 0)
    {
        const char *resultCircuit = data.c_str();
        JsonDocument deserData;
        JsonDocument toServer;
        DeserializationError error = deserializeJson(deserData, resultCircuit);
        if (error)
        {
            Serial.print(F("deserializeJson() failed: "));
            Serial.println(error.f_str());
            return "Failed to deserialize JSON";
        }
        JsonObject root = deserData.as<JsonObject>();
        JsonArray passArray = root["isPassed"].as<JsonArray>();
        JsonObject result = root["outputsActual"];

        // Serialized
        String packagedData;
        toServer["moduleName"] = "Module1";
        toServer["isPassed"] = passArray;
        toServer["outputsActual"] = result;
        serializeJson(toServer, Serial);
        serializeJson(toServer, packagedData);
        return packagedData;
    }
}