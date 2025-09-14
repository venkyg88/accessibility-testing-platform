import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = () => {
  const handleAbout = () => {
    Alert.alert(
      'About A11y Scanner',
      'Version 1.0.0\n\nA comprehensive accessibility testing platform for mobile applications.',
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'For help and support, please visit our documentation or contact our support team.',
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Icon name={icon} size={24} color="#2563eb" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && (
        <Icon name="chevron-right" size={24} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Configure your accessibility scanner
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <SettingItem
            icon="notifications"
            title="Notifications"
            subtitle="Manage scan notifications"
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available in a future update.')}
          />
          <SettingItem
            icon="cloud-sync"
            title="Sync Settings"
            subtitle="Configure data synchronization"
            onPress={() => Alert.alert('Coming Soon', 'Sync settings will be available in a future update.')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scanning</Text>
          <SettingItem
            icon="tune"
            title="Scan Preferences"
            subtitle="Customize scanning behavior"
            onPress={() => Alert.alert('Coming Soon', 'Scan preferences will be available in a future update.')}
          />
          <SettingItem
            icon="storage"
            title="Data Storage"
            subtitle="Manage local scan data"
            onPress={() => Alert.alert('Coming Soon', 'Data storage settings will be available in a future update.')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem
            icon="help"
            title="Help & Support"
            subtitle="Get help using the app"
            onPress={handleHelp}
          />
          <SettingItem
            icon="info"
            title="About"
            subtitle="App version and information"
            onPress={handleAbout}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            A11y Scanner v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Making accessibility testing accessible
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 1,
    borderRadius: 0,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default SettingsScreen;