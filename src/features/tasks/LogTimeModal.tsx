import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {Button, Dialog} from '@rneui/themed';
import {logTimeManually, TaskLogType} from './TaskSlice';
import {useAppDispatch} from '../../store/hooks';
import {dhmToSeconds} from '../../utils/util';

type Props = {
  taskId: string;
  modalVisible: boolean;
  onModalClose: () => void;
};

const LogTimeModal: React.FC<Props> = ({
  taskId,
  modalVisible,
  onModalClose,
}) => {
  const dispatch = useAppDispatch();
  const [timeSpent, setTimeSpent] = React.useState<TaskLogType>({
    days: '',
    hours: '',
    minutes: '',
  });

  const onSubmitClick = () => {
    dispatch(logTimeManually({id: taskId, seconds: dhmToSeconds(timeSpent)}));
    onModalClose();
  };

  const setDays = (value: string) => {
    setTimeSpent(prev => ({...prev, days: value}));
  };
  const setHours = (value: string) => {
    setTimeSpent(prev => ({
      ...prev,
      hours: parseInt(value, 10) > 23 ? '23' : value,
    }));
  };

  const setMinutes = (value: string) => {
    setTimeSpent(prev => ({
      ...prev,
      minutes: parseInt(value, 10) > 59 ? '59' : value,
    }));
  };

  return (
    <Dialog
      overlayStyle={styles.containerStyle}
      isVisible={modalVisible}
      onBackdropPress={onModalClose}>
      <View style={styles.containerStyle}>
        <Text style={styles.titleStyle}>{'Log Task Time'}</Text>

        <View style={styles.row}>
          <View>
            <View style={styles.rowContainer}>
              <TextInput
                textAlign={'center'}
                style={styles.inputContainer}
                keyboardType="numeric"
                onChangeText={setDays}
                value={timeSpent.days}
                placeholder="00"
                maxLength={2}
              />
              <Text style={styles.textStyle}>:</Text>
            </View>
            <Text style={styles.textStyle}>{'Days'}</Text>
          </View>
          <View>
            <View style={styles.rowContainer}>
              <TextInput
                textAlign={'center'}
                style={styles.inputContainer}
                keyboardType="numeric"
                onChangeText={setHours}
                value={timeSpent.hours}
                placeholder="00"
                maxLength={2}
              />
              <Text style={styles.textStyle}>:</Text>
            </View>
            <Text style={styles.textStyle}>{'Hours'}</Text>
          </View>
          <View>
            <TextInput
              textAlign={'center'}
              style={styles.inputContainer}
              keyboardType="numeric"
              onChangeText={setMinutes}
              value={timeSpent.minutes}
              placeholder="00"
              maxLength={2}
            />
            <Text style={styles.textStyle}>{'Minutes'}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Button style={styles.buttonStyle} onPress={onModalClose}>
            Cancel
          </Button>
          <Button style={styles.buttonStyle} onPress={onSubmitClick}>
            Submit
          </Button>
        </View>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 12,
  },
  row: {
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonStyle: {
    marginHorizontal: 12,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  inputContainer: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 4,
    fontSize: 16,
    borderWidth: 1,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LogTimeModal;
