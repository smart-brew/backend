import { DataCategory, ModuleData } from './types/ModuleData';
import { BreweryState } from './types/brewingTypes';

let loadedRecipe: any;
let brewId: number;
const state: BreweryState = {
  data: {
    TEMPERATURE: [],
    MOTOR: [],
    UNLOADER: [],
    PUMP: [],
  },
  instruction: {
    currentInstructionID: null,
    status: 'IDLE',
  },
  brewStatus: 'IDLE',
};

export const getState = () => {
  return state;
};

export const getLoadedRecipe = () => {
  return loadedRecipe || null;
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

export const setRecipe = (recipe: any) => {
  loadedRecipe = recipe;
  console.log(loadedRecipe);
};

export const startBrewing = (id: any) => {
  brewId = id;
  state.brewStatus = 'IN_PROGRESS';
  state.instruction = {
    currentInstructionID: loadedRecipe.Instructions[0],
    status: 'IN_PROGRESS',
  };
};

export const checkInstructionStatus = (state: BreweryState) => {
  console.log('kontrola statu z aktualnej instrukcie z receptu');
  return state;
};
