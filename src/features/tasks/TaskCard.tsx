import React, {useEffect, useRef, useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  UIManager,
  AppState,
  Animated,
  Linking,
} from 'react-native';
import {
  Task,
  TASK_STATUS,
  startTask,
  logTime,
  deleteTask,
  pauseTask,
  logTimeManually,
  changeTaskStatus,
  setAnimate,
} from './TaskSlice';
import {useAppDispatch} from '../../store/hooks';
import LogTimeModal from './LogTimeModal';
import {
  AppDangerColor,
  AppPositiveColor,
  AppPrimaryColor,
  AppWarningColor,
} from '../../components/constants';
import {Text, Chip, Divider} from '@rneui/themed';
import {StackNavigationProp} from '@react-navigation/stack';
import Clock from '../../components/Clock';

import {useNavigation} from '@react-navigation/native';
import {HomeStackParamsList} from '../../navigation/types';

interface TaskCardProps {
  task: Task;
  onTaskClick?: () => void;
  onTaskDelete?: () => void;
}

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TaskCard: React.FC<TaskCardProps> = ({task}) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dispatch = useAppDispatch();
  const [logTimeModalVisible, setLogTimeModalVisible] = useState(false);
  const appState = useRef(AppState.currentState);
  const backgroundTime = useRef<number>();

  const navigation = useNavigation<StackNavigationProp<HomeStackParamsList>>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  var color = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', AppPositiveColor],
  });

  useEffect(() => {
    if (task.animate) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
      dispatch(setAnimate({id: task.id, animate: false}));
    }
  }, [dispatch, fadeAnim, task.animate, task.id]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState.match(/active/)
      ) {
        if (
          task.status === TASK_STATUS.RUNNING_IN_BACKGROUND &&
          backgroundTime.current
        ) {
          const seconds = Math.floor(
            (Date.now() - backgroundTime.current) / 1000,
          );
          dispatch(logTimeManually({id: task.id, seconds}));
          dispatch(
            changeTaskStatus({
              id: task.id,
              status: TASK_STATUS.STARTED,
            }),
          );
        }
      }
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        //background
        backgroundTime.current = Date.now();
        dispatch(
          changeTaskStatus({
            id: task.id,
            status: TASK_STATUS.RUNNING_IN_BACKGROUND,
          }),
        );
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch, task.id, task.status]);

  const onLogTimeModalClose = () => {
    setLogTimeModalVisible(false);
  };

  const onClickStart = useCallback((): void => {
    timerRef.current = setInterval(() => {
      dispatch(logTime(task.id));
    }, 1000);

    dispatch(startTask(task.id));
  }, [dispatch, task.id]);

  const onClickPause = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    dispatch(pauseTask(task.id));
  }, [dispatch, task.id]);

  const onClickShowLocation = (): void => {
    if (task.location) {
      if (Platform.OS === 'ios') {
        navigation.navigate('Map', {
          location: task.location,
        });
      } else {
        const label = task.title;
        const url = `geo:0,0?q=${task?.location?.coords?.latitude},${task?.location?.coords?.longitude}(${label})`;
        Linking.openURL(url);
      }
    }
  };

  const onClickDelete = (): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    dispatch(deleteTask(task.id));
  };

  useEffect(() => {
    if (
      timerRef.current === null &&
      [TASK_STATUS.START_IMMEDIATELY, TASK_STATUS.STARTED].includes(task.status)
    ) {
      onClickStart();
    }
  }, [onClickStart, task.status]);

  return (
    <Animated.View
      style={{
        ...styles.card,
        backgroundColor: color,
      }}>
      <Text style={styles.textStyle} h4>
        {task.title}
      </Text>
      <Divider style={styles.divider} />

      <Text style={styles.textStyle}>{task.description}</Text>
      <Divider style={styles.divider} />

      {logTimeModalVisible ? (
        <LogTimeModal
          taskId={task.id}
          modalVisible={logTimeModalVisible}
          onModalClose={onLogTimeModalClose}
        />
      ) : null}

      <Clock totalSeconds={task.totalDuration} />
      <Divider style={styles.divider} />

      <View style={styles.rowSpread}>
        <Chip
          title="Log Time"
          icon={{
            name: 'timer',
            size: 20,
            color: 'white',
          }}
          color={AppWarningColor}
          onPress={() => setLogTimeModalVisible(true)}
        />
        <Chip
          title="Delete"
          icon={{
            name: 'delete',
            size: 20,
            color: 'white',
          }}
          color={AppDangerColor}
          onPress={onClickDelete}
        />
        <Chip
          icon={{
            name: [
              TASK_STATUS.RUNNING_IN_BACKGROUND,
              TASK_STATUS.STARTED,
            ].includes(task.status)
              ? 'pause-circle-outline'
              : 'play-circle-outline',
            size: 20,
            color: 'white',
          }}
          color={
            [TASK_STATUS.RUNNING_IN_BACKGROUND, TASK_STATUS.STARTED].includes(
              task.status,
            )
              ? AppDangerColor
              : AppPositiveColor
          }
          onPress={
            [TASK_STATUS.RUNNING_IN_BACKGROUND, TASK_STATUS.STARTED].includes(
              task.status,
            )
              ? onClickPause
              : onClickStart
          }
          title={
            [TASK_STATUS.RUNNING_IN_BACKGROUND, TASK_STATUS.STARTED].includes(
              task.status,
            )
              ? 'Stop'
              : 'Start'
          }
        />
      </View>
      <Divider style={styles.divider} />

      {task.location ? (
        <Chip
          title="Show Location"
          icon={{
            name: 'map',
            size: 20,
            color: 'white',
          }}
          onPress={onClickShowLocation}
        />
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  title: {fontSize: 20, fontWeight: 'bold'},
  row: {flexDirection: 'row', justifyContent: 'flex-end'},
  rowSpread: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    shadowOpacity: 0.25,
    elevation: 8,
    padding: 16,
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  leftAlign: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
  },
  progress: {
    color: AppPrimaryColor,
    fontColor: AppPrimaryColor,
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
});

export default TaskCard;
