import { Box, Grid, GridItem, HStack, Stack } from "@chakra-ui/react";
import React, { useState } from "react";

function TwoInputVizualizer() {
  const [pinStatuses, setPinStatuses] = useState([
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  ]);
  //[VCC, GATE4A, GATE4B, GATE4Y, GATE3A, GATE3B, GATE3Y,GATE1A, GATE1B, GATE1Y,GATE2A, GATE2B, GATE2Y,]

  const ICName = "IC 7400";
  const scale = 3; // Change this value to scale the entire IC (1 = normal, 2 = double, 0.5 = half)
  const originalWidth = 400;
  const originalHeight = 125;
  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;
  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${scaledWidth} ${scaledHeight}`}
    >
      <g transform={`scale(${scale})`} transformOrigin="center">
        {/* IC Body */}
        <rect
          x="100"
          y="20"
          width="220"
          height="65"
          fill="black"
          stroke="gray"
          strokeWidth="2"
          rx="5"
        />

        {/* Notch or Indicator Circle */}
        <circle cx="106" cy="53" r="7" fill="gray" />

        {/* Top Row: Pins 14 to 8 */}
        {pinStatuses.slice(0, 7).map((status, index) => (
          <g key={`top-${index}`}>
            <rect
              x={110 + index * 30}
              y="10"
              width="20"
              height="20"
              fill={status ? "green" : "red"}
              stroke="black"
              rx="3"
            />
            <text x={111 + index * 30} y="25" fontSize="14" fill="white">
              {14 - index}
            </text>
          </g>
        ))}

        {/* Bottom Row: Pins 1 to 7 */}
        {pinStatuses.slice(7).map((status, index) => (
          <g key={`bottom-${index}`}>
            <rect
              x={110 + index * 30}
              y="75"
              width="20"
              height="20"
              fill={status ? "green" : "red"}
              stroke="black"
              rx="3"
            />
            <text x={116 + index * 30} y="90" fontSize="14" fill="white">
              {index + 1}
            </text>
          </g>
        ))}

        {/* IC Label */}
        <text x="185" y="60" fontSize="16" fill="white">
          {ICName}
        </text>
      </g>
    </svg>
  );
}

export default TwoInputVizualizer;
