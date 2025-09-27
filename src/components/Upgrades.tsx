import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

export type UpgradeKey = 'peckPower' | 'autoLay' | 'goldenLuck';

export type UpgradeNode = {
  key: UpgradeKey;
  title: string;
  description: string;
  level: number;
  cost: number;         // current price
  canAfford: boolean;   // derived from eggs in parent
};

type Props = {
  eggs: number;
  list: UpgradeNode[];
  onBuy: (key: UpgradeKey) => void;
  onClose?: () => void;
};

export default function Upgrades({ eggs, list, onBuy, onClose }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Upgrades</Text>
          <Text style={styles.eggs}>🥚 {eggs.toLocaleString()}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {list.map(u => (
            <View key={u.key} style={styles.item}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemTitle}>
                  {u.key === 'peckPower' && '💪 '} 
                  {u.key === 'autoLay' && '⏱️ '}
                  {u.key === 'goldenLuck' && '🍀 '}
                  {u.title}
                </Text>
                <Text style={styles.itemDesc}>{u.description}</Text>
                <View style={styles.badges}>
                  <Text style={styles.badge}>Lv {u.level}</Text>
                  <Text style={[styles.badge, styles.badgeCost]}>Cost: {u.cost} 🥚</Text>
                </View>
              </View>

              <Pressable
                onPress={() => u.canAfford && onBuy(u.key)}
                disabled={!u.canAfford}
                style={({ pressed }) => [
                  styles.buyBtn,
                  !u.canAfford && styles.buyBtnDisabled,
                  pressed && u.canAfford && styles.buyBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Buy ${u.title}`}
              >
                <Text style={styles.buyText}>{u.canAfford ? 'Buy' : 'Need more'}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close upgrades">
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 4,
    borderColor: '#8B4513',
    paddingBottom: 10,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  eggs: { fontSize: 18, fontWeight: '800' },

  list: { paddingHorizontal: 12, paddingBottom: 8 },
  item: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  itemLeft: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  itemDesc: { marginTop: 2, color: '#4b5563' },
  badges: { flexDirection: 'row', gap: 8, marginTop: 8 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    fontWeight: '700',
    color: '#111827',
    overflow: 'hidden',
  },
  badgeCost: { backgroundColor: '#fde68a' },

  buyBtn: {
    alignSelf: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#16a34a',
  },
  buyBtnPressed: { transform: [{ translateY: 1 }], borderBottomWidth: 1 },
  buyBtnDisabled: { backgroundColor: '#9ca3af', borderBottomColor: '#6b7280' },
  buyText: { color: '#fff', fontWeight: '900' },

  footer: { paddingHorizontal: 16, paddingTop: 4 },
  closeBtn: {
    alignSelf: 'center',
    backgroundColor: '#8B4513',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#fff',
  },
  closeText: { color: '#fff', fontWeight: '900' },
});
