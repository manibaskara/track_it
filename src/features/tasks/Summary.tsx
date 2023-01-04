import {ButtonGroup, Chip, Divider} from '@rneui/themed';
import React, {ReactElement, useState} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import Clock from '../../components/Clock';
import {useAppSelector} from '../../store/hooks';
import {filterTasksByCategory} from '../../utils/util';
import {
  selectLastWeekTasks,
  selectLastMonthTasks,
  Task,
  TASK_CATEGORY,
} from './TaskSlice';
const Summary: React.FC = () => {
  const lastWeekTasks = useAppSelector(selectLastWeekTasks);
  const lastMonthTasks = useAppSelector(selectLastMonthTasks);

  const [isLastWeek, setIsLastWeek] = useState(true);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const tasks = filterTasksByCategory(
    isLastWeek ? lastWeekTasks : lastMonthTasks,
    selectedIndex !== -1
      ? Object.values(TASK_CATEGORY)?.[selectedIndex]
      : undefined,
  );

  const _renderItem = ({
    item,
  }: {
    item: Task;
    index: number;
  }): ReactElement<any, string> | null => {
    return (
      <View style={styles.card}>
        <Text style={styles.titleStyle}>{item.title}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.titleStyle}>Total Time Spent:</Text>
        <Clock totalSeconds={item.totalDuration} />
        <Divider style={styles.divider} />

        <Text style={styles.titleStyle}>Time Logs:</Text>
        {item.timeLogs.map(timeLog => {
          return (
            <View key={timeLog.endTime}>
              <Text style={styles.textStyle}>
                {new Date(timeLog.endTime).toLocaleString()}:
              </Text>
              <Clock totalSeconds={timeLog.timeSpent} />
              <Divider style={styles.divider} />
            </View>
          );
        })}
      </View>
    );
  };

  const onClickLastWeek = () => {
    if (isLastWeek) {
      return;
    }
    setIsLastWeek(true);
  };

  const onClickLastMonth = () => {
    if (!isLastWeek) {
      return;
    }
    setIsLastWeek(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleStyle}>Filter By Time</Text>
      <View style={styles.row}>
        <Chip
          title="Last Week"
          onPress={onClickLastWeek}
          type={isLastWeek ? 'solid' : 'outline'}
        />
        <View style={styles.horizontalMargin}>
          <Chip
            title="Last Month"
            type={!isLastWeek ? 'solid' : 'outline'}
            onPress={onClickLastMonth}
          />
        </View>
      </View>
      <Text style={styles.titleStyle}>Filter By Category</Text>
      <ButtonGroup
        buttons={Object.values(TASK_CATEGORY)}
        selectedIndex={selectedIndex}
        onPress={value => {
          setSelectedIndex(value);
        }}
      />
      <FlatList
        ListHeaderComponent={() => {
          return (
            <>
              {tasks?.length !== 0 ? (
                <Text style={styles.titleStyle}>
                  {isLastWeek ? 'Last Week Summary' : 'Last Month Summary'}
                </Text>
              ) : null}
            </>
          );
        }}
        contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : {}}
        ListEmptyComponent={<Text>No Tasks</Text>}
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => _renderItem({item, index})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalMargin: {
    marginHorizontal: 12,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    backgroundColor: 'white',
    shadowOpacity: 0.25,
    elevation: 8,
    padding: 16,
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  textStyle: {
    marginVertical: 12,
    marginStart: 12,
    color: 'black',
    fontSize: 16,
  },
  titleStyle: {
    marginTop: 12,
    marginStart: 12,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginTop: 12,
    marginStart: 12,
  },
  divider: {
    marginVertical: 8,
  },
});

export default Summary;
