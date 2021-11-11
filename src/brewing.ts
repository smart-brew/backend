/* eslint-disable no-use-before-define */
import { sendInstruction } from './index';
import db from './prismaClient';

import { Instruction } from './types/Instruction';
import {
  categoryKeys,
  DataCategory,
  ModuleData,
  ReceivedModuleData,
} from './types/ModuleData';
import { Recipe } from './types/Recipe';
import { SystemData } from './types/SystemData';

let loadedRecipe: Recipe;
let brewId: number;
let instructionLogId: number;

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

let statusLoggerInterval: NodeJS.Timeout;

const statusLogger = async () => {
  await db.status_logs.create({
    data: {
      status: state.brewStatus,
      params: JSON.stringify(state.data),
      Brewings: { connect: { id: brewId } },
    },
  });
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
  handleInstructionResponse(newData);
};

export const setRecipe = (recipe: Recipe) => {
  loadedRecipe = recipe;
  console.log(loadedRecipe);
};

export const getState = () => {
  return state;
};

async function startInstruction() {
  const result = await db.instruction_logs.create({
    data: {
      Instructions: { connect: { id: state.instruction.currentInstructionId } },
      Brewings: { connect: { id: brewId } },
    },
    select: { id: true },
  });
  instructionLogId = result.id;

  state.instruction = {
    currentInstructionId: loadedRecipe.Instructions[0].id,
    status: 'IN_PROGRESS',
  };

  executeInstruction();
}
// sends instruction to module via websocket
function executeInstruction() {
  const currInst = loadedRecipe.Instructions[0];
  const moduleID = currInst.Function_options.module;
  const data = JSON.stringify({
    moduleId: currInst.Function_options.module,
    DEVICE: currInst.Function_options.code_name,
    CATEGORY: currInst.Function_templates.category,
    INSTRUCTION: currInst.Function_templates.code_name,
    PARAMS: Object.values(currInst.param)[0], // TODO - Peto - Toto nejako lepsie vymysliet - ziskat z toho template ze presne ako sa to vola ten param
  });
  sendInstruction(moduleID, data);
}

function handleInstructionResponse(response: ReceivedModuleData) {
  state.instruction.status = response.status;
  if (state.instruction.status === 'ERROR') {
    state.brewStatus = 'ERROR';
    // TODO Error handle
  }
  finishInstruction();
}

async function finishInstruction() {
  await db.instruction_logs.update({
    where: {
      id: instructionLogId,
    },
    data: {
      finished: true,
    },
  });
  moveToNextInstruction();
}

//  move to next one by ordering number or finishBrewing
function moveToNextInstruction() {
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
    currentInstructionId: -1,
    status: 'WAITING',
  };
  clearInterval(statusLoggerInterval);
}
