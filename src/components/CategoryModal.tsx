import {BottomSheet, ListItem} from '@rneui/themed';
import React from 'react';
import {TASK_CATEGORY} from '../features/tasks/TaskSlice';

type CategoryModalProps = {
  isModalVisible: boolean;
  onCategorySelected: (category: TASK_CATEGORY) => void;
  onClose: () => void;
};
const CategoryModal: React.FC<CategoryModalProps> = ({
  isModalVisible,
  onCategorySelected,
  onClose,
}) => {
  return (
    <BottomSheet isVisible={isModalVisible}>
      {Object.values(TASK_CATEGORY).map(category => (
        <ListItem
          key={category}
          onPress={() => {
            onCategorySelected(category);
            onClose();
          }}>
          <ListItem.Content>
            <ListItem.Title>{category}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
};

export default CategoryModal;
