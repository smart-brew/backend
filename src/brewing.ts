/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
import { getModuleIds, sendAbort, sendInstruction } from './wsServer';
import logger from './logger';
import db from './prismaClient';
import queryErrorHanlder from './queryErrorHandler';

import {
  categoryKeys,
  DataCategory,
  ModuleData,
  Motor,
  ReceivedModuleData,
  Temperature,
} from './types/ModuleData';
import { LoadedRecipe } from './types/Recipe';
import { SystemData } from './types/SystemData';
import { setBrewingState } from './helpers/brewings';

let loadedRecipe: LoadedRecipe;
let brewId: number;
let currentInstructionLogId: number;

const state: SystemData = {
  data: {
    TEMPERATURE: [],
    MOTOR: [],
    UNLOADER: [],
    PUMP: [],
    SYSTEM: [],
  },
  instruction: {
    currentInstruction: -1,
    currentValue: 0,
    status: 'WAITING',
  },
  brewStatus: 'IDLE',
  errorMessage: '',
};

let statusLoggerInterval: NodeJS.Timeout;
export const timeinterval = 1000;

const statusLogger = async () => {
  // logger.child({ state }).debug('Status logger');
  try {
    await db.statusLogs.create({
      data: {
        status: state.brewStatus,
        params: JSON.stringify(state.data),
        Brewings: { connect: { id: brewId } },
      },
    });
  } catch (e) {
    queryErrorHanlder(e, 'Brewery status logging query');
  }
};

