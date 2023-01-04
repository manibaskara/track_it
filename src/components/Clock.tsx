import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {convertSecondsToDHMSFormat} from '../utils/util';
import {AppPrimaryColor} from './constants';

interface ClockProps {
  totalSeconds: number;
}

const Clock: React.FC<ClockProps> = ({totalSeconds}) => {
  const dhms = convertSecondsToDHMSFormat(totalSeconds);

  const renderClock = (time: number, title: string, progress: number) => {
    return (
      <View style={styles.clockContainer}>
        <View style={styles.clockTextContainer}>
          <View style={styles.clockText}>
            <Progress.Circle
              formatText={() => `${time}`}
              color={AppPrimaryColor}
              textStyle={{...styles.textStyle, ...styles.progress}}
              progress={progress}
              indeterminate={false}
              showsText
            />
          </View>
          {title !== 'Seconds' ? (
            <Text style={{...styles.textStyle, ...styles.progress}}>:</Text>
          ) : null}
        </View>
        <Text style={{...styles.textStyle, ...styles.progress}}>{title}</Text>
      </View>
    );
  };
  return (
    <View style={styles.clockTextContainer}>
      {dhms.days ? renderClock(dhms.days, 'Days', dhms.days / 100) : null}
      {dhms.days > 0 || dhms.hours
        ? renderClock(dhms.hours, 'Hours', dhms.hours / 24)
        : null}
      {dhms.days > 0 || dhms.hours > 0 || dhms.minutes
        ? renderClock(dhms.minutes, 'Minutes', dhms.minutes / 60)
        : null}
      {renderClock(dhms.seconds, 'Seconds', dhms.seconds / 60)}
    </View>
  );
};

const styles = StyleSheet.create({
  clockContainer: {
    alignItems: 'center',
  },
  clockTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockText: {
    marginHorizontal: 16,
    fontSize: 16,
    width: 40,
    height: 40,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
  },
  progress: {
    color: AppPrimaryColor,
    fontColor: AppPrimaryColor,
  },
});

export default Clock;
