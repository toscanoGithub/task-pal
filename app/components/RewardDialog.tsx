import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Button, Card, Text } from '@ui-kitten/components';
import Modal from 'react-native-modal';
import theme from "../theme.json"


interface RewardDialogProps {
  isVisible: boolean; // Controls the visibility of the dialog
  onClose: () => void; // Callback for closing the dialog
  onAddReward: (reward: string) => void; // Callback for adding the reward
}

const RewardDialog: React.FC<RewardDialogProps> = ({ isVisible, onClose, onAddReward }) => {
  const [rewardText, setRewardText] = useState<string>(''); // State for reward input text

  const handleAddReward = () => {
    if (rewardText.trim()) {
      onAddReward(rewardText);
      setRewardText('');
      onClose();
    }
  };

  return (
    <Modal  isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <Card disabled={true} style={styles.dialogCard}>
        <Text style={styles.title}>Add Your Reward</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your reward here"
          value={rewardText}
          onChangeText={setRewardText}
        />
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={handleAddReward}>
            {(evaProps) => (
                      <Text style={styles.textBtn}>Add</Text>
                    )}
          </Button>
          <Button style={styles.button} appearance="ghost" onPress={onClose}>
          {(evaProps) => (
                      <Text style={styles.textBtn}>Cancel</Text>
                    )}
          </Button>
        </View>
      </Card>
    </Modal>
  );
};

export default RewardDialog;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogCard: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 0.3,
    borderColor: theme.secondary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    
  },
  input: {
    borderWidth: 0.3,
    borderColor: theme.secondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: theme['gradient-from'],
    borderWidth: 0,
    borderRadius: 30,
    borderColor: "transparent",
  },

  textBtn: {
    color: theme.secondary
  }
});
