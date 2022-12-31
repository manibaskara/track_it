import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {RootState} from '../../store/store';

export interface TimeLog {
  timeSpent: number;
  endTime: string;
}

export enum TASK_STATUS {
  START_IMMEDIATELY = 'START_IMMEDIATELY',
  STARTED = 'STARTED',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
}

export interface Task {
  id: string;
  category: string;
  title: string;
  description: string;
  status: TASK_STATUS;
  location?: GeolocationResponse | null;
  timeLogs: TimeLog[];
}

const initialState: Task[] = [];

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      return state.filter(task => task.id !== action.payload);
    },
  },
});

export const {addTask, removeTask} = taskSlice.actions;

export const selectTasks = (state: RootState) => state.tasks;

export default taskSlice.reducer;
