import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  YAxis,
  XAxis,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Flex, Text, Box } from "@chakra-ui/react";

const SignalChart = ({ title, data, showToggleLines = false }) => {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <Flex align="center" w="100%">
      {/* Signal Label */}
      <Text w="60px" textAlign="right" fontWeight="medium">
        {title}
      </Text>

      {/* Responsive container for chart */}
      <Box flex="1" h="100px">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="index"
              hide
              type="number"
              domain={["dataMin", "dataMax"]}
            />
            <YAxis
              type="number"
              domain={[-0.5, 1.5]}
              ticks={[0, 1]}
              axisLine={false}
              tickLine={false}
              width={20}
            />

            {/* Optional toggle lines */}
            {showToggleLines &&
              chartData.map((_, index) => (
                <ReferenceLine
                  key={index}
                  x={index}
                  stroke="#aaa"
                  strokeDasharray="2 2"
                />
              ))}

            <Line
              type="stepAfter"
              dataKey="value"
              stroke="#00bcd4"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Flex>
  );
};

export default SignalChart;
