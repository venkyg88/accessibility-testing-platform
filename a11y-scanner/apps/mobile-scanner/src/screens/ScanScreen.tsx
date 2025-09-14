import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {accessibilityService} from '../services/accessibilityService';
import {apiService} from '../services/apiService';
import {Platform as SharedPlatform} from '@a11y-scanner/shared';

const ScanScreen = ({navigation}: any) => {
  const [appName, setAppName] = useState('');
  const [screenName, setScreenName] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    if (!appName.trim() || !screenName.trim()) {
      Alert.alert('Error', 'Please enter both app name and screen name');
      return;
    }

    try {
      setScanning(true);

      // Take screenshot
      const screenshot = await takeScreenshot();
      if (!screenshot) {
        throw new Error('Failed to capture screenshot');
      }

      // Get accessibility tree
      const accessibilityTree = await accessibilityService.getAccessibilityTree();

      // Analyze accessibility issues
      const issues = await accessibilityService.analyzeAccessibility(
        accessibilityTree,
      );

      // Get device info
      const deviceInfo = await accessibilityService.getDeviceInfo();

      // Create scan result
      const scanResult = await apiService.createScanResult({
        appName: appName.trim(),
        screenName: screenName.trim(),
        platform: Platform.OS === 'ios' ? SharedPlatform.IOS : SharedPlatform.ANDROID,
        scanType: 'manual' as const,
        screenshot,
        accessibilityTree,
        issues,
        metadata: {
          deviceInfo,
          scanDuration: 0, // Will be calculated on backend
          scannerVersion: '1.0.0',
        },
      });

      Alert.alert(
        'Scan Complete',
        `Found ${issues.length} accessibility issues`,
        [
          {
            text: 'View Results',
            onPress: () =>
              navigation.navigate('ScanResult', {scanId: scanResult.id}),
          },
          {text: 'OK'},
        ],
      );

      // Reset form
      setAppName('');
      setScreenName('');
    } catch (error) {
      console.error('Scan failed:', error);
      Alert.alert(
        'Scan Failed',
        error instanceof Error ? error.message : 'Unknown error occurred',
      );
    } finally {
      setScanning(false);
    }
  };

  const takeScreenshot = (): Promise<string | null> => {
    return new Promise(resolve => {
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: true,
        },
        response => {
          if (response.assets && response.assets[0] && response.assets[0].base64) {
            const base64 = response.assets[0].base64;
            const mimeType = response.assets[0].type || 'image/jpeg';
            resolve(`data:${mimeType};base64,${base64}`);
          } else {
            resolve(null);
          }
        },
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Icon name="scanner" size={48} color="#2563eb" />
          <Text style={styles.title}>Start Accessibility Scan</Text>
          <Text style={styles.subtitle}>
            Analyze your app's accessibility compliance
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>App Name</Text>
            <TextInput
              style={styles.input}
              value={appName}
              onChangeText={setAppName}
              placeholder="Enter the app name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Screen Name</Text>
            <TextInput
              style={styles.input}
              value={screenName}
              onChangeText={setScreenName}
              placeholder="Enter the screen name (e.g., Login, Home)"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.infoBox}>
            <Icon name="info" size={20} color="#2563eb" />
            <Text style={styles.infoText}>
              Make sure the target app is open and visible on your screen before
              starting the scan.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
            onPress={handleScan}
            disabled={scanning}>
            {scanning ? (
              <>
                <Icon name="hourglass-empty" size={24} color="white" />
                <Text style={styles.scanButtonText}>Scanning...</Text>
              </>
            ) : (
              <>
                <Icon name="scanner" size={24} color="white" />
                <Text style={styles.scanButtonText}>Start Scan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>What we check:</Text>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.featureText}>Color contrast ratios</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.featureText}>Touch target sizes</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.featureText}>Screen reader compatibility</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <Text style={styles.featureText}>Keyboard navigation</Text>
          </View>
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
    padding: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    color: '#1f2937',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 12,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  features: {
    padding: 20,
    paddingTop: 0,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#4b5563',
    marginLeft: 12,
  },
});

export default ScanScreen;