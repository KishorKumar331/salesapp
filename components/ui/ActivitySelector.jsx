import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActivitySelector = ({ 
  onSelectActivity, 
  selectedActivity, 
  destination,
  activities: externalActivities,
  loading,
  style 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivityLoading, setSelectedActivityLoading] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    Title: '',
    Description: '',
    ImageUrl: '',
  });

  // Fetch activities based on destination (if externalActivities is not provided)
  useEffect(() => {
    if (externalActivities) {
      setActivities(externalActivities);
      return;
    }

    const fetchActivities = async () => {
      if (!destination) return;
      
      try {
        const response = await fetch(
          `https://2rltmjilx9.execute-api.ap-south-1.amazonaws.com/DataTransaction/activitysightseen?DestinationName=${destination}`
        );
        const data = await response.json();
        setActivities(data?.Items || []);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, [destination, externalActivities]);

  // Filter activities based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter(activity => 
        (activity.Title || activity.Activity || activity.activity)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activity.Description || activity.description || '')?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredActivities(filtered);
    }
  }, [searchQuery, activities]);

  const generateActivityDescription = async (activity) => {
    try {
      const response = await fetch(
        "https://0rq0f90i05.execute-api.ap-south-1.amazonaws.com/salesapp/ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activitykey: activity.ImageUrl || activity.Url || `${(activity.Title || activity.Activity || 'activity').toLowerCase().replace(/\s+/g, '_')}.jpg`,
            destination: activity.Destination || destination || "bali",
            activityName: activity.Title || activity.Activity || "Activity"
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        title: data.title || activity.Title || activity.Activity,
        description: data.description || activity.Description || activity.DetailDescription || ""
      };
    } catch (error) {
      console.error("AI API error:", error);
      return {
        title: activity.Title || activity.Activity,
        description: activity.Description || activity.DetailDescription || "No description available"
      };
    }
  };

  const handleSelectActivity = async (activity) => {
    const activityName = activity.Title || activity.Activity || activity.activity;
    setSelectedActivityLoading(activityName);

    try {
      const generated = await generateActivityDescription(activity);
      
      onSelectActivity({
        ...activity,
        Title: generated.title,
        Activity: activity.Activity || activity.Title || "",
        Description: generated.description,
        ImageUrl: activity.ImageUrl || activity.Url || (activity.activitykey ? `https://d38jn0rpth8ttn.cloudfront.net/${activity.activitykey}` : ''),
      });

      setShowModal(false);
      setSearchQuery('');
    } finally {
      setSelectedActivityLoading(null);
    }
  };

  const handleAddNewActivity = () => {
    onSelectActivity({
      Title: newActivity.Title,
      Description: newActivity.Description,
      ImageUrl: newActivity.ImageUrl,
      isCustom: true
    });
    setShowAddForm(false);
    setNewActivity({ Title: '', Description: '', ImageUrl: '' });
    setShowModal(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.selectorButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.selectorText}>
          {selectedActivity?.Title || 'Select an activity'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search activities..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Fetching activities...</Text>
            </View>
          ) : !showAddForm ? (
            <>
              <FlatList
                data={filteredActivities}
                keyExtractor={(item, index) => item.ActivityId || item.activitykey || item.Title || index.toString()}
                renderItem={({ item }) => {
                  const activityName = item.Title || item.Activity || item.activity;
                  const isProcessing = selectedActivityLoading === activityName;
                  
                  return (
                  <TouchableOpacity 
                    style={[styles.activityItem, isProcessing && styles.processingItem]}
                    onPress={() => !isProcessing && handleSelectActivity(item)}
                    disabled={!!selectedActivityLoading}
                  >
                    {(item.Url || item.ImageUrl) && (
                      <Image 
                        source={{ uri: item.Url || item.ImageUrl }} 
                        style={styles.activityImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>{item.Title || item.Activity || item.activity}</Text>
                      <Text 
                        style={styles.activityDescription} 
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.Description || item.DetailDescription || item.description || 'No description available'}
                      </Text>
                    </View>
                    {isProcessing && (
                      <View style={styles.itemLoadingOverlay}>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={styles.itemLoadingText}>AI Generating...</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )}}
                ListEmptyComponent={
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No activities found</Text>
                    <TouchableOpacity 
                      style={styles.addButton}
                      onPress={() => setShowAddForm(true)}
                    >
                      <Text style={styles.addButtonText}>+ Add New Activity</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
              
              {filteredActivities.length === 0 && activities.length > 0 && (
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowAddForm(true)}
                >
                  <Text style={styles.addButtonText}>+ Add New Activity</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <ScrollView style={styles.addForm}>
              <Text style={styles.formTitle}>Add New Activity</Text>
              
              <Text style={styles.label}>Title*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter activity title"
                value={newActivity.Title}
                onChangeText={(text) => setNewActivity({...newActivity, Title: text})}
              />
              
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter activity description"
                value={newActivity.Description}
                onChangeText={(text) => setNewActivity({...newActivity, Description: text})}
                multiline
                numberOfLines={4}
              />
              
              <Text style={styles.label}>Image URL (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                value={newActivity.ImageUrl}
                onChangeText={(text) => setNewActivity({...newActivity, ImageUrl: text})}
                keyboardType="url"
              />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton, !newActivity.Title && styles.disabledButton]}
                  onPress={handleAddNewActivity}
                  disabled={!newActivity.Title}
                >
                  <Text style={styles.buttonText}>Save Activity</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectorText: {
    flex: 1,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  cancelButton: {
    marginLeft: 10,
    color: '#007AFF',
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addForm: {
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  processingItem: {
    opacity: 0.8,
  },
  itemLoadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    zIndex: 20,
  },
  itemLoadingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ActivitySelector;
