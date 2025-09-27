// App.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import GameBackground from './src/components/GameBackground';
import Chicken from './src/components/Chicken';
import AnimatedEgg from './src/components/AnimatedEgg';
import AnimatedFloatText from './src/components/AnimatedFloatText';
import Upgrades, { type UpgradeKey, type UpgradeNode } from './src/components/Upgrades';
import Achievements, { type AchievementNode } from './src/components/Achievements';

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
  leftPct: number; // 0..100 (random column in area)
  delayMs: number;
  kind: 'normal' | 'golden';
};

type Floater = {
  id: string;
  leftPct: number; // kept for compatibility; centered in component
  text: string;    // "+1" | "+2" | etc.
  kind: 'normal' | 'golden';
};

const CHICKEN_SIZE = 260;

export default function App() {
  // counters & navigation
  const [eggs, setEggs] = useState(0);
  const [active, setActive] = useState<Tab>('upgrades');

  // measured game-area width (for falling eggs)
  const [areaWidth, setAreaWidth] = useState(0);

  // animations
  const [spawned, setSpawned] = useState<SpawnedEgg[]>([]);
  const [floaters, setFloaters] = useState<Floater[]>([]);

  // upgrades state
  const [upgrades, setUpgrades] = useState({
    peckPower: { level: 0, cost: 10 },
    autoLay:   { level: 0, cost: 25 },
    goldenLuck:{ level: 0, cost: 50 },
  });

  // derived upgrade effects
  const clickBonus = 1 + upgrades.peckPower.level;                              // +1 per level
  const goldenChance = Math.min(0.15 + upgrades.goldenLuck.level * 0.02, 0.6);  // +2%/lvl, cap 60%
  const autoPerSec = upgrades.autoLay.level * 0.5;                              // eggs/sec

  // achievements state
  const [achv, setAchv] = useState<AchievementNode[]>([
    { key: 'first-10', title: 'First Dozen-ish', icon: '🥚', description: 'Lay 10 eggs.', current: 0, target: 10, unlocked: false, reward: 5 },
    { key: 'fifty',    title: 'Egglet Runner',  icon: '🐣', description: 'Lay 50 eggs.', current: 0, target: 50, unlocked: false, reward: 15 },
    { key: 'hundred',  title: 'Centenary Hen',  icon: '🐔', description: 'Lay 100 eggs.', current: 0, target: 100, unlocked: false, reward: 30 },
  ]);

  // keep achievements progress in sync with eggs
  useEffect(() => {
    setAchv(prev =>
      prev.map(a => {
        const current = Math.min(eggs, a.target);
        const unlocked = current >= a.target;
        return { ...a, current, unlocked };
      })
    );
  }, [eggs]);

  const onClaimAchievement = (key: string) => {
    const reward = achv.find(a => a.key === key)?.reward ?? 0;
    setAchv(prev => prev.map(a => (a.key === key ? { ...a, claimed: true } : a)));
    if (reward > 0) setEggs(e => e + reward);
  };

  // passive income (accumulate fractional eggs)
  const autoResidue = useRef(0);
  useEffect(() => {
    const iv = setInterval(() => {
      autoResidue.current += autoPerSec;
      const whole = Math.floor(autoResidue.current);
      if (whole > 0) {
        autoResidue.current -= whole;
        setEggs(e => e + whole);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [autoPerSec]);

  // fall distance similar to ~75vh on web
  const screenH = Dimensions.get('window').height;
  const fallDistance = Math.min(0.75 * screenH, 600);

  // clicking the chicken
  const onChickenPress = useCallback(() => {
    const isGolden = Math.random() < goldenChance;
    const base = isGolden ? 2 : 1;
    const gain = base + upgrades.peckPower.level;

    setEggs(e => e + gain);

    const leftPct = Math.max(5, Math.min(95, Math.random() * 100));
    const delayMs = Math.floor(Math.random() * 220);
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // falling egg anywhere in the area
    setSpawned(list => [...list, { id, leftPct, delayMs, kind: isGolden ? 'golden' : 'normal' }]);

    // floater centered on chicken
    setFloaters(list => [...list, { id: `f-${id}`, leftPct, text: `+${gain}`, kind: isGolden ? 'golden' : 'normal' }]);
  }, [goldenChance, upgrades.peckPower.level]);

  const onEggDone = useCallback((id: string) => {
    setSpawned(list => list.filter(x => x.id !== id));
  }, []);
  const onFloatDone = useCallback((id: string) => {
    setFloaters(list => list.filter(x => x.id !== id));
  }, []);

  // buy logic
  const buyUpgrade = (key: UpgradeKey) => {
    const node = upgrades[key];
    if (!node) return;
    if (eggs < node.cost) return;

    setEggs(e => e - node.cost);
    setUpgrades(prev => {
      const nextLevel = prev[key].level + 1;
      const nextCost = Math.max(1, Math.round(prev[key].cost * 1.6)); // ~+60% price growth
      return { ...prev, [key]: { level: nextLevel, cost: nextCost } };
    });
  };

  const upgradeNodes: UpgradeNode[] = [
    {
      key: 'peckPower',
      title: 'Peck Power',
      description: 'Each tap lays +1 more egg.',
      level: upgrades.peckPower.level,
      cost: upgrades.peckPower.cost,
      canAfford: eggs >= upgrades.peckPower.cost,
    },
    {
      key: 'autoLay',
      title: 'Auto-lay',
      description: 'Passive eggs per second (+0.5 / level).',
      level: upgrades.autoLay.level,
      cost: upgrades.autoLay.cost,
      canAfford: eggs >= upgrades.autoLay.cost,
    },
    {
      key: 'goldenLuck',
      title: 'Golden Luck',
      description: 'Increase chance for +2 golden taps (+2% / level).',
      level: upgrades.goldenLuck.level,
      cost: upgrades.goldenLuck.cost,
      canAfford: eggs >= upgrades.goldenLuck.cost,
    },
  ];

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

      {/* Game area with peach dotted background */}
      <GameBackground onLayout={(e) => setAreaWidth(e.nativeEvent.layout.width)}>
        {/* falling eggs */}
        {spawned.map(e => (
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

        {/* chicken + floating texts in one wrapper (floaters are ON the chicken) */}
        <View style={[styles.chickenWrap, { width: CHICKEN_SIZE, height: CHICKEN_SIZE }]}>
          <Pressable
            onPress={onChickenPress}
            accessibilityRole="button"
            accessibilityLabel="Chicken"
            android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: false, radius: CHICKEN_SIZE / 2 }}
            style={[
              styles.chickenPressable,
              { width: CHICKEN_SIZE, height: CHICKEN_SIZE, borderRadius: CHICKEN_SIZE / 2 },
            ]}
          >
            <Chicken width={CHICKEN_SIZE} height={CHICKEN_SIZE} style={styles.chicken} />
          </Pressable>

          {floaters.map(f => (
            <AnimatedFloatText
              key={f.id}
              id={f.id}
              leftPct={f.leftPct} // ignored to keep centered
              text={f.text}
              kind={f.kind}
              maxRise={Math.round(CHICKEN_SIZE * 0.45)}
              tiltDeg={8}
              shiftRight={12}
              onDone={onFloatDone}
            />
          ))}
        </View>

        <Text style={styles.hint}>Tap the chicken!</Text>
      </GameBackground>

      {/* overlays */}
      {active === 'upgrades' && (
        <Upgrades
          eggs={eggs}
          list={upgradeNodes}
          onBuy={buyUpgrade}
          onClose={() => setActive('coop')}
        />
      )}

      {active === 'achievements' && (
        <Achievements
          eggs={eggs}
          list={achv}
          onClaim={onClaimAchievement}
          onClose={() => setActive('upgrades')}
        />
      )}

      {/* bottom nav */}
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

  hud: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eggs: { fontSize: 28, fontWeight: '800' },

  chickenWrap: {
    alignSelf: 'center',
    position: 'relative',
    marginTop: 8,
    marginBottom: 4,
  },
  chickenPressable: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible', // clip ripple on Android
  },
  chicken: { alignSelf: 'center' },
  hint: { marginTop: 8, color: '#6b7280', textAlign: 'center' },

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
