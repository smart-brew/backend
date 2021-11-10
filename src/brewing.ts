/* eslint-disable no-use-before-define */
import { clients } from './modules';
import db from './prismaClient';

import {
  categoryKeys,
  DataCategory,
  ModuleData,
  ReceivedModuleData,
} from './types/ModuleData';

import { SystemData } from './types/SystemData';

let loadedRecipe: any;
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

// check if instructions pushed to modules were finished
const checkInstructionStatus = (state: SystemData) => {
  // update status of instructions
  if (state.brewStatus === 'IN_PROGRESS') {
    console.log('kontrola statu z aktualnej instrukcie z receptu');
    // loadedRecipe state.instruction.currentInstructionId
    //
  }
  return state;
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
  checkInstructionStatus(state);
};

export const setRecipe = (recipe: any) => {
  loadedRecipe = recipe;
  console.log(loadedRecipe);
};

export const getState = () => {
  return state;
};

async function startInstruction() {
  // const result = await db.instruction_logs.create({
  //   data: {
  //     Instructions: { connect: { id: state.instruction.currentInstructionId } },
  //     Brewings: { connect: { id: brewId } },
  //   },
  //   select: { id: true },
  // });
  // instructionLogId = result.id;
  executeInstruction();
}

function executeInstruction(instruction: any) {
  // TODO - send wsclient opcode and params

  clients.forEach((client) =>
    client.send(
      JSON.stringify({
        moduleId: 1,
        DEVICE: 'TEMP_1',
        CATEGORY: 'TEMPERATURE',
        INSTRUCTION: 'SET_TEMPERATURE',
        PARAMS: '27',
      })
    )
  );
}

export const handleInstructionResponse = (res: any) => {
  // TODO - handle response - finish or fail
  finishInstruction();
};

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

function moveToNextInstruction() {
  // TODO - move to next one by ordering number or finishBrewing
  startInstruction();
}

export const startBrewing = (id: number) => {
  brewId = id;
  state.brewStatus = 'IN_PROGRESS';
  state.instruction = {
    currentInstructionId: loadedRecipe.Instructions[0].id,
    status: 'IN_PROGRESS',
  };
  // statusLoggerInterval = setInterval(statusLogger, 1000);
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

export const finishBrewing = () => {
  // TODO
  clearInterval(statusLoggerInterval);
};
