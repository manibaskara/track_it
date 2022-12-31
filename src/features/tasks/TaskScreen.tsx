import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import FAB from '../../components/Fab';
import AddTaskModal from '../../components/AddTaskModal';
import TaskCard from '../../components/TaskCard';
import {useAppSelector} from '../../store/hooks';
import {selectTasks} from './TaskSlice';

const TaskScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const onModalClose = () => {
    setModalVisible(false);
  };

  const tasks = useAppSelector(selectTasks);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={({item}) => <TaskCard task={item} />}
        keyExtractor={item => item.id}
      />
      {modalVisible ? (
        <AddTaskModal modalVisible={modalVisible} onModalClose={onModalClose} />
      ) : null}
      <FAB
        onPress={() => {
          setModalVisible(true);
        }}
        title="Add Task"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TaskScreen;