const updateData = (category: keyof ModuleData, newData: DataCategory) => {
  // update instruction status
  skip: if (
    loadedRecipe &&
    loadedRecipe.Instructions[0].FunctionTemplates.category === category
  ) {
    if (
      loadedRecipe.Instructions[0].FunctionOptions &&
      loadedRecipe.Instructions[0].FunctionOptions.codeName !== newData.DEVICE
    )
      break skip;

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
  logger.child({ state }).debug('Brewery status');
};

export const setRecipe = (recipe: LoadedRecipe) => {
  loadedRecipe = recipe;
  logger.child({ loadedRecipe }).debug('Loaded recipe');
};

export const getState = () => {
  return state;
};
export const resetEndState = () => {
  if (state.brewStatus === 'ABORT' || state.brewStatus === 'FINISHED')
    state.brewStatus = 'IDLE';
};

async function startInstruction() {
  if (
    state.brewStatus !== 'IN_PROGRESS' ||
    (state.instruction.status !== 'WAITING' &&
      state.instruction.status !== 'DONE')
  ) {
    logger.info('Cannot start new isntruction');
    return;
  }
  state.instruction.currentInstruction = loadedRecipe.Instructions[0].id;
  state.instruction.status = 'IN_PROGRESS';
  state.instruction.currentValue = 0;

  try {
    const currentInstructionLog = await db.instructionLogs.create({
      data: {
        Instructions: { connect: { id: state.instruction.currentInstruction } },
        Brewings: { connect: { id: brewId } },
      },
      select: { id: true },
    });
    currentInstructionLogId = currentInstructionLog.id;
    logger.info(
      `Starting new instruction with id ${state.instruction.currentInstruction}`
    );
    executeInstruction();
  } catch (e) {
    queryErrorHanlder(e, 'Instruction start logging query');
  }
}
// sends instruction to module via websocket
function executeInstruction() {
  const currInst = loadedRecipe.Instructions[0];

  sendInstruction({
    type: 'instruction',
    moduleId: currInst.FunctionOptions?.module ?? 1, // if no moduleId provided, send it to moduleId=1
    device: currInst.FunctionOptions?.codeName,
    category: currInst.FunctionTemplates.category,
    instruction: currInst.FunctionTemplates.codeName,
    params: currInst.param,
  });
}

export function updateInstructions(moduleId: number) {
  if (state.instruction.status === 'ERROR') {
    state.brewStatus = 'ERROR';
    state.errorMessage = `Error reported by module ${moduleId}. Brewing aborted.`;
    abortBrewing();
  } else if (state.instruction.status === 'DONE') {
    moveToNextInstruction();
  }
}

async function updateInstructionLog() {
  logger.info(
    `Finishing instruction with id ${state.instruction.currentInstruction}`
  );
  try {
    await db.instructionLogs.update({
      where: {
        id: currentInstructionLogId,
      },
      data: {
        finished: true,
      },
    });
  } catch (e) {
    queryErrorHanlder(e, 'Instruction finish logging query');
  }
}

//  move to next one by ordering number or finishBrewing
export function moveToNextInstruction() {
  logger.info('Move to next instruction');

  updateInstructionLog();

  loadedRecipe.Instructions.shift();

  if (loadedRecipe.Instructions.length === 0) {
    finishBrewing();
  } else {
    startInstruction();
  }
}

export const startBrewing = (id: number) => {
  logger.info(`Starting new brewing with id ${id}`);
  brewId = id;

  const { allPresent, missingModuleId } = checkRequiredModules();

  if (allPresent) {
    state.brewStatus = 'IN_PROGRESS';
    statusLoggerInterval = setInterval(statusLogger, timeinterval);
    startInstruction();
  } else {
    state.brewStatus = 'ERROR';
    state.errorMessage = `Error, module ${missingModuleId} is missing. Unable to start brewing.`;
  }
};

export const abortBrewing = () => {
  logger.info(`Aborting brewing with id ${brewId}`);
  setBrewingState(brewId, 'Aborted');
  sendAbort();
  resetBreweryState();
  state.brewStatus = 'ABORT';
  return 'BREWING ABORTED';
};

export const pauseBrewing = (): string => {
  if (state.brewStatus === 'IN_PROGRESS') {
    logger.info('Pausing brewing');
    state.brewStatus = 'PAUSED';
    clearInterval(statusLoggerInterval);
    return 'BREWING PAUSED';
  }
  return 'BREWING CANNOT BE PAUSED';
};

export const resumeBrewing = (): string => {
  if (state.brewStatus === 'PAUSED') {
    logger.info('Resuming brewing');
    state.brewStatus = 'IN_PROGRESS';
    statusLoggerInterval = setInterval(statusLogger, 1000);
    startInstruction();
    return 'BREWING RESUMED';
  }
  return 'BREWING CANNOT BE RESUMED';
};

function finishBrewing() {
  logger.info('Brewing finished');
  setBrewingState(brewId, 'Finished');
  resetBreweryState();
  state.brewStatus = 'FINISHED';
}

function resetBreweryState() {
  clearInterval(statusLoggerInterval);
  statusLogger();
  state.instruction = {
    currentInstruction: -1,
    currentValue: 0,
    status: 'WAITING',
  };
  state.errorMessage = '';
  brewId = undefined;
  loadedRecipe = undefined;
}

export const isRecipeLoaded = () => {
  return loadedRecipe !== undefined;
};

export const isBreweryIdle = () => {
  return state.brewStatus === 'IDLE';
};

export const missingModule = (moduleId: number) => {
  state.brewStatus = 'ERROR';
  state.errorMessage = `Error, module ${moduleId} is missing. Any ongoing brewing has been aborted`;
  if (!isBreweryIdle()) abortBrewing();
};

function checkRequiredModules() {
  const connectedModuleIds = getModuleIds();
  const requiredModuleIds = loadedRecipe.Instructions.filter((instruction) => {
    return instruction.FunctionOptions !== null;
  }).map((instruction) => {
    return instruction.FunctionOptions.module;
  });

  const uniqueRequiredModuleIds = [...new Set(requiredModuleIds)];
  let allPresent = true;
  let missingModuleId;

  uniqueRequiredModuleIds.every((reqId) => {
    if (
      !connectedModuleIds.some((connId) => {
        return connId === reqId;
      })
    ) {
      allPresent = false;
      missingModuleId = reqId;
      return false;
    }
    return true;
  });

  return { allPresent, missingModuleId };
}
