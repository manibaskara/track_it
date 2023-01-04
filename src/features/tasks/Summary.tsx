import {Chip} from '@rneui/themed';
import React, {ReactElement, useState} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import Clock from '../../components/Clock';
import {useAppSelector} from '../../store/hooks';
import {selectLastWeekTasks, selectLastMonthTasks, Task} from './TaskSlice';
const Summary: React.FC = () => {
  const lastWeekTasks = useAppSelector(selectLastWeekTasks);
  const lastMonthTasks = useAppSelector(selectLastMonthTasks);

  const [isLastWeek, setIsLastWeek] = useState(true);

  const _renderItem = ({
    item,
  }: {
    item: Task;
    index: number;
  }): ReactElement<any, string> | null => {
    return (
      <View style={styles.card}>
        <Text>{item.title}</Text>
        <Text>Total Time Spent:</Text>
        <Clock totalSeconds={item.totalDuration} />

        {item.timeLogs.map(timeLog => {
          return (
            <View>
              <Text>{new Date(timeLog.endTime).toDateString()}</Text>
              <Clock totalSeconds={timeLog.timeSpent} />
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
    <View>
      <View>
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
        <FlatList
          data={isLastWeek ? lastWeekTasks : lastMonthTasks}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => _renderItem({item, index})}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {alignSelf: 'center', margin: 8, borderRadius: 16},
  chart: {
    marginBottom: 30,
    padding: 10,
    paddingTop: 20,
    borderRadius: 20,
    width: 375,
  },
  horizontalMargin: {
    marginHorizontal: 12,
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
  row: {
    flexDirection: 'row',
    marginTop: 12,
    marginStart: 12,
  },
});

export default Summary;
