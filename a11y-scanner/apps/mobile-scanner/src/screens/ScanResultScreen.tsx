import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ScanResult, getScoreColor, getSeverityColor} from '@a11y-scanner/shared';
import {apiService} from '../services/apiService';

const ScanResultScreen = ({route, navigation}: any) => {
  const {scanId} = route.params;
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScanResult();
  }, [scanId]);

  const fetchScanResult = async () => {
    try {
      setLoading(true);
      const data = await apiService.getScanResult(scanId);
      setScanResult(data);
    } catch (error) {
      console.error('Failed to fetch scan result:', error);
      Alert.alert('Error', 'Failed to load scan result');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !scanResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading scan result...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const scoreColor = getScoreColor(scanResult.score?.overall || 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.scoreContainer}>
            <View
              style={[
                styles.scoreCircle,
                {backgroundColor: scoreColor},
              ]}>
              <Text style={styles.scoreText}>
                {scanResult.score?.overall || 0}%
              </Text>
            </View>
            <Text style={styles.appName}>{scanResult.appName}</Text>
            <Text style={styles.screenName}>{scanResult.screenName}</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{scanResult.issues?.length || 0}</Text>
            <Text style={styles.metricLabel}>Total Issues</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, {color: '#ef4444'}]}>
              {scanResult.score?.criticalIssues || 0}
            </Text>
            <Text style={styles.metricLabel}>Critical</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, {color: '#f59e0b'}]}>
              {scanResult.score?.highIssues || 0}
            </Text>
            <Text style={styles.metricLabel}>High</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, {color: '#10b981'}]}>
              {scanResult.score?.mediumIssues || 0}
            </Text>
            <Text style={styles.metricLabel}>Medium</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WCAG Categories</Text>
          <View style={styles.categoryGrid}>
            <View style={styles.categoryCard}>
              <Text style={styles.categoryScore}>
                {scanResult.score?.perceivable || 0}%
              </Text>
              <Text style={styles.categoryLabel}>Perceivable</Text>
            </View>
            <View style={styles.categoryCard}>
              <Text style={styles.categoryScore}>
                {scanResult.score?.operable || 0}%
              </Text>
              <Text style={styles.categoryLabel}>Operable</Text>
            </View>
            <View style={styles.categoryCard}>
              <Text style={styles.categoryScore}>
                {scanResult.score?.understandable || 0}%
              </Text>
              <Text style={styles.categoryLabel}>Understandable</Text>
            </View>
            <View style={styles.categoryCard}>
              <Text style={styles.categoryScore}>
                {scanResult.score?.robust || 0}%
              </Text>
              <Text style={styles.categoryLabel}>Robust</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issues Found</Text>
          {scanResult.issues && scanResult.issues.length > 0 ? (
            scanResult.issues.map((issue, index) => {
              const severityColor = getSeverityColor(issue.severity);
              return (
                <View key={issue.id || index} style={styles.issueCard}>
                  <View style={styles.issueHeader}>
                    <Text style={styles.issueTitle}>{issue.title}</Text>
                    <View
                      style={[
                        styles.severityBadge,
                        {backgroundColor: severityColor},
                      ]}>
                      <Text style={styles.severityText}>
                        {issue.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.issueDescription}>
                    {issue.description}
                  </Text>
                  <View style={styles.issueFooter}>
                    <Text style={styles.wcagInfo}>
                      WCAG {issue.wcagLevel} - {issue.wcagCriteria}
                    </Text>
                    <Text style={styles.categoryInfo}>
                      {issue.category.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.noIssuesCard}>
              <Icon name="check-circle" size={48} color="#10b981" />
              <Text style={styles.noIssuesTitle}>No Issues Found!</Text>
              <Text style={styles.noIssuesText}>
                This screen passed all accessibility checks.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scan Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Platform:</Text>
              <Text style={styles.detailValue}>{scanResult.platform}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Scan Type:</Text>
              <Text style={styles.detailValue}>{scanResult.scanType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Device:</Text>
              <Text style={styles.detailValue}>
                {scanResult.metadata.deviceInfo.model}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>OS Version:</Text>
              <Text style={styles.detailValue}>
                {scanResult.metadata.deviceInfo.osVersion}
              </Text>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 32,
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  screenName: {
    fontSize: 16,
    color: '#6b7280',
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  issueCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 12,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  issueDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wcagInfo: {
    fontSize: 12,
    color: '#6b7280',
  },
  categoryInfo: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  noIssuesCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 32,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noIssuesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noIssuesText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
});

export default ScanResultScreen;