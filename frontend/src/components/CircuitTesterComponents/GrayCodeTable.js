export const fourInputGrayCode = {
    A:  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
    B:  [0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1],
    C:  [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1],
    D:  [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    B3: [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],            // = A
    B2: [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],            // = A ^ B
    B1: [0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0],            // = B ^ C
    B0: [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],            // = C ^ D
  };
  
  export const toBackendFour = {
    inputs: {
      A:  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
      B:  [0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1],
      C:  [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1],
      D:  [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    },
    outputs: {
      B3: [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
      B2: [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
      B1: [0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0],
      B0: [0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
    }
  };
  
  export const threeInputGrayCode = {
    A:  [0,0,0,0,1,1,1,1],
    B:  [0,0,1,1,0,0,1,1],
    C:  [0,1,0,1,0,1,0,1],
    B2: [0,0,0,0,1,1,1,1],       // = A
    B1: [0,0,1,1,1,1,0,0],       // = A ^ B
    B0: [0,1,1,0,0,1,1,0],       // = B ^ C
  };
  
  export const toBackendThree = {
    inputs: {
      A:  [0,0,0,0,1,1,1,1],
      B:  [0,0,1,1,0,0,1,1],
      C:  [0,1,0,1,0,1,0,1],
    },
    outputs: {
      B2: [0,0,0,0,1,1,1,1],
      B1: [0,0,1,1,1,1,0,0],
      B0: [0,1,1,0,0,1,1,0],
    }
  };
  
  export const twoInputGrayCode = {
    A:  [0,0,1,1],
    B:  [0,1,0,1],
    B1: [0,0,1,1],       // = A
    B0: [0,1,1,0],       // = A ^ B
  };
  
  export const toBackendTwo = {
    inputs: {
      A:  [0,0,1,1],
      B:  [0,1,0,1],
    },
    outputs: {
      B1: [0,0,1,1],
      B0: [0,1,1,0],
    }
  };

  export function generateGrayCodeObjects(nBits) {
    const total = 1 << nBits; // 2^nBits
    const binaryInputs = [];
    const grayOutputs = [];
  
    // Initialize bit arrays
    for (let i = 0; i < nBits; i++) {
      binaryInputs.push([]);
      grayOutputs.push([]);
    }
  
    for (let i = 0; i < total; i++) {
      const binary = i.toString(2).padStart(nBits, '0').split('').map(Number);
      const gray = [binary[0]];
  
      // Gray code formula: G[0] = B[0], G[i] = B[i] ^ B[i-1]
      for (let j = 1; j < nBits; j++) {
        gray.push(binary[j] ^ binary[j - 1]);
      }
  
      // Fill arrays
      binary.forEach((bit, idx) => binaryInputs[idx].push(bit));
      gray.forEach((bit, idx) => grayOutputs[idx].push(bit));
    }
  
    // Generate labels
    const inputLabels = [...Array(nBits)].map((_, i) => String.fromCharCode(65 + i)); // A, B, C, D...
    const outputLabels = [...Array(nBits)].map((_, i) => `B${nBits - 1 - i}`); // B3, B2, B1...
  
    // Build final objects
    const grayCodeObject = {};
    const toBackendObject = { inputs: {}, outputs: {} };
  
    inputLabels.forEach((label, i) => {
      grayCodeObject[label] = binaryInputs[i];
      toBackendObject.inputs[label] = binaryInputs[i];
    });
  
    outputLabels.forEach((label, i) => {
      grayCodeObject[label] = grayOutputs[i];
      toBackendObject.outputs[label] = grayOutputs[i];
    });
  
    return { grayCodeObject, toBackendObject };
  }
  
  