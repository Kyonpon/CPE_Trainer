#include <Arduino.h>
#include <WiFi.h>
#include <HttpClient.h>
#include <ArduinoJson.h>

const char *ssid = "Tenda_861E70";                                                       // your network SSID (name)
const char *password = "Kyonpon05";                                                      // your network password
const char *server = "http://192.168.0.200:5000/api/circuitchecker/testresults/Module1"; // your server URL
const char *moduleName = "Module1";                                                      // your module name
void setup()
{
    Serial.begin(115200);
    Serial2.begin(115200, SERIAL_8N1, 16, 17); // RX, TX
    WiFi.begin(ssid, password);

    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    } // lock loop

    Serial.println("Connected to WiFi");
}

void loop()
{

    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        String data;
        http.begin(server);
        http.addHeader("Content-Type", "application/json");

        if (Serial2.available())
        {
            data = Serial2.readStringUntil('\n');
            data.trim(); // Removes leading and trailing whitespace, including newlines
            Serial.println(data);

            const char *resultCircuit = data.c_str();
            JsonDocument deserData;
            JsonDocument toServer;
            DeserializationError error = deserializeJson(deserData, resultCircuit);
            if (error)
            {
                Serial.print(F("deserializeJson() failed: "));
                Serial.println(error.f_str());
                return;
            }
            JsonObject root = deserData.as<JsonObject>();
            JsonArray passArray = root["isPassed"].as<JsonArray>();
            JsonObject result = root["outputsActual"];

            // Serialized
            String packagedData;
            toServer["moduleName"] = moduleName;
            toServer["isPassed"] = passArray;
            toServer["outputsActual"] = result;
            serializeJson(toServer, packagedData);

            // Send the POST request with the JSON data
            int httpResponseCode = http.POST(packagedData);
            if (httpResponseCode > 0)
            {
                String response = http.getString();
                Serial.println("Server response: " + response);
            }
            else
            {
                Serial.println("Error sending POST: " + String(httpResponseCode));
            }

            http.end();
        }
    }
}
