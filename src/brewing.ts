/* eslint-disable no-use-before-define */
import { sendInstruction } from './index';
import db from './prismaClient';

import {
  categoryKeys,
  DataCategory,
  ModuleData,
  Motor,
  ReceivedModuleData,
  Temperature,
  Unloader,
} from './types/ModuleData';
import { LoadedRecipe } from './types/Recipe';
import { SystemData } from './types/SystemData';

let loadedRecipe: LoadedRecipe | null = null;
let brewId: number;
let currentInstructionLogId: number;

const state: SystemData = {
  data: {
    TEMPERATURE: [],
    MOTOR: [],
    UNLOADER: [],
    PUMP: [],
  },
  instruction: {
    currentInstruction: 0,
    currentValue: 0,
    status: 'WAITING',
  },
  brewStatus: 'IDLE',
};

let statusLoggerInterval: NodeJS.Timeout;

const statusLogger = async () => {
  await db.statusLogs.create({
    data: {
      status: state.brewStatus,
      params: JSON.stringify(state.data),
      Brewings: { connect: { id: brewId } },
    },
  });
};

const updateData = (category: keyof ModuleData, newData: DataCategory) => {
  // update instruction status
  if (
    loadedRecipe?.Instructions[0]?.FunctionTemplates?.category === category &&
    loadedRecipe?.Instructions[0]?.FunctionOptions?.code_name === newData.DEVICE
  ) {
    state.instruction.status = newData.STATE;

    if (category === 'MOTOR')
      state.instruction.currentValue = (newData as Motor).RPM;
    else if (category === 'TEMPERATURE')
      state.instruction.currentValue = (newData as Temperature).TEMP;
    else state.instruction.currentValue = 0;
  }

  // update data status
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

export const setRecipe = (recipe: LoadedRecipe) => {
  loadedRecipe = recipe;
  console.log(loadedRecipe);
};

export const getState = () => {
  return state;
};

async function startInstruction() {
  state.instruction.currentInstruction = loadedRecipe.Instructions[0].id;
  state.instruction.status = 'IN_PROGRESS';
  state.instruction.currentValue = 0;

  const currentInstructionLog = await db.instructionLogs.create({
    data: {
      Instructions: { connect: { id: state.instruction.currentInstruction } },
      Brewings: { connect: { id: brewId } },
    },
    select: { id: true },
  });
  currentInstructionLogId = currentInstructionLog.id;

  executeInstruction();
}
// sends instruction to module via websocket
function executeInstruction() {
  const currInst = loadedRecipe.Instructions[0];
  const moduleID = currInst.FunctionOptions.module;
  const data = JSON.stringify({
    moduleId: currInst.FunctionOptions.module,
    DEVICE: currInst.FunctionOptions.code_name,
    CATEGORY: currInst.FunctionTemplates.category,
    INSTRUCTION: currInst.FunctionTemplates.code_name,
    PARAMS: Object.values(currInst.param)[0], // TODO - Peto - Toto nejako lepsie vymysliet - ziskat z toho template ze presne ako sa to vola ten param
  });
  sendInstruction(moduleID, data);
}

export function updateInstructions() {
  if (state.instruction.status === 'ERROR') {
    state.brewStatus = 'ERROR';
    // TODO Error handle
  } else if (state.instruction.status === 'DONE') {
    moveToNextInstruction();
  }
}

async function updateInstructionLog() {
  await db.instructionLogs.update({
    where: {
      id: currentInstructionLogId,
    },
    data: {
      finished: true,
    },
  });
}

//  move to next one by ordering number or finishBrewing
function moveToNextInstruction() {
  updateInstructionLog();

  loadedRecipe.Instructions.shift();

  if (loadedRecipe.Instructions.length === 0) {
    finishBrewing();
  } else {
    startInstruction();
  }
}

export const startBrewing = (id: number) => {
  brewId = id;
  state.brewStatus = 'IN_PROGRESS';
  statusLoggerInterval = setInterval(statusLogger, 1000);
  startInstruction();
};

export const abortBrewing = () => {
  // TODO
  clearInterval(statusLoggerInterval);
};

export const pauseBrewing = () => {
  // TODO
  clearInterval(statusLoggerInterval);
};

export const resumeBrewing = () => {
  // TODO
  statusLoggerInterval = setInterval(statusLogger, 1000);
};

function finishBrewing() {
  state.brewStatus = 'FINISHED';
  state.instruction = {
    currentInstruction: -1,
    currentValue: 0,
    status: 'WAITING',
  };
  clearInterval(statusLoggerInterval);
}
