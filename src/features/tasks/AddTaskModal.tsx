import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Chip, Dialog} from '@rneui/themed';
import {addTask, TASK_CATEGORY, TASK_STATUS} from './TaskSlice';
import {useAppDispatch} from '../../store/hooks';
import useGeoLocation from '../../utils/useGeoLocation';
import uuid from 'react-native-uuid';
import {BottomSheet, ListItem} from '@rneui/themed';
import {Input} from '@rneui/themed';

type Props = {
  modalVisible: boolean;
  onModalClose: () => void;
  scrollToCategory: (category: TASK_CATEGORY) => void;
};

const AddTaskModal: React.FC<Props> = ({
  modalVisible,
  onModalClose,
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
  const {position} = useGeoLocation();

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
          style={styles.chipStyle}
          title="Cancel"
          type="outline"
          onPress={onModalClose}
        />
        <Chip style={styles.chipStyle} title="Submit" onPress={onAddTask} />
      </View>
      <BottomSheet modalProps={{}} isVisible={isCategoriesBottomsheetVisible}>
        {Object.values(TASK_CATEGORY).map(category => (
          <ListItem
            key={category}
            onPress={() => {
              setSelectedCategory(category);
              setIsCategoriesBottomsheetVisible(false);
            }}>
            <ListItem.Content>
              <ListItem.Title>{category}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
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
