import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  title: string;
  quantity: number;
  unit: string;
  category?: string;
  checked?: boolean;
  notes?: string | null;
  onToggle?: () => void;
  onDelete?: () => void;
};

export function ShoppingItemRow({
  title,
  quantity,
  unit,
  category,
  checked = false,
  notes,
  onToggle,
  onDelete,
}: Props) {
  return (
    <View style={[styles.row, checked && styles.rowChecked]}>
      <View style={styles.content}>
        <Text style={[styles.title, checked && styles.checkedText]}>{title}</Text>
        <Text style={styles.meta}>
          {quantity} {unit}
          {category ? ` · ${category}` : ''}
        </Text>
        {notes ? <Text style={styles.notes}>{notes}</Text> : null}
      </View>

      <View style={styles.actions}>
        {onToggle ? (
          <Pressable style={styles.actionButton} onPress={onToggle}>
            <Text style={styles.actionText}>{checked ? 'Annulla' : 'Acquistato'}</Text>
          </Pressable>
        ) : null}

        {onDelete ? (
          <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
            <Text style={styles.actionText}>Elimina</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#edf0ea',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  rowChecked: {
    opacity: 0.72,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2d1f',
  },
  checkedText: {
    textDecorationLine: 'line-through',
  },
  meta: {
    marginTop: 4,
    color: '#5d685d',
    fontSize: 13,
  },
  notes: {
    marginTop: 6,
    color: '#7a847a',
    fontSize: 12,
    fontStyle: 'italic',
  },
  actions: {
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#e8f2e8',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#fdecec',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f2d1f',
  },
});