import React, {useCallback, useState} from 'react';
import {View, StyleSheet, SectionList, Text} from 'react-native';
import {FAB} from '@rneui/themed';
import useGeoLocation from '../../utils/useGeoLocation';

import AddTaskModal from './AddTaskModal';
import TaskCard from './TaskCard';
import {useAppSelector} from '../../store/hooks';
import {selectTasks, selectCategorizedTasks, TASK_CATEGORY} from './TaskSlice';
import {AppPrimaryColor, AppSecondaryColor} from '../../components/constants';

const TaskScreen = () => {
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const sectionRef = React.useRef<SectionList>(null);
  const {position} = useGeoLocation();

  const onAddTaskModalClose = () => {
    setAddTaskModalVisible(false);
  };

  const tasks = useAppSelector(selectTasks);
  const categorizedTasks = useAppSelector(selectCategorizedTasks);

  const scrollToPosition = useCallback(
    (category: TASK_CATEGORY) => {
      const categoryIndex = categorizedTasks?.findIndex(
        data => data?.category === category,
      );
      if (
        categoryIndex > 0 &&
        categorizedTasks[categoryIndex]?.data?.length > 0
      ) {
        sectionRef.current?.scrollToLocation({
          animated: true,
          sectionIndex: categoryIndex,
          itemIndex: categorizedTasks[categoryIndex].data.length - 1,
        });
      }
    },
    [categorizedTasks],
  );

  return (
    <View style={styles.container}>
      <SectionList
        ref={sectionRef}
        stickySectionHeadersEnabled
        sections={categorizedTasks}
        ListEmptyComponent={<Text style={styles.textStyle}>No Tasks</Text>}
        renderItem={({item}) => <TaskCard task={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : {}}
        disableVirtualization={false}
        renderSectionFooter={() => <View style={{height: 12}} />}
        renderSectionHeader={({section: {category}}) => (
          <Text style={styles.categorySection}>{category}</Text>
        )}
      />
      {addTaskModalVisible ? (
        <AddTaskModal
          modalVisible={addTaskModalVisible}
          onModalClose={onAddTaskModalClose}
          scrollToCategory={scrollToPosition}
          position={position}
        />
      ) : null}
      <FAB
        title={'Add Task'}
        style={styles.fab}
        visible={true}
        icon={{name: 'add', color: 'white'}}
        color={AppPrimaryColor}
        onPress={() => {
          setAddTaskModalVisible(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  textStyle: {
    color: 'black',
  },
  categorySection: {
    backgroundColor: AppSecondaryColor,
    color: 'white',
    padding: 10,
    fontSize: 16,
  },
});

export default TaskScreen;
