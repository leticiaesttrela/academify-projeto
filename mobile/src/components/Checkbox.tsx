import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";
import { Check } from "lucide-react-native";

interface CheckBoxProps {
  isChecked: boolean;
  onToggle: () => void;
}

export const Checkbox = ({ isChecked, onToggle }: CheckBoxProps) => {
  return (
    <TouchableOpacity
      style={[styles.checkboxBase, isChecked && styles.checkboxChecked]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      {isChecked && (
        <View style={{ flex: 1, backgroundColor: Colors.primary }}>
          <Check size={20} color={Colors.background} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkboxTick: {
    width: 12,
    height: 12,
    backgroundColor: Colors.background,
  },
});
