import {Task, TaskLogType, TASK_CATEGORY} from '../features/tasks/TaskSlice';
import {RootState} from '../store/store';
import cloneDeep from 'lodash/cloneDeep';

export const dhmToSeconds = (dhm: TaskLogType) => {
  return (
    parseInt(dhm.days || '0', 10) * 24 * 60 * 60 +
    parseInt(dhm.hours || '0', 10) * 60 * 60 +
    parseInt(dhm.minutes || '0', 10) * 60
  );
};

export const convertSecondsToDHMSFormat = (
  seconds: number,
): {days: number; hours: number; minutes: number; seconds: number} => {
  const days = Math.floor(seconds / (24 * 3600));
  seconds -= days * 24 * 3600;

  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const fetchTasksForDuration = (state: RootState, days: number) => {
  const tasksList: Task[] = [];

  const duration = new Date();
  duration.setDate(duration.getDate() - days);

  state.tasks?.forEach(task => {
    const taskCopy = cloneDeep(task);
    let totalDuration = 0;
    const timeLogs = task?.timeLogs?.filter(timeLog => {
      if (!timeLog?.endTime) {
        return false;
      }
      const timeLogDate = new Date(timeLog.endTime);
      if (timeLogDate > duration) {
        totalDuration = totalDuration + timeLog.timeSpent;
        return true;
      }
    });
    if (timeLogs?.length === 0) {
      return;
    }
    taskCopy.timeLogs = timeLogs;
    taskCopy.totalDuration = totalDuration;
    tasksList.push(taskCopy);
  });

  return tasksList;
};

export const filterTasksByCategory = (
  tasks: Task[],
  category?: TASK_CATEGORY,
) => {
  if (!category) {
    return tasks;
  }
  return tasks.filter(task => task.category === category);
};
