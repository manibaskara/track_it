import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Task} from '../features/tasks/TaskSlice';

interface TaskCardProps {
  task: Task;
  onTaskClick?: () => void;
  onTaskDelete?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({task}) => {
  return (
    <View style={styles.container}>
      <Text>{task.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    margin: 10,
  },
});

export default TaskCard;
