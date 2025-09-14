import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ScanResult, getScoreColor, formatRelativeTime} from '@a11y-scanner/shared';
import {apiService} from '../services/apiService';

const HistoryScreen = ({navigation}: any) => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      setLoading(true);
      const data = await apiService.getScanResults({limit: 50});
      setScans(data.results);
    } catch (error) {
      console.error('Failed to fetch scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchScans();
    setRefreshing(false);
  };

  const renderScanItem = ({item}: {item: ScanResult}) => {
    const scoreColor = getScoreColor(item.score?.overall || 0);
    
    return (
      <TouchableOpacity
        style={styles.scanItem}
        onPress={() => navigation.navigate('ScanResult', {scanId: item.id})}>
        <View style={styles.scanHeader}>
          <View style={styles.scanInfo}>
            <Text style={styles.appName}>{item.appName}</Text>
            <Text style={styles.screenName}>{item.screenName}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={[styles.score, {color: scoreColor}]}>
              {item.score?.overall || 0}%
            </Text>
          </View>
        </View>
        
        <View style={styles.scanDetails}>
          <View style={styles.detailItem}>
            <Icon name="smartphone" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{item.platform}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="warning" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {item.issues?.length || 0} issues
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="schedule" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {formatRelativeTime(new Date(item.createdAt))}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="history" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No scans yet</Text>
      <Text style={styles.emptySubtitle}>
        Start your first accessibility scan to see results here
      </Text>
      <TouchableOpacity
        style={styles.startScanButton}
        onPress={() => navigation.navigate('Scan')}>
        <Text style={styles.startScanButtonText}>Start Scan</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        <Text style={styles.subtitle}>
          View your previous accessibility scans
        </Text>
      </View>

      <FlatList
        data={scans}
        renderItem={renderScanItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  list: {
    padding: 16,
    paddingTop: 0,
  },
  scanItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scanInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  screenName: {
    fontSize: 14,
    color: '#6b7280',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  startScanButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  startScanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HistoryScreen;