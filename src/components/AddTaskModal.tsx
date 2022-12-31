import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
} from 'react-native';
import {addTask, TASK_STATUS} from '../features/tasks/TaskSlice';
import {useAppDispatch} from '../store/hooks';
import useGeoLocation from '../utils/useGeoLocation';
import uuid from 'react-native-uuid';

type Props = {
  modalVisible: boolean;
  onModalClose: () => void;
};

const AddTaskModal: React.FC<Props> = ({modalVisible, onModalClose}) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [category, setCategory] = React.useState<string>('');

  const [titleError, setTitleError] = React.useState<string>();
  const [descriptionError, setDescriptionError] = React.useState<string>();
  const [categoryError, setCategoryError] = React.useState<string>();
  const {position} = useGeoLocation();
  const id = uuid.v4().toString();

  const onAddTask = () => {
    if (!title || !description || !category) {
      setTitleError(!title ? 'Title is required' : '');
      setDescriptionError(!description ? 'Description is required' : '');
      setCategoryError(!category ? 'Category is required' : '');
      return;
    }

    dispatch(
      addTask({
        title,
        description,
        category,
        id,
        status: TASK_STATUS.START_IMMEDIATELY,
        location: position,
        timeLogs: [],
      }),
    );
    onModalClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onModalClose}>
      <View style={styles.centerView}>
        <View style={styles.modalView}>
          <TextInput
            onChangeText={setTitle}
            value={title}
            placeholder="Title"
          />
          {titleError ? <Text>{titleError}</Text> : null}

          <TextInput
            onChangeText={setDescription}
            value={description}
            placeholder="Description"
          />
          {descriptionError ? <Text>{descriptionError}</Text> : null}

          <TextInput
            onChangeText={setCategory}
            value={category}
            placeholder="Category"
          />
          {categoryError ? <Text>{categoryError}</Text> : null}

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onAddTask}>
            <Text style={styles.textStyle}>Add Task</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={onModalClose}>
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AddTaskModal;
