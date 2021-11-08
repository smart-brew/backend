import { DataCategory, ModuleData } from './types/ModuleData';
import { BreweryState } from './types/brewingTypes';

let loadedRecipe;
let brewId: number;
const state: BreweryState = {
  brewStatus: 'IDLE',
  data: {
    TEMPERATURE: [],
    MOTOR: [],
    UNLOADER: [],
    PUMP: [],
  },
};

export const getData = () => {
  return state;
};

export const updateData = (key: keyof ModuleData, newData: DataCategory) => {
  const cachedData: DataCategory[] = state.data[key];

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
  state.brewStatus = 'IN_PROGRESS';
  state.instruction = {
    currentInstructionID: loadedRecipe.Instructions[0],
    status: 'IN_PROGRESS',
  };
};
