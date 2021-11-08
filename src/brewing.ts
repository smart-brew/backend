import { DataCategory, ModuleData } from './types/ModuleData';

const currentModuleData: ModuleData = {
  TEMPERATURE: [],
  MOTOR: [],
  UNLOADER: [],
  PUMP: [],
};

let loadedRecipe;
let brewId;
let brewStatus;
let currentInstruction;

export const getData = () => {
  return {
    data: currentModuleData,
    instruction: currentInstruction,
    brewStatus,
  };
};

export const updateData = (key: keyof ModuleData, newData: DataCategory) => {
  const cachedData: DataCategory[] = currentModuleData[key];

  for (let i = 0; i < cachedData.length; i += 1) {
    if (cachedData[i].DEVICE === newData.DEVICE) {
      cachedData[i] = newData;
      return;
    }
  }
  cachedData.push(newData);
};

export const setRecipe = (recipe) => {
  loadedRecipe = recipe;
  console.log(loadedRecipe);
};

export const startBrewing = (id) => {
  brewId = id;
  brewStatus = 'IN_PROGRESS';
  currentInstruction = {
    currentInstructionId: loadedRecipe.Instructions[0],
    status: 'IN_PROGRESS',
  };
};
