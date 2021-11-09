import {
  categoryKeys,
  DataCategory,
  ModuleData,
  ReceivedModuleData,
} from './types/ModuleData';
import { SystemData } from './types/SystemData';

let loadedRecipe: any;
let brewId: number;
const state: SystemData = {
  data: {
    TEMPERATURE: [],
    MOTOR: [],
    UNLOADER: [],
    PUMP: [],
  },
  instruction: {
    currentInstructionId: 0,
    status: 'WAITING',
  },
  brewStatus: 'IDLE',
};

export const getState = (): SystemData => {
  return state;
};

export const getLoadedRecipe = () => {
  return loadedRecipe || null;
};

const updateData = (category: keyof ModuleData, newData: DataCategory) => {
  const currentCategoryState: DataCategory[] = state.data[category];

  for (let i = 0; i < currentCategoryState.length; i += 1) {
    if (currentCategoryState[i].DEVICE === newData.DEVICE) {
      currentCategoryState[i] = newData;
      return;
    }
  }
  currentCategoryState.push(newData);
};

export const updateStatus = (newData: ReceivedModuleData) => {
  // iterate over all categories
  categoryKeys.forEach((category: keyof ModuleData) => {
    // check, if this module uses that category
    if (!newData[category]) return;

    // update all cached data
    newData[category].forEach((newDataPoint) => {
      updateData(category, newDataPoint);
    });
  });
};

export const setRecipe = (recipe: any) => {
  loadedRecipe = recipe;
  console.log(loadedRecipe);
};

export const startBrewing = (id: any) => {
  brewId = id;
  state.brewStatus = 'IN_PROGRESS';
  state.instruction = {
    currentInstructionId: loadedRecipe.Instructions[0],
    status: 'IN_PROGRESS',
  };
};

export const checkInstructionStatus = (state: SystemData) => {
  console.log('kontrola statu z aktualnej instrukcie z receptu');
  return state;
};
