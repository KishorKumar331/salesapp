import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import ActivitySelector from "@/components/ui/ActivitySelector";
import { styles } from "./Styles";

const ItinerarySection = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { control, watch, setValue, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Itinearies",
  });

  const days = watch("Days") || 1;
  const destinations = watch("Destinations");
  const travelDate = watch("TravelDate");

  /* ------------------ Helpers ------------------ */

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getItineraryDate = (index) => {
    if (!travelDate) return "";
    const d = new Date(travelDate);
    d.setDate(d.getDate() + index);
    return formatDate(d);
  };

  /* ------------------ Add Day ------------------ */

  const addDay = () => {
    const nextDay = fields.length + 1;
    const base = travelDate ? new Date(travelDate) : new Date();
    const date = new Date(base);
    date.setDate(base.getDate() + (nextDay - 1));

    const formattedDate = formatDate(date);
    const dateKey = Number(formattedDate.replace(/-/g, ""));

    append({
      day: nextDay,
      Date: formattedDate,
      DateKey: dateKey,
      Title: `Day ${nextDay} Itinerary`,
      Activity: "",
      ImageUrl: "",
      Description: "",
      OtherActivityImages: [],
    }, { shouldFocus: false });
  };

  /* ------------------ Remove Day ------------------ */

  const removeDay = (index) => {
    if (fields.length <= 1) return;

    remove(index);

    const updated = [...getValues("Itinearies")];
    // RHF remove already worked on fields, but we need to update the rest of the values
    updated.forEach((item, idx) => {
      item.day = idx + 1;
      item.Title = `Day ${idx + 1} Itinerary`;
    });

    setValue("Itinearies", updated, { shouldDirty: true });
  };

  /* ------------------ Activity Select ------------------ */

  const handleActivitySelect = (activity, index) => {
    console.log('Activity Selected for Day', index + 1, ':', activity);

    const itineraryDate = getItineraryDate(index);
    const dateKey = Number(itineraryDate.replace(/-/g, ""));

    // Use Title or fall back to Activity name
    const finalTitle = activity.Title || activity.Activity || `Day ${index + 1} Itinerary`;
    const finalDescription = activity.Description || activity.DetailDescription || "";
    const finalImageUrl = activity.ImageUrl || activity.Url || "";

    setValue(`Itinearies.${index}.Title`, finalTitle, { shouldDirty: true });
    setValue(`Itinearies.${index}.Activity`, activity.Activity || activity.Title || "", { shouldDirty: true });
    setValue(`Itinearies.${index}.ImageUrl`, finalImageUrl, { shouldDirty: true });
    setValue(`Itinearies.${index}.Description`, finalDescription, { shouldDirty: true });
    setValue(`Itinearies.${index}.Date`, itineraryDate, { shouldDirty: true });
    setValue(`Itinearies.${index}.DateKey`, dateKey, { shouldDirty: true });
    setValue(`Itinearies.${index}.OtherActivityImages`, activity.OtherActivityImages || [], { shouldDirty: true });

    console.log('Form values updated for index', index);
  };

  /* ------------------ Auto-generate Days ------------------ */

  useEffect(() => {
    const current = fields.length;
    const target = Number(days) || 1;
    const base = travelDate ? new Date(travelDate) : new Date();

    if (target > current) {
      for (let i = current; i < target; i++) {
        const date = new Date(base);
        date.setDate(base.getDate() + i);

        const formattedDate = formatDate(date);
        const dateKey = Number(formattedDate.replace(/-/g, ""));

        append({
          day: i + 1,
          Date: formattedDate,
          DateKey: dateKey,
          Title: `Day ${i + 1} Itinerary`,
          Activity: "",
          ImageUrl: "",
          Description: "",
          OtherActivityImages: [],
        }, { shouldFocus: false });
      }
    } else if (target < current) {
      for (let i = current - 1; i >= target; i--) {
        remove(i);
      }
    }
  }, [days, travelDate]);

  /* ------------------ Init ------------------ */

  useEffect(() => {
    if (fields.length === 0) addDay();
  }, []);

  /* ============================================================
     FETCH ACTIVITIES FROM CLOUDFRONT JSON
  ============================================================ */

  useEffect(() => {
    if (!Array.isArray(destinations) || destinations.length === 0) {
      setActivities([]);
      return;
    }

    let isMounted = true;

    const fetchActivities = async (destination) => {
      try {
        const response = await fetch(
          `https://cdn.infinitepackages.com/activity-storage/${destination.toLowerCase().trim()}.json`
        );

        if (!response.ok) {
          throw new Error(`Failed fetching ${destination}`);
        }

        const data = await response.json();

        return data.map((item) => ({
          Title: item.activity,
          Activity: item.activity,
          Description: item.description || "",
          Destination: item.destination,
          ImageUrl: `https://d38jn0rpth8ttn.cloudfront.net/${item.activitykey}`,
        }));
      } catch (error) {
        console.error("Activity fetch error:", error);
        return [];
      }
    };

    const fetchAllActivities = async () => {
      try {
        setIsLoading(true);

        const results = await Promise.all(
          destinations.map((dest) => fetchActivities(dest))
        );

        console.log(results)

        const merged = results.flat();

        if (isMounted) {
          setActivities(merged);
        }
      } catch (error) {
        console.error("Fetch all error:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAllActivities();

    return () => {
      isMounted = false;
    };
  }, [destinations]);

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconWrapper}>
          <Ionicons name="calendar" size={20} color="#047857" />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Day-wise Itinerary</Text>
          <Text style={styles.sectionSubtitle}>Plan each day of the trip</Text>
        </View>
      </View>

      <View style={styles.daysList}>
        {fields.map((field, index) => (
          <View key={field.id} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View style={styles.dayLabelContainer}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>Day {index + 1}</Text>
                </View>
                <Text style={styles.dayDateText}>
                  {getItineraryDate(index) || "No date set"}
                </Text>
              </View>

              <View style={styles.headerActions}>
                {fields.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeDay(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="trash" size={18} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.activitySelectorWrapper}>
              <ActivitySelector
                onSelectActivity={(a) => handleActivitySelect(a, index)}
                selectedActivity={{
                  Title: watch(`Itinearies.${index}.Title`) || "",
                  ImageUrl: watch(`Itinearies.${index}.ImageUrl`) || "",
                }}
                activities={activities}
                loading={isLoading}
                destination={destinations?.[0]}
              />
            </View>

            <View style={styles.contentContainer}>
              <Controller
                control={control}
                name={`Itinearies.${index}.ImageUrl`}
                render={({ field: { value } }) => (
                  <View style={styles.imageWrapper}>
                    {value ? (
                      <Image
                        source={{ uri: value }}
                        style={styles.itineraryImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <Ionicons name="camera" size={32} color="#9ca3af" />
                      </View>
                    )}
                  </View>
                )}
              />

              <View style={styles.inputsWrapper}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Ionicons name="create-outline" size={14} color="#9ca3af" /> Day Title
                  </Text>
                  <Controller
                    control={control}
                    name={`Itinearies.${index}.Title`}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.textInput}
                        value={value}
                        onChangeText={onChange}
                        placeholder="Enter day title"
                        placeholderTextColor="#9ca3af"
                      />
                    )}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Ionicons name="create-outline" size={14} color="#9ca3af" /> Description
                  </Text>
                  <Controller
                    control={control}
                    name={`Itinearies.${index}.Description`}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={[styles.textInput, styles.textArea]}
                        value={value}
                        onChangeText={onChange}
                        placeholder="Detailed description of the day"
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={addDay} style={styles.addButton}>
        <Ionicons name="add-circle" size={20} color="#047857" />
        <Text style={styles.addButtonText}>Add Another Day</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ItinerarySection;
