#include "rundownInputOutputs.h"
#include <Arduino.h>

void blinkAll(int inputs[], int outputs[], int numInputs, int numOutputs, int delayTime)
{
    for (int i = 0; i < numOutputs; i++)
    {
        pinMode(outputs[i], OUTPUT);
    }
    for (int i = 0; i < numInputs; i++)
    {
        pinMode(inputs[i], OUTPUT);
    }

    for (int i = 0; i < numOutputs; i++)
    {
        digitalWrite(outputs[i], HIGH);
        delay(delayTime);
        digitalWrite(outputs[i], LOW);
        delay(delayTime);
    }
    for (int i = 0; i < numInputs; i++)
    {
        digitalWrite(inputs[i], HIGH);
        delay(delayTime);
        digitalWrite(inputs[i], LOW);
        delay(delayTime);
    }
}