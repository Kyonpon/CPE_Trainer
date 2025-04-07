#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "rundownInputOutputs.h"
#include "deserializedCheck.h"

// OLED display configuration
#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels
#define OLED_RESET -1     // Reset pin (not used with I2C)
#define OLED_ADDRESS 0x3C // I2C address for the display

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Function to initialize the OLED display
void initializeOLED()
{
    Serial.println("Initializing OLED...");
    if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS))
    {
        Serial.println(F("SSD1306 allocation failed. Check wiring or I2C address."));
        while (true)
        {
            delay(100); // Infinite loop to halt execution
        }
    }
    Serial.println("OLED initialized successfully.");

    // Clear and display a startup message
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.setCursor(0, 10);
    display.println("System Starting...");
    display.display();
    delay(2000); // Pause to show the message
}

// Function to update the OLED display with custom text
void updateOLED(const String &message)
{
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.setCursor(0, 0);
    display.println(message);
    display.display();
}

//----------------------------------------FRONT PANEL PINS-----------------------------------
#define MAX_OUTPUT_PROBE 16
#define MAX_INPUT_PROBE 4
int outputProbePins[MAX_OUTPUT_PROBE] = {A14, A12, A10, A8, A6, A4, A2, A0, 46, 44, 42, 40, 38, 36, 34, 32};
int inputProbePins[MAX_INPUT_PROBE] = {41, 43, 45, 47};

#define MANUAL_CHECK A1
#define START_TEST A3
#define MANUAL_SW A5
#define NC1 A7
#define NC2 A9

void setup()
{
    // Initialize the OLED display
    initializeOLED();
    Serial.begin(115200);
    Serial2.begin(115200);
    delay(1000);
    Serial.println("Starting up...");
    updateOLED("Hello, world!");
    delay(2000);
    updateOLED("Testing OLED...");

    pinMode(NC1, INPUT);
    pinMode(NC2, INPUT);
    pinMode(MANUAL_SW, INPUT);
    pinMode(MANUAL_CHECK, INPUT);
    pinMode(START_TEST, INPUT);
    // blinkAll(outputProbePins, inputProbePins, MAX_OUTPUT_PROBE, MAX_INPUT_PROBE, 100);
    String TEST_JSON = R"rawliteral(
        {
          "inputs": {
            "A": [0, 0, 0, 0, 1, 1, 1, 1],
            "B": [0, 0, 1, 1, 0, 0, 1, 1],
            "C": [0, 1, 0, 1, 0, 1, 0, 1]
          },
          "outputs": {
            "Sum": [0, 1, 1, 0, 1, 0, 0, 1],
            "Carry": [0, 0, 0, 1, 0, 1, 1, 1]
          }
        }
      )rawliteral";
    String result = circuitChecker(TEST_JSON);
    Serial2.write(result.c_str());
    Serial.println(result);
    delay(5000);
}

void loop()
{
    Serial.println("");
    Serial.println("TEST PINS");
    Serial.print("NC1: ");
    Serial.println(digitalRead(NC1));
    Serial.print("NC2: ");
    Serial.println(digitalRead(NC2));
    Serial.print("MANUAL_SW: ");
    Serial.println(digitalRead(MANUAL_SW));
    Serial.print("MANUAL_CHECK: ");
    Serial.println(digitalRead(MANUAL_CHECK));
    Serial.print("START_TEST: ");
    Serial.println(digitalRead(START_TEST));

    delay(1000);
}
