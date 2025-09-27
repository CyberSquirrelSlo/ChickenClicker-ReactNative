// App.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GameBackground from './src/components/GameBackground';

import Chicken from './src/components/Chicken';
import AnimatedEgg from './src/components/AnimatedEgg';
import AnimatedFloatText from './src/components/AnimatedFloatText';
import {
  UpgradesIcon,
  CoopIcon,
  AchievementsIcon,
  HelpIcon,
  SettingsIcon,
} from './src/components/icons/NavIcons';

type Tab = 'upgrades' | 'coop' | 'achievements' | 'help' | 'settings';

type SpawnedEgg = {
  id: string;
  leftPct: number;      // 0..100
  delayMs: number;
  kind: 'normal' | 'golden';
};

type Floater = {
  id: string;
  leftPct: number;      // kept for compatibility, not used for position now
  text: string;         // "+1" | "+2"
  kind: 'normal' | 'golden';
};

const CHICKEN_SIZE = 260;

export default function App() {
  const [eggs, setEggs] = useState(0);
  const [active, setActive] = useState<Tab>('upgrades');
  const [spawned, setSpawned] = useState<SpawnedEgg[]>([]);
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [areaWidth, setAreaWidth] = useState(0); // measured from background

  const screenH = Dimensions.get('window').height;
  const fallDistance = Math.min(0.75 * screenH, 600); // ~75vh like web

  const onChickenPress = useCallback(() => {
    const isGolden = Math.random() < 0.15; // 15% chance
    const gain = isGolden ? 2 : 1;
    setEggs((e) => e + gain);

    const leftPct = Math.max(5, Math.min(95, Math.random() * 100));
    const delayMs = Math.floor(Math.random() * 220);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // spawn falling egg (free in the whole game area)
    setSpawned((list) => [...list, { id, leftPct, delayMs, kind: isGolden ? 'golden' : 'normal' }]);

    // floating text (+1 / +2) — rendered ON the chicken (centered), leftPct kept but unused
    const fid = `f-${id}`;
    setFloaters((list) => [
      ...list,
      { id: fid, leftPct, text: `+${gain}`, kind: isGolden ? 'golden' : 'normal' },
    ]);
  }, []);

  const onEggDone = useCallback((id: string) => {
    setSpawned((list) => list.filter((x) => x.id !== id));
  }, []);

  const onFloatDone = useCallback((id: string) => {
    setFloaters((list) => list.filter((x) => x.id !== id));
  }, []);

  const tabs = useMemo(
    () => [
      { key: 'upgrades' as const, label: 'Upgrades', Icon: UpgradesIcon },
      { key: 'coop' as const, label: 'Coop', Icon: CoopIcon },
      { key: 'achievements' as const, label: 'Achievements', Icon: AchievementsIcon },
      { key: 'help' as const, label: 'Help', Icon: HelpIcon },
      { key: 'settings' as const, label: 'Settings', Icon: SettingsIcon },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* HUD */}
      <View style={styles.hud}>
        <Text style={styles.eggs}>🥚 {eggs.toLocaleString()}</Text>
      </View>

      {/* Game area with your background */}
      <GameBackground onLayout={(e) => setAreaWidth(e.nativeEvent.layout.width)}>
        {/* Falling eggs across the area */}
        {spawned.map((e) => (
          <AnimatedEgg
            key={e.id}
            id={e.id}
            leftPct={e.leftPct}
            delayMs={e.delayMs}
            distance={fallDistance}
            kind={e.kind}
            containerWidth={areaWidth}
            onDone={onEggDone}
          />
        ))}

        {/* Chicken + floaters share one wrapper so text is ON the chicken */}
        <View style={[styles.chickenWrap, { width: CHICKEN_SIZE, height: CHICKEN_SIZE }]}>
          {/* Pressable fills the wrapper; ripple clipped to circle */}
          <Pressable
            onPress={onChickenPress}
            accessibilityRole="button"
            accessibilityLabel="Chicken"
            android_ripple={{
              color: 'rgba(0,0,0,0.08)',
              borderless: false,
              radius: CHICKEN_SIZE / 2,
            }}
            style={[
              styles.chickenPressable,
              {
                width: CHICKEN_SIZE,
                height: CHICKEN_SIZE,
                borderRadius: CHICKEN_SIZE / 2,
              },
            ]}
          >
            <Chicken width={CHICKEN_SIZE} height={CHICKEN_SIZE} style={styles.chicken} />
          </Pressable>

          {/* Floating +1 / +2 — centered ON the chicken and floating up */}
          {floaters.map((f) => (
            <AnimatedFloatText
              key={f.id}
              id={f.id}
              leftPct={f.leftPct}
              text={f.text}
              kind={f.kind}
              maxRise={Math.round(CHICKEN_SIZE * 0.45)}
              tiltDeg={10}        // a bit more rotated
              shiftRight={16}     // a bit more to the right
              onDone={onFloatDone}
            />
          ))}
        </View>

        <Text style={styles.hint}>Tap the chicken!</Text>
      </GameBackground>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        {tabs.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <Pressable
              key={key}
              onPress={() => setActive(key)}
              accessibilityRole="button"
              accessibilityLabel={label}
              style={({ pressed }) => [
                styles.navItem,
                isActive && styles.navItemActive,
                pressed && styles.navItemPressed,
              ]}
            >
              <Icon width={24} height={24} color={isActive ? '#111827' : '#6b7280'} />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },

  hud: { paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  eggs: { fontSize: 28, fontWeight: '800' },

  // wrapper that positions chicken and floaters together
  chickenWrap: {
    alignSelf: 'center',
    position: 'relative',
    marginTop: 8,
    marginBottom: 4,
  },

  // pressable that fills wrapper and clips ripple to a circle
  chickenPressable: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible', // clip ripple on Android
  },

  chicken: { alignSelf: 'center' },
  hint: { marginTop: 8, color: '#6b7280' },

  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  navItem: { alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10 },
  navItemActive: { backgroundColor: '#f3f4f6' },
  navItemPressed: { opacity: 0.85 },
  navLabel: { fontSize: 12, color: '#6b7280' },
  navLabelActive: { color: '#111827', fontWeight: '600' },
});
