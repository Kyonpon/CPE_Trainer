#include <Arduino.h>
#include <WiFi.h>
#include <HttpClient.h>
#include <ArduinoJson.h>
#include "serializedPacket.h"

const char *ssid = "Tenda_861E70";  // your network SSID (name)
const char *password = "Kyonpon05"; // your network password
const char *postAPI = "http://192.168.0.200:5000/api/circuitchecker/testresults/Module1";
const char *getAPI = "http://192.168.0.200:5000/api/circuitchecker/testdata/Module1";
const char *moduleName = "Module1"; // your module name
String prevResponse = "NOTHING";

#define ROTARY_SWITCH 32
#define ROTARY_A 33
#define ROTARY_B 34

void fetchTestData()
{
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        http.begin(getAPI);
        String response;

        int httpResponseCode = http.GET();
        if (httpResponseCode > 0)
        {
            response = http.getString();

            if (response == prevResponse)
            {
                Serial.println("No new data received.");
                return;
            }
            else
            {
                Serial.println("New data received.");
                Serial.println("Server response: " + response);
                prevResponse = response;
            }
        }
        else
        {
            Serial.println("Error sending GET: " + String(httpResponseCode));
        }

        http.end();
    }
}

void setup()
{
    pinMode(ROTARY_SWITCH, INPUT);
    Serial.begin(115200);
    Serial2.begin(9600, SERIAL_8N1, 16, 17); // RX, TX
    WiFi.begin(ssid, password);

    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println("Connected to WiFi");
}

void loop()
{

    while (digitalRead(ROTARY_SWITCH) == LOW)
    {
        fetchTestData();
        delay(1000);
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        http.begin(postAPI);
        http.addHeader("Content-Type", "application/json");
        if (Serial2.available())
        {
            int httpResponseCode = http.POST(sendResult());
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
    Serial.println("Sending data to MEGA...");
    Serial2.println(prevResponse);
    delay(1000);
}
