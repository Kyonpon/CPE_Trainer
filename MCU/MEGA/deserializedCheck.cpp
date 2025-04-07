#include "deserializedCheck.h"
#include <Arduino.h>
#include <ArduinoJson.h>

const int MAX_INPUT_PROBE = 4;
const int MAX_OUTPUT_PROBE = 16;
int INPUT_PROBE_PINS[MAX_INPUT_PROBE] = {41, 43, 45, 47};
int OUTPUT_PROBE_PINS[MAX_OUTPUT_PROBE] = {A14, A12, A10, A8, A6, A4, A2, A0, 46, 44, 42, 40, 38, 36, 34, 32};

void printArray(int *array, int arr_size)
{
    for (int i = 0; i < arr_size; i++)
    {
        Serial.print(array[i]);
    }
}

String circuitChecker(String apiJSON)
{
    const char *testCircuit = apiJSON.c_str();
    Serial2.begin(115200);

    // Setup for the circuit input and circuit output probes
    for (int i = 0; i < MAX_INPUT_PROBE; i++)
    {
        pinMode(INPUT_PROBE_PINS[i], OUTPUT);
    }

    for (int i = 0; i < MAX_OUTPUT_PROBE; i++)
    {
        pinMode(OUTPUT_PROBE_PINS[i], INPUT);
    }

    JsonDocument jsonDoc;

    DeserializationError error = deserializeJson(jsonDoc, testCircuit);
    if (error)
    {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.c_str());
        return "Failed to deserialize JSON";
    }

    JsonObject circuitInputs = jsonDoc["inputs"].as<JsonObject>();
    JsonObject circuitOutputs = jsonDoc["outputs"].as<JsonObject>();

    // Grabbing the first key value pair in the circuit inputs (needed to determine the row)

    JsonPair firstKVCircuitInput = *circuitInputs.begin();
    const char *firstKeyCircuitInput = firstKVCircuitInput.key().c_str();
    JsonArray firstValueCircuitInput = firstKVCircuitInput.value().as<JsonArray>();
    int circuitInputColumnLength = circuitInputs.size();
    int circuitOutputColumnLength = circuitOutputs.size();
    int testIteration = firstValueCircuitInput.size();

    int columnIterator = 0;
    int digitalWriteSet[circuitInputColumnLength] = {};
    int expectedOutput[circuitOutputColumnLength] = {};
    int actualOutput[circuitOutputColumnLength] = {};
    int isPassedTest[testIteration] = {};

    JsonDocument resultDoc;
    JsonObject outputs = resultDoc["outputsActual"].to<JsonObject>();
    JsonArray outputsNames = resultDoc["outputsNames"].to<JsonArray>();
    JsonArray resultArray = resultDoc["isPassed"].to<JsonArray>();
    String JsonString;

    for (JsonPair kv : circuitOutputs)
    {
        const char *key = kv.key().c_str();
        JsonArray arr = outputs.createNestedArray(key);
        outputsNames.add(key);
    }
    serializeJsonPretty(resultDoc, Serial);
    Serial.println("");
    for (int rowIndex = 0; rowIndex < testIteration; rowIndex++)
    {
        int isPassed = 1;

        for (JsonPair kv : circuitInputs)
        {
            JsonArray currentRowValue = kv.value().as<JsonArray>();
            digitalWriteSet[columnIterator] = currentRowValue[rowIndex].as<int>();
            columnIterator++;
        }
        for (int i = 0; i < circuitInputColumnLength; i++)
        {
            digitalWrite(INPUT_PROBE_PINS[i], digitalWriteSet[i]);
        }
        columnIterator = 0;

        for (JsonPair kv : circuitOutputs)
        {
            JsonArray currentRowValue = kv.value().as<JsonArray>();
            expectedOutput[columnIterator] = currentRowValue[rowIndex].as<int>();
            columnIterator++;
        }

        for (int i = 0; i < circuitOutputColumnLength; i++)
        {
            actualOutput[i] = digitalRead(OUTPUT_PROBE_PINS[i]);
        }
        for (int i = 0; i < circuitOutputColumnLength; i++)
        {
            outputs[outputsNames[i]][rowIndex] = actualOutput[i];
        }
        for (int i = 0; i < circuitOutputColumnLength; i++)
        {
            if (expectedOutput[i] != actualOutput[i])
            {
                isPassed = 0;
                break;
            }
        }
        isPassedTest[rowIndex] = isPassed;
        columnIterator = 0;
        resultArray.add(isPassedTest[rowIndex]);

        Serial.print("Test ");
        Serial.print(rowIndex);
        Serial.println(":");

        Serial.print("  Inputs     -> ");
        printArray(digitalWriteSet, circuitInputColumnLength);

        Serial.print("  Expected   -> ");
        printArray(expectedOutput, circuitOutputColumnLength);

        Serial.print("  Actual     -> ");
        printArray(actualOutput, circuitOutputColumnLength);

        Serial.print("  Result     -> ");
        Serial.println(isPassedTest[rowIndex]);
        Serial.println("---------------------------------"); // Separator for clarity
        serializeJson(resultDoc, Serial2);
        delay(2000);
    }

    for (int i = 0; i < testIteration; i++)
    {
    }

    serializeJson(resultDoc, JsonString);
    return JsonString;
}