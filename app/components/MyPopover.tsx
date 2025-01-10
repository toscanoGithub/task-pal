import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Popover, Text } from '@ui-kitten/components';

interface MyPopoverProps {
  options: string[];
  buttonText: string;
}

const MyPopover: React.FC<MyPopoverProps> = ({ options, buttonText }) => {
  const [visible, setVisible] = useState<boolean>(false);

  const togglePopover = () => setVisible(!visible);

  return (
    <View style={styles.container}>
      {/* Button that triggers the Popover */}
      <Button onPress={togglePopover}>{buttonText}</Button>

      {/* Popover that contains a list of buttons */}
      <Popover
        visible={visible}
        onBackdropPress={togglePopover} // Close on backdrop press
        anchor={(props) => (
          <View {...props} style={styles.popoverAnchor}>
            {/* Anchor button already defined above */}
          </View>
        )}
      >
        <View style={styles.popoverContent}>
          {options.map((option, index) => (
            <Button key={index} style={styles.optionButton} onPress={() => alert(`You clicked: ${option}`)}>
              {option}
            </Button>
          ))}
        </View>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popoverAnchor: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popoverContent: {
    width: 200,
    paddingVertical: 10,
  },
  optionButton: {
    marginVertical: 5,
  },
});

export default MyPopover;
