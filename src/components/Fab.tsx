import {Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';

interface FABProps {
  title: string;
  onPress: () => void;
}

const FAB: React.FC<FABProps> = props => {
  return (
    <Pressable style={styles.container} onPress={props.onPress}>
      <Text style={styles.title}>{props.title}</Text>
    </Pressable>
  );
};

export default FAB;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#26653A',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
