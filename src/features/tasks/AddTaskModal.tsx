import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Chip, Dialog} from '@rneui/themed';
import {addTask, TASK_CATEGORY, TASK_STATUS} from './TaskSlice';
import {useAppDispatch} from '../../store/hooks';
import uuid from 'react-native-uuid';
import CategoryModal from '../../components/CategoryModal';
import {Input} from '@rneui/themed';
import {GeolocationResponse} from '@react-native-community/geolocation';

type Props = {
  modalVisible: boolean;
  position?: GeolocationResponse | null;
  onModalClose: () => void;
  scrollToCategory: (category: TASK_CATEGORY) => void;
};

const AddTaskModal: React.FC<Props> = ({
  modalVisible,
  onModalClose,
  position,
  scrollToCategory,
}) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] =
    React.useState<TASK_CATEGORY>();
  const [isCategoriesBottomsheetVisible, setIsCategoriesBottomsheetVisible] =
    useState(false);

  const [titleError, setTitleError] = React.useState<string>();
  const [descriptionError, setDescriptionError] = React.useState<string>();

  const onAddTask = (): void => {
    if (!title || !description) {
      setTitleError(!title ? 'Title is required' : '');
      setDescriptionError(!description ? 'Description is required' : '');
      return;
    }

    dispatch(
      addTask({
        title,
        description,
        category: selectedCategory || TASK_CATEGORY.OTHER,
        id: uuid.v4().toString(),
        totalDuration: 0,
        status: TASK_STATUS.START_IMMEDIATELY,
        location: position,
        timeLogs: [],
        animate: true,
      }),
    );

    onModalClose();
    scrollToCategory(selectedCategory || TASK_CATEGORY.OTHER);
  };

  return (
    <Dialog isVisible={modalVisible} onBackdropPress={onModalClose}>
      <Input
        label="Title"
        errorMessage={titleError}
        onChangeText={val => {
          setTitle(val);
          setTitleError('');
        }}
        value={title}
      />
      <Input
        label="Description"
        errorMessage={descriptionError}
        onChangeText={val => {
          setDescription(val);
          setDescriptionError('');
        }}
        value={description}
      />
      <Pressable
        onPress={() => {
          setIsCategoriesBottomsheetVisible(true);
        }}>
        <Input
          label={'Select Category'}
          onPressOut={() => {
            setIsCategoriesBottomsheetVisible(true);
          }}
          editable={false}
          value={selectedCategory}
        />
      </Pressable>
      <View style={styles.row}>
        <Chip
          containerStyle={styles.chipStyle}
          title="Cancel"
          type="outline"
          onPress={onModalClose}
        />
        <Chip
          containerStyle={styles.chipStyle}
          title="Submit"
          onPress={onAddTask}
        />
      </View>
      <CategoryModal
        isModalVisible={isCategoriesBottomsheetVisible}
        onCategorySelected={setSelectedCategory}
        onClose={() => {
          setIsCategoriesBottomsheetVisible(false);
        }}
      />
    </Dialog>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  row: {
    marginTop: 12,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chipStyle: {
    marginHorizontal: 12,
  },
  textStyle: {
    textAlign: 'center',
  },
});

export default AddTaskModal;
