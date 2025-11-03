import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActivitySelector = ({ 
  onSelectActivity, 
  selectedActivity, 
  destination,
  style 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    Title: '',
    Description: '',
    ImageUrl: '',
  });

  // Fetch activities based on destination
  useEffect(() => {
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
  }, [destination]);

  // Filter activities based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter(activity => 
        activity.Title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.Description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredActivities(filtered);
    }
  }, [searchQuery, activities]);

  const handleSelectActivity = (activity) => {
    onSelectActivity({
      Title: activity.Title,
      Description: activity.Description || activity.DetailDescription || '',
      ImageUrl: activity.Url || activity.ImageUrl || '',
      ActivityId: activity.ActivityId
    });
    setShowModal(false);
    setSearchQuery('');
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

          {!showAddForm ? (
            <>
              <FlatList
                data={filteredActivities}
                keyExtractor={(item) => item.ActivityId || item.Title}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.activityItem}
                    onPress={() => handleSelectActivity(item)}
                  >
                    {item.Url && (
                      <Image 
                        source={{ uri: item.Url }} 
                        style={styles.activityImage}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityTitle}>{item.Title}</Text>
                      <Text 
                        style={styles.activityDescription} 
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.Description || item.DetailDescription || 'No description available'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
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
  cancelButton: {
    backgroundColor: '#f1f1f1',
    marginRight: 10,
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
});

export default ActivitySelector;
