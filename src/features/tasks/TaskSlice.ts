import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {RootState} from '../../store/store';
import {fetchTasksForDuration} from '../../utils/util';
export interface TimeLog {
  timeSpent: number;
  endTime: string;
}
export enum TASK_STATUS {
  START_IMMEDIATELY = 'START_IMMEDIATELY',
  STARTED = 'STARTED',
  RUNNING_IN_BACKGROUND = 'RUNNING_IN_BACKGROUND',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
}

export interface TaskLogType {
  days: string;
  hours: string;
  minutes: string;
}

export interface Task {
  id: string;
  category?: TASK_CATEGORY;
  title: string;
  description: string;
  status: TASK_STATUS;
  totalDuration: number;
  location?: GeolocationResponse | null;
  timeLogs: TimeLog[];
  animate?: boolean;
  isRunning?: boolean;
}

export interface TaskWithCategory {
  data: Task[];
  category: TASK_CATEGORY;
}

export enum TASK_CATEGORY {
  STUDY = 'Study',
  WORK = 'Work',
  PERSONAL = 'Personal',
  HOME = 'Home',
  OTHER = 'Other',
}

const initialState: Task[] = [];

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.push(action.payload);
    },
    startTask: (state, action: PayloadAction<string>) => {
      const taskIndex = state.findIndex(task => task.id === action.payload);
      state[taskIndex].status = TASK_STATUS.STARTED;
      state[taskIndex].timeLogs.push({
        timeSpent: 0,
        endTime: new Date().toISOString(),
      });
      state[taskIndex].animate = false;
    },
    pauseTask: (state, action: PayloadAction<string>) => {
      const taskIndex = state.findIndex(task => task.id === action.payload);
      state[taskIndex].status = TASK_STATUS.PAUSED;
    },
    logTime: (state, action: PayloadAction<string>) => {
      const taskIndex = state.findIndex(task => task.id === action.payload);
      if (state[taskIndex].timeLogs?.length === 0) {
        state[taskIndex].timeLogs.push({
          timeSpent: 0,
          endTime: new Date().toISOString(),
        });
      } else {
        state[taskIndex].timeLogs[
          state[taskIndex].timeLogs.length - 1
        ].timeSpent =
          state[taskIndex].timeLogs[state[taskIndex].timeLogs.length - 1]
            .timeSpent + 1;
        state[taskIndex].timeLogs[
          state[taskIndex].timeLogs.length - 1
        ].endTime = new Date().toISOString();
      }
      state[taskIndex].totalDuration = state[taskIndex].totalDuration + 1;
    },
    logTimeManually: (
      state,
      action: PayloadAction<{id: string; seconds: number}>,
    ) => {
      const taskIndex = state.findIndex(task => task.id === action.payload.id);
      state[taskIndex].timeLogs.push({
        timeSpent: action.payload.seconds,
        endTime: new Date().toISOString(),
      });
      state[taskIndex].totalDuration =
        state[taskIndex].totalDuration + action.payload.seconds;
    },
    changeTaskStatus: (
      state,
      action: PayloadAction<{id: string; status: TASK_STATUS}>,
    ) => {
      const taskIndex = state.findIndex(task => task.id === action.payload.id);
      state[taskIndex].status = action.payload.status;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      return state.filter(task => task.id !== action.payload);
    },
    setAnimate: (
      state,
      action: PayloadAction<{id: string; animate: boolean}>,
    ) => {
      const taskIndex = state.findIndex(task => task.id === action.payload.id);
      state[taskIndex].animate = action.payload.animate;
    },
  },
});

export const {
  addTask,
  startTask,
  logTime,
  logTimeManually,
  changeTaskStatus,
  pauseTask,
  deleteTask,
  setAnimate,
} = taskSlice.actions;

export const selectTasks = (state: RootState) => state.tasks;

export const selectCategorizedTasks = (state: RootState) => {
  const tasks = state.tasks;
  const categorizedTasks: TaskWithCategory[] = [];
  Object.values(TASK_CATEGORY).forEach(category => {
    const tasksOfCategory = tasks.filter(task => {
      return task.category === category;
    });
    if (tasksOfCategory.length !== 0) {
      categorizedTasks.push({category, data: tasksOfCategory});
    }
  });
  return categorizedTasks;
};

export const selectLastWeekTasks = (state: RootState) => {
  return fetchTasksForDuration(state, 7);
};

export const selectLastMonthTasks = (state: RootState) => {
  return fetchTasksForDuration(state, 30);
};

export default taskSlice.reducer;
