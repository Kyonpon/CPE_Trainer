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
void updateOLED(const String &message, int textSize, int cursorY)
{
  display.clearDisplay();
  display.setTextSize(textSize); // Set the font size
  display.setTextColor(WHITE);

  // Calculate the line height based on the text size
  int lineHeight = 8 * textSize; // Default line height is 8 pixels, scaled by text size

  // Ensure the cursorY does not exceed the screen height
  if (cursorY + lineHeight > SCREEN_HEIGHT)
  {
    Serial.println("Error: Text exceeds screen height.");
    return; // Exit if the text won't fit on the screen
  }

  display.setCursor(0, cursorY); // Set the cursor position
  display.println(message);      // Print the message
  display.display();             // Update the display
}

//----------------------------------------FRONT PANEL PINS-----------------------------------
#define MAX_OUTPUT_PROBE 16
#define MAX_INPUT_PROBE 4
int outputProbePins[MAX_OUTPUT_PROBE] = {A14, A12, A10, A8, A6, A4, A2, A0, 46, 44, 42, 40, 38, 36, 34, 32};
int inputProbePins[MAX_INPUT_PROBE] = {A7, A5, A3, A1}; // 41, 43, 45, 47 or A7, A5, A3, A1 layered

#define MANUAL_CHECK 45 // A1 or 45
#define START_TEST 43   // A3 or 43
#define MANUAL_SW 41    // A5 or 41
#define NC1 A7
#define NC2 A9
#define pinESP 39

void setup()
{
  // Initialize the OLED display
  initializeOLED();
  Serial.begin(115200);
  Serial2.begin(115200);
  delay(1000);
  Serial.println("Starting up...");

  updateOLED("Starting  up...", 2, 10); // Display startup message on OLED
  delay(2000);

  pinMode(NC1, INPUT);
  pinMode(NC2, INPUT);
  pinMode(MANUAL_SW, INPUT);
  pinMode(MANUAL_CHECK, INPUT);
  pinMode(START_TEST, INPUT);
  updateOLED("Checking  LED's", 2, 10); // Display setup complete message on OLED
  blinkAll(outputProbePins, inputProbePins, MAX_OUTPUT_PROBE, MAX_INPUT_PROBE, 50);
  updateOLED("Check     Serial", 2, 10); // Display setup complete message on OLED
  if (Serial2.available() > 0)
  {
    String receivedData = Serial2.readStringUntil('\n'); // Read until newline
    Serial.println("Received: " + receivedData);
  } // Clear the serial buffer
  delay(5000);
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
  updateOLED("Checking  Circuit", 2, 10); // Display setup complete message on OLED
  String result = circuitChecker(TEST_JSON);
  Serial2.write(result.c_str());
  Serial.println(result);
  updateOLED("Finished  Check  ", 2, 10); // Display setup complete message on OLED
  delay(5000);
}

void loop()
{
  if (Serial2.available() > 0)
  {
    String receivedData = Serial2.readStringUntil('\n'); // Read until newline
    Serial.println("Received: " + receivedData);
  } // Clear the serial buffer

  delay(1000);
}
