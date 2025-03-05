export const substituteVariables = (expression, variables, data) =>
  variables.reduce(
    (exp, v, idx) => exp.replace(new RegExp(v, "g"), data[idx]),
    expression
  );

export const solve = (equation) => {
  while (equation.includes("(")) {
    const start = equation.lastIndexOf("(");
    const end = equation.indexOf(")", start);
    equation =
      equation.substring(0, start) +
      solve(equation.substring(start + 1, end)) +
      equation.substring(end + 1);
  }

  equation = equation
    .replace(/''/g, "")
    .replace(/0'/g, "1")
    .replace(/1'/g, "0");
  equation = equation
    .replace(/(\d)(?=\d)/g, "$1*")
    .replace(/(\d)\^(\d)/g, "($1 ^ $2)");

  try {
    return eval(equation) ? 1 : 0;
  } catch {
    return "";
  }
};

export const generateTable = (expression, variables) => {
  let tableHTML = `
      <div style="font-weight: 500; padding: 16px;">Truth Table:</div>
      <div class="scrolltable">
        <table align='center'>
          <tr>
            <th>min</th>
            ${variables.map((v) => `<th>${v}</th>`).join("")}
            <th style="font-style: italic">F()</th>
          </tr>`;

  let minTerms = [];
  let maxTerms = [];
  let fColumnValues = [];

  for (let i = 0; i < 1 << variables.length; i++) {
    const data = variables.map((_, j) => (i >> (variables.length - j - 1)) & 1);
    const substitutedExpression = substituteVariables(
      expression,
      variables,
      data
    );
    const solution = solve(substitutedExpression);

    fColumnValues.push(solution);
    tableHTML += `<tr><td>${i}</td>${data
      .map((d) => `<td>${d}</td>`)
      .join("")}<td>${solution}</td></tr>`;
    solution == 1 ? minTerms.push(i) : maxTerms.push(i);
  }

  tableHTML += "</table>";
  return [tableHTML, minTerms, maxTerms, fColumnValues];
};

export const generateKMap = (minTerms, variables) => {
  const numVars = variables.length;
  if (numVars < 2 || numVars > 6) {
    return `<p style="padding: 16px; font-weight: 500;">K-map generation is supported for 2 to 6 variables.</p>`;
  }

  let rowVars = [];
  let colVars = [];
  let rowLabels = [];
  let colLabels = [];
  let planeVars = [];
  let planeLabels = [];
  let kmapMinterms = [];

  if (numVars == 2) {
    rowVars = [variables[0]];
    colVars = [variables[1]];
    rowLabels = ["0", "1"];
    colLabels = ["0", "1"];
    kmapMinterms = [
      [0, 1],
      [2, 3],
    ];
  } else if (numVars == 3) {
    rowVars = [variables[0]];
    colVars = [variables[1], variables[2]];
    rowLabels = ["0", "1"];
    colLabels = ["00", "01", "11", "10"];
    kmapMinterms = [
      [0, 1, 3, 2],
      [4, 5, 7, 6],
    ];
  } else if (numVars == 4) {
    rowVars = [variables[0], variables[1]];
    colVars = [variables[2], variables[3]];
    rowLabels = ["00", "01", "11", "10"];
    colLabels = ["00", "01", "11", "10"];
    kmapMinterms = [
      [0, 1, 3, 2],
      [4, 5, 7, 6],
      [12, 13, 15, 14],
      [8, 9, 11, 10],
    ];
  } else if (numVars == 5) {
    rowVars = [variables[0], variables[1]];
    colVars = [variables[2], variables[3]];
    planeVars = [variables[4]];
    rowLabels = ["00", "01", "11", "10"];
    colLabels = ["00", "01", "11", "10"];
    planeLabels = ["0", "1"];

    const baseKmap = [
      [0, 1, 3, 2],
      [4, 5, 7, 6],
      [12, 13, 15, 14],
      [8, 9, 11, 10],
    ];

    const kmap0 = baseKmap;
    const kmap1 = baseKmap.map((row) => row.map((cell) => cell + 16));
    kmapMinterms = [kmap0, kmap1];
  } else if (numVars == 6) {
    rowVars = [variables[0], variables[1]];
    colVars = [variables[2], variables[3]];
    planeVars = [variables[4], variables[5]];
    rowLabels = ["00", "01", "11", "10"];
    colLabels = ["00", "01", "11", "10"];
    planeLabels = ["00", "01", "11", "10"];

    const baseKmap = [
      [0, 1, 3, 2],
      [4, 5, 7, 6],
      [12, 13, 15, 14],
      [8, 9, 11, 10],
    ];

    const planeOffsets = [0, 16, 48, 32]; // Gray code order
    const kmapPlanes = planeOffsets.map((offset) =>
      baseKmap.map((row) => row.map((cell) => cell + offset))
    );
    kmapMinterms = kmapPlanes;
  }

  let kmapHTML = `
      <div style="font-weight: 500; padding: 16px;">Karnaugh Map:</div>`;

  if (numVars <= 4) {
    kmapHTML += `<table>`;
    kmapHTML += `<tr><th rowspan="2" colspan="2"></th><th colspan="${
      colLabels.length
    }">${colVars.join("")}</th></tr>`;
    kmapHTML += `<tr>`;
    for (let j = 0; j < colLabels.length; j++) {
      kmapHTML += `<th>${colLabels[j]}</th>`;
    }
    kmapHTML += `</tr>`;

    for (let i = 0; i < rowLabels.length; i++) {
      if (i === 0) {
        kmapHTML += `<tr><th rowspan="${rowLabels.length}">${rowVars.join(
          ""
        )}</th><th>${rowLabels[i]}</th>`;
      } else {
        kmapHTML += `<tr><th>${rowLabels[i]}</th>`;
      }
      for (let j = 0; j < colLabels.length; j++) {
        const mintermIndex = kmapMinterms[i][j];
        const value = minTerms.includes(mintermIndex) ? 1 : 0;
        const isDarkMode = document.body.classList.contains("dark-mode");
        const cellStyle =
          value === 1
            ? `style="background-color: ${isDarkMode ? "#444" : "#e9ecef"};"`
            : "";
        kmapHTML += `<td ${cellStyle}>${value}</td>`;
      }
      kmapHTML += `</tr>`;
    }
    kmapHTML += `</table>`;
  } else if (numVars == 5) {
    for (let p = 0; p < kmapMinterms.length; p++) {
      const planeLabel = planeLabels[p];
      kmapHTML += `<div style="display: inline-block; margin-right: 20px;">`;
      kmapHTML += `<div style="font-weight: 500; padding: 8px;">${planeVars.join(
        ""
      )} = ${planeLabel}</div>`;
      kmapHTML += `<table>`;
      kmapHTML += `<tr><th rowspan="2" colspan="2"></th><th colspan="${
        colLabels.length
      }">${colVars.join("")}</th></tr>`;
      kmapHTML += `<tr>`;
      for (let j = 0; j < colLabels.length; j++) {
        kmapHTML += `<th>${colLabels[j]}</th>`;
      }
      kmapHTML += `</tr>`;

      for (let i = 0; i < rowLabels.length; i++) {
        if (i === 0) {
          kmapHTML += `<tr><th rowspan="${rowLabels.length}">${rowVars.join(
            ""
          )}</th><th>${rowLabels[i]}</th>`;
        } else {
          kmapHTML += `<tr><th>${rowLabels[i]}</th>`;
        }
        for (let j = 0; j < colLabels.length; j++) {
          const mintermIndex = kmapMinterms[p][i][j];
          const value = minTerms.includes(mintermIndex) ? 1 : 0;
          const isDarkMode = document.body.classList.contains("dark-mode");
          const cellStyle =
            value === 1
              ? `style="background-color: ${isDarkMode ? "#444" : "#e9ecef"};"`
              : "";
          kmapHTML += `<td ${cellStyle}>${value}</td>`;
        }
        kmapHTML += `</tr>`;
      }
      kmapHTML += `</table>`;
      kmapHTML += `</div>`;
    }
  } else if (numVars == 6) {
    kmapHTML += `<table>`;
    for (let pRow = 0; pRow < 2; pRow++) {
      kmapHTML += `<tr>`;
      for (let pCol = 0; pCol < 2; pCol++) {
        const pIndex = pRow * 2 + pCol;
        const planeLabel = planeLabels[pIndex];
        kmapHTML += `<td style="vertical-align: top;">`;
        kmapHTML += `<div style="font-weight: 500; padding: 8px;">${planeVars.join(
          ""
        )} = ${planeLabel}</div>`;
        kmapHTML += `<table>`;
        kmapHTML += `<tr><th rowspan="2" colspan="2"></th><th colspan="${
          colLabels.length
        }">${colVars.join("")}</th></tr>`;
        kmapHTML += `<tr>`;
        for (let j = 0; j < colLabels.length; j++) {
          kmapHTML += `<th>${colLabels[j]}</th>`;
        }
        kmapHTML += `</tr>`;

        for (let i = 0; i < rowLabels.length; i++) {
          if (i === 0) {
            kmapHTML += `<tr><th rowspan="${rowLabels.length}">${rowVars.join(
              ""
            )}</th><th>${rowLabels[i]}</th>`;
          } else {
            kmapHTML += `<tr><th>${rowLabels[i]}</th>`;
          }
          for (let j = 0; j < colLabels.length; j++) {
            const mintermIndex = kmapMinterms[pIndex][i][j];
            const value = minTerms.includes(mintermIndex) ? 1 : 0;
            const isDarkMode = document.body.classList.contains("dark-mode");
            const cellStyle =
              value === 1
                ? `style="background-color: ${
                    isDarkMode ? "#444" : "#e9ecef"
                  };"`
                : "";
            kmapHTML += `<td ${cellStyle}>${value}</td>`;
          }
          kmapHTML += `</tr>`;
        }
        kmapHTML += `</table>`;
        kmapHTML += `</td>`;
      }
      kmapHTML += `</tr>`;
    }
    kmapHTML += `</table>`;
  }

  return kmapHTML;
};

export const generateSOP = (minterms, variables) => {
  const numVars = variables.length;
  if (numVars < 2) {
    return ``;
  }
  function getBinaryMinterms(minterms, numVariables) {
    return minterms.map((minterm) => {
      let binary = minterm.toString(2).padStart(numVariables, "0");
      return {
        value: [minterm],
        binary: binary,
        combined: false,
      };
    });
  }

  function groupMintermsByOnes(binaryMinterms) {
    const groups = {};
    binaryMinterms.forEach((term) => {
      const onesCount = term.binary
        .split("")
        .filter((bit) => bit === "1").length;
      if (!groups[onesCount]) groups[onesCount] = [];
      groups[onesCount].push(term);
    });
    return groups;
  }

  function getDifference(bin1, bin2) {
    let count = 0;
    let index = -1;
    for (let i = 0; i < bin1.length; i++) {
      if (bin1[i] !== bin2[i]) {
        count++;
        index = i;
      }
    }
    return { count, index };
  }

  function replaceCharAt(str, index, char) {
    return str.substr(0, index) + char + str.substr(index + 1);
  }

  function combineMinterms(groups) {
    const newGroups = {};
    const combinedTerms = [];
    const groupNumbers = Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b);
    let isCombined = false;

    for (let i = 0; i < groupNumbers.length - 1; i++) {
      const groupA = groups[groupNumbers[i]];
      const groupB = groups[groupNumbers[i + 1]];

      groupA.forEach((termA) => {
        groupB.forEach((termB) => {
          const diff = getDifference(termA.binary, termB.binary);
          if (diff.count === 1) {
            const combinedBinary = replaceCharAt(termA.binary, diff.index, "-");
            const combinedMinterm = {
              value: [...new Set([...termA.value, ...termB.value])],
              binary: combinedBinary,
              combined: false,
            };
            termA.combined = termB.combined = true;
            if (
              !combinedTerms.some(
                (term) =>
                  term.binary === combinedBinary &&
                  arraysEqual(term.value, combinedMinterm.value)
              )
            ) {
              combinedTerms.push(combinedMinterm);
              const onesCount = combinedBinary
                .split("")
                .filter((bit) => bit === "1").length;
              if (!newGroups[onesCount]) newGroups[onesCount] = [];
              newGroups[onesCount].push(combinedMinterm);
            }
            isCombined = true;
          }
        });
      });
    }
    return { newGroups, combinedTerms, isCombined };
  }

  function arraysEqual(a1, a2) {
    return JSON.stringify(a1.sort()) === JSON.stringify(a2.sort());
  }

  function extractPrimeImplicants(allTerms) {
    const uniqueTerms = [];
    allTerms.forEach((term) => {
      if (
        !uniqueTerms.some((uniqueTerm) => uniqueTerm.binary === term.binary)
      ) {
        uniqueTerms.push(term);
      }
    });
    return uniqueTerms.filter((term) => !term.combined);
  }

  function createPrimeImplicantChart(primeImplicants, minterms) {
    const chart = {};
    minterms.forEach((minterm) => {
      chart[minterm] = [];
      primeImplicants.forEach((pi, index) => {
        if (pi.value.includes(minterm)) {
          chart[minterm].push(index);
        }
      });
    });
    return chart;
  }

  function selectEssentialPrimeImplicants(chart, primeImplicants) {
    const essentialPIs = [];
    const coveredMinterms = new Set();

    for (let minterm in chart) {
      if (chart[minterm].length === 1) {
        const piIndex = chart[minterm][0];
        if (!essentialPIs.includes(piIndex)) {
          essentialPIs.push(piIndex);
          primeImplicants[piIndex].value.forEach((val) =>
            coveredMinterms.add(val)
          );
        }
      }
    }
    for (let minterm of coveredMinterms) {
      delete chart[minterm];
    }

    return { essentialPIs, remainingChart: chart };
  }
  function binaryToExpression(binaryStr, variables) {
    let expressionParts = [];
    for (let i = 0; i < binaryStr.length; i++) {
      if (binaryStr[i] !== "-") {
        expressionParts.push(
          binaryStr[i] === "1" ? variables[i] : variables[i] + "'"
        );
      }
    }
    expressionParts.sort();
    return expressionParts.join("");
  }
  function getFinalExpression(selectedPIs, primeImplicants, variables) {
    const productTerms = selectedPIs.map((piIndex) =>
      binaryToExpression(primeImplicants[piIndex].binary, variables)
    );
    productTerms.sort();
    return productTerms.join(" + ");
  }
  const numVariables = variables.length;
  let binaryMinterms = getBinaryMinterms(minterms, numVariables);
  let groups = groupMintermsByOnes(binaryMinterms);
  let allTerms = binaryMinterms.slice();
  let isCombined;
  do {
    let result = combineMinterms(groups);
    let { newGroups, combinedTerms } = result;
    isCombined = result.isCombined;
    allTerms = allTerms.concat(combinedTerms);
    groups = newGroups;
  } while (Object.keys(groups).length > 0 && isCombined);
  let primeImplicants = extractPrimeImplicants(allTerms);
  let primeImplicantChart = createPrimeImplicantChart(
    primeImplicants,
    minterms
  );
  let { essentialPIs, remainingChart } = selectEssentialPrimeImplicants(
    primeImplicantChart,
    primeImplicants
  );
  let selectedPIs = essentialPIs.slice();
  if (Object.keys(remainingChart).length > 0) {
    const mintermPIs = {};
    for (let minterm in remainingChart) {
      remainingChart[minterm].forEach((piIndex) => {
        if (!mintermPIs[piIndex]) mintermPIs[piIndex] = new Set();
        mintermPIs[piIndex].add(Number(minterm));
      });
    }
    const sortedPIs = Object.entries(mintermPIs).sort(
      (a, b) => b[1].size - a[1].size
    );
    const coveredMinterms = new Set();
    sortedPIs.forEach(([piIndex, mintermSet]) => {
      if ([...mintermSet].some((m) => !coveredMinterms.has(m))) {
        selectedPIs.push(Number(piIndex));
        mintermSet.forEach((m) => coveredMinterms.add(m));
      }
    });
  }
  selectedPIs = [...new Set(selectedPIs)];

  let minimizedExpression = getFinalExpression(
    selectedPIs,
    primeImplicants,
    variables
  );

  return minimizedExpression;
};


export const moduleAddBoolFunction = (functionName, moduleBoolSolverInstance)=>{
  const trimmedFunctionName = functionName.trim().toUpperCase();
  if (!trimmedFunctionName) {
    return { success: false, message: "Function name cannot be empty" };
  }
  if (trimmedFunctionName in moduleBoolSolverInstance) {
    return {
      success: false,
      message: `Function "${trimmedFunctionName}" already exists`,
    }
  }
  const output = {
      Variables:[],
      InputsTT:{},
      ExpressionOutput:[],
      EspressionSOP: "",
      FinalTT: {},
  }

  return output
}

export const moduleHandleInputInstance= (booleanExpression, trimmedFunctionName) =>{
  let variables = [];
  let solvedMinterms =[];
  let expressionOut = [];

  const handleExpressionChange = (newBooleanExpression) => {
    if (!newBooleanExpression) {
      variables = [];
      solvedMinterms = [];
      expressionOut = [];
    }

    const uniqueVariables = [
      ...new Set(newBooleanExpression.match(/[A-Z]/g)),
    ].sort();
    if (uniqueVariables.length > 8) {
      alert("You can only have up to 8 variables.");
      return;
    }

    const [tableHTML, minTerms, maxTerms, fColumnValues] = generateTable(
      newBooleanExpression,
      uniqueVariables
    );

    variables = uniqueVariables;
    expressionOut = fColumnValues;
    solvedMinterms = minTerms;
    const solvedExpression = generateSOP(solvedMinterms, variables);


    function generateTruthTable(vars) {
      const n = vars.length; // Number of variables
      const totalCombinations = Math.pow(2, n); // 2^n possible combinations
      const inputsTT = {};

      // Initialize each variable with an empty array
      vars.forEach((variable) => {
        inputsTT[variable] = [];
      });

      for (let i = 0; i < totalCombinations; i++) {
        // For each variable, determine the bit value for that variable in the current combination
        for (let j = 0; j < n; j++) {
          const value = (i >> (n - j - 1)) & 1; // Calculate the bit for the current variable
          inputsTT[vars[j]].push(value);
        }
      }

      return inputsTT;
    }

    const inputsTT = generateTruthTable(variables);
    const FinalTT = {};
    Object.keys(inputsTT).forEach((variable) => {
      FinalTT[variable] = inputsTT[variable];
    });
    FinalTT[trimmedFunctionName] = expressionOut;

    const newBoolInstance = {
        Variables: uniqueVariables,
        InputsTT: inputsTT,
        ExpressionOutput: fColumnValues,
        ExpressionSOP: generateSOP(minTerms, uniqueVariables),
        FinalTT: FinalTT,
    }
    return newBoolInstance
  }

  return handleExpressionChange(booleanExpression)

}

export const moduleFinalTable = (moduleSolverInstances= {}) =>{
  if(!moduleSolverInstances){
    return {
      success: false,
      message: "No instances found",
    }
  }

  if(Object.keys(moduleSolverInstances).length == 0){
    return console.log("No Instances provided. Ignoring boolean menus.");
  }

  const firstFunctionName = Object.keys(moduleSolverInstances)[0];
  const firstFunctionObject = moduleSolverInstances[firstFunctionName];
  const firstFunctionVariables = firstFunctionObject.InputsTT;

  const expressionNamesAndOutput = {};
  Object.keys(moduleSolverInstances).forEach((functionName) => {
    expressionNamesAndOutput[functionName] =
    moduleSolverInstances[functionName].ExpressionOutput;
  });

  const CfinalTable = {
    ...firstFunctionVariables,
    ...expressionNamesAndOutput,
  };
  return CfinalTable
}
