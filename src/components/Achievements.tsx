import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

export type AchievementNode = {
  key: string;
  title: string;
  description?: string;
  /** Emoji or small text badge, e.g. "🏅" */
  icon?: string;
  /** Current progress (e.g. eggs laid so far) */
  current: number;
  /** Target to unlock */
  target: number;
  /** Unlocked = current >= target */
  unlocked: boolean;
  /** Optional: already claimed reward */
  claimed?: boolean;
  /** Optional: reward (eggs) you grant on claim */
  reward?: number;
};

type Props = {
  eggs: number;
  list: AchievementNode[];
  onClaim?: (key: string) => void;
  onClose?: () => void;
};

export default function Achievements({ eggs, list, onClaim, onClose }: Props) {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.eggs}>🥚 {eggs.toLocaleString()}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {list.map((a) => {
            const pct = Math.min(100, Math.round((a.current / Math.max(1, a.target)) * 100));
            const canClaim = a.unlocked && !a.claimed;
            return (
              <View key={a.key} style={styles.item} accessibilityRole="summary">
                <View style={styles.iconWrap}>
                  <Text style={styles.iconText}>{a.icon ?? '🏅'}</Text>
                </View>

                <View style={styles.itemBody}>
                  <Text style={styles.itemTitle}>{a.title}</Text>
                  {!!a.description && <Text style={styles.itemDesc}>{a.description}</Text>}

                  {/* Progress bar */}
                  <View style={styles.progressBar} accessibilityRole="progressbar" accessibilityValue={{ now: pct, min: 0, max: 100 }}>
                    <View style={[styles.progressFill, { width: `${pct}%` }]} />
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                      {a.unlocked ? 'Unlocked' : `${a.current}/${a.target} • ${pct}%`}
                    </Text>
                    {typeof a.reward === 'number' && (
                      <Text style={styles.reward}>Reward: {a.reward} 🥚</Text>
                    )}
                  </View>
                </View>

                <Pressable
                  onPress={() => canClaim && onClaim?.(a.key)}
                  disabled={!canClaim}
                  style={({ pressed }) => [
                    styles.claimBtn,
                    !canClaim && styles.claimBtnDisabled,
                    pressed && canClaim && styles.claimBtnPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={canClaim ? `Claim ${a.title}` : `${a.title} ${a.claimed ? 'claimed' : 'locked'}`}
                >
                  <Text style={styles.claimText}>
                    {a.claimed ? 'Claimed' : (canClaim ? 'Claim' : 'Locked')}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close achievements">
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const SADDLE = '#8B4513';
const PEACH = '#FFDDC1';

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
    borderColor: SADDLE,
    paddingBottom: 10,
    maxHeight: '72%',
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
    backgroundColor: PEACH,
    borderWidth: 3,
    borderColor: SADDLE,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: SADDLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 22 },

  itemBody: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  itemDesc: { marginTop: 2, color: '#4b5563' },

  progressBar: {
    marginTop: 8,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },

  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  metaText: { fontWeight: '700', color: '#111827' },
  reward: {
    backgroundColor: '#fde68a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f59e0b',
    overflow: 'hidden',
    fontWeight: '800',
    color: '#78350f',
  },

  claimBtn: {
    alignSelf: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#16a34a',
  },
  claimBtnPressed: { transform: [{ translateY: 1 }], borderBottomWidth: 1 },
  claimBtnDisabled: { backgroundColor: '#9ca3af', borderBottomColor: '#6b7280' },
  claimText: { color: '#fff', fontWeight: '900' },

  footer: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10 },
  closeBtn: {
    alignSelf: 'center',
    backgroundColor: SADDLE,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#fff',
  },
  closeText: { color: '#fff', fontWeight: '900' },
});
