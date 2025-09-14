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
import {ScanMetrics} from '@a11y-scanner/shared';
import {apiService} from '../services/apiService';

const HomeScreen = ({navigation}: any) => {
  const [metrics, setMetrics] = useState<ScanMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMetrics();
      setMetrics(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch metrics');
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
  }) => (
    <View style={styles.metricCard}>
      <View style={[styles.iconContainer, {backgroundColor: color}]}>
        <Icon name={icon} size={24} color="white" />
      </View>
      <View style={styles.metricContent}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>A11y Scanner</Text>
          <Text style={styles.subtitle}>
            Accessibility testing made simple
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading metrics...</Text>
          </View>
        ) : metrics ? (
          <>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Total Scans"
                value={metrics.totalScreensScanned}
                icon="scanner"
                color="#3b82f6"
              />
              <MetricCard
                title="Average Score"
                value={`${metrics.averageScore}%`}
                icon="trending-up"
                color="#10b981"
              />
              <MetricCard
                title="Total Issues"
                value={metrics.totalIssues}
                icon="warning"
                color="#f59e0b"
              />
              <MetricCard
                title="Critical Issues"
                value={metrics.issuesBySeverity.critical}
                icon="error"
                color="#ef4444"
              />
            </View>

            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Scan')}>
                <Icon name="scanner" size={24} color="#2563eb" />
                <Text style={styles.actionButtonText}>Start New Scan</Text>
                <Icon name="chevron-right" size={24} color="#9ca3af" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('History')}>
                <Icon name="history" size={24} color="#2563eb" />
                <Text style={styles.actionButtonText}>View Scan History</Text>
                <Icon name="chevron-right" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text>Failed to load metrics</Text>
            <TouchableOpacity onPress={fetchMetrics} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metricTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 12,
  },
});

export default HomeScreen;