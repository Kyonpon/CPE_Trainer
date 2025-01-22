import { Container, useColorMode } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism"; // Themes for syntax highlighting

function CodeComponent({ code, language = "cpp" }) {
  /*
  const testCode = `
  // Calibration time for the PIR sensor (in seconds)
int calibrationTime = 5;        


// Time when the sensor outputs a low impulse
long unsigned int lowIn;        


// The amount of milliseconds the sensor has to be low
// before we assume all motion has stopped
long unsigned int pause = 5000;  


boolean lockLow = true;
boolean takeLowTime;  


int pirPin = 7;    // Digital pin connected to the PIR sensor's output
int ledPin = 5;    // Digital pin connected to the LED output
int Buzzer = 6;    // Digital pin connected to the BUZZER output


/////////////////////////////
// SETUP
void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(Buzzer, OUTPUT);
  digitalWrite(pirPin, LOW);


  // Give the sensor time to calibrate
  Serial.print("Calibrating sensor ");
  for (int i = 0; i < calibrationTime; i++) {
    Serial.print(".");
    delay(1000); // 1 second delay per dot
  }
  Serial.println(" done");
  Serial.println("SENSOR ACTIVE");
  delay(50);
}


////////////////////////////
// LOOP
void loop() {
  if (digitalRead(pirPin) == HIGH) {
    digitalWrite(ledPin, HIGH);   // The LED visualizes the sensor's output pin state
    tone(Buzzer, 500);
    if (lockLow) {  
      // Ensures we wait for a transition to LOW before further output
      lockLow = false;            
      Serial.println("---");
      Serial.print("Motion detected at ");
      Serial.print(millis() / 1000);
      Serial.println(" sec");
      delay(50);
    }        
    takeLowTime = true;
  }


  if (digitalRead(pirPin) == LOW) {      
    digitalWrite(ledPin, LOW);  // The LED visualizes the sensor's output pin state
    noTone(Buzzer);
    if (takeLowTime) {
      lowIn = millis();          // Save the time of the transition from HIGH to LOW
      takeLowTime = false;       // Ensure this is only done at the start of a LOW phase
    }
    // If the sensor is LOW for more than the given pause duration,
    // assume no more motion is going to happen
    if (!lockLow && millis() - lowIn > pause) {  
      lockLow = true;                        
      Serial.print("Motion ended at ");      // Output
      Serial.print((millis() - pause) / 1000);
      Serial.println(" sec");
      delay(50);
    }
  }
}

  `;
  */
  const { colorMode } = useColorMode();

  const bgColor = colorMode === "dark" ? "gray.700" : "#ababaf";
  const syntaxStyle = colorMode === "dark" ? vscDarkPlus : prism;

  return (
    <Container
      bg={bgColor}
      p={4}
      borderRadius="md"
      maxWidth="100%"
      width="95%"
      mt={2}
      mb={2}
      overflowX="auto" // Horizontal scrolling for long lines
    >
      <SyntaxHighlighter
        language={language} // Language for syntax highlighting
        style={syntaxStyle} // Style based on color mode
        customStyle={{
          background: "none", // Removes default background to use Chakra UI's bgColor
          fontSize: "0.9em", // Adjust font size
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Container>
  );
}

CodeComponent.propTypes = {
  code: PropTypes.string,
  language: PropTypes.string, // Language for syntax highlighting
};

export default CodeComponent;
