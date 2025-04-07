#ifndef DESERIALIZEDCHECK_H
#define DESERIALIZEDCHECK_H
#include <Arduino.h>
#include <ArduinoJson.h>

extern int INPUT_PROBE_PINS[];
extern int OUTPUT_PROBE_PINS[];
extern const int MAX_INPUT_PROBE;
extern const int MAX_OUTPUT_PROBE;

String circuitChecker(String apiJSON);
void printArray(int *array, int arr_size);

#endif