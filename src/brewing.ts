/* eslint-disable no-use-before-define */
import { sendInstruction } from './wsServer';
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
    currentInstruction: -1,
    currentValue: 0,
    status: 'DONE',
  },
  brewStatus: 'IDLE',
};

let statusLoggerInterval: NodeJS.Timeout;

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
  if (
    loadedRecipe?.Instructions[0]?.FunctionTemplates?.category === category &&
    loadedRecipe?.Instructions[0]?.FunctionOptions?.codeName === newData.DEVICE
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
  logger.child({ state }).debug('Brewery status');
};

export const setRecipe = (recipe: LoadedRecipe) => {
  loadedRecipe = recipe;
  logger.child({ loadedRecipe }).debug('Loaded recipe');
};

export const getState = () => {
  return state;
};

async function startInstruction() {
  if (state.brewStatus !== 'IN_PROGRESS' || state.instruction.status !== 'DONE')
    return;
  logger.debug('Starting next instruction');
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
  const moduleID = currInst.FunctionOptions.module;
  const data = JSON.stringify({
    moduleId: currInst.FunctionOptions.module,
    DEVICE: currInst.FunctionOptions.codeName,
    CATEGORY: currInst.FunctionTemplates.category,
    INSTRUCTION: currInst.FunctionTemplates.codeName,
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
  logger.info(`Starting new brewing with id ${id}`);
  brewId = id;
  state.brewStatus = 'IN_PROGRESS';
  statusLoggerInterval = setInterval(statusLogger, 1000);
  startInstruction();
};

export const abortBrewing = () => {
  // TODO
  clearInterval(statusLoggerInterval);
};

export const pauseOrResumeBrewing = (): string => {
  if (state.brewStatus === 'IN_PROGRESS') {
    state.brewStatus = 'PAUSED';
    clearInterval(statusLoggerInterval);
    return 'BREWING PAUSED';
  }
  if (state.brewStatus === 'PAUSED') {
    state.brewStatus = 'IN_PROGRESS';
    statusLoggerInterval = setInterval(statusLogger, 1000);
    startInstruction();
    return 'BREWING RESUMED';
  }
  return 'BREWING CANNOT BE PAUSED OR RESUMED';
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
