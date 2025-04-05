import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/navigation';

const Navbar = () => {
  const navigation = useNavigation<NavigationProp>();

  const tabs: { name: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { name: 'Home', icon: 'home' },
    { name: 'Playlists', icon: 'list' },
    { name: 'Favorites', icon: 'heart' },
    { name: 'Profile', icon: 'person' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        {tabs.map((tab, index) => (
          <React.Fragment key={tab.name}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => navigation.navigate(tab.name as any)}
              activeOpacity={0.7}
            >
              <Ionicons name={tab.icon} size={24} color="#fff" />
              <Text style={styles.tabText}>{tab.name}</Text>
            </TouchableOpacity>
            {index < tabs.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
  },
});

export default Navbar;