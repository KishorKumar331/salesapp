// components/ui/DateRangeSelector.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';

const normalizeDate = (value) => {
  if (!value) return null;
  const d = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate = new Date(),
  maxDate = null,
  containerStyle,
  label = 'Select Date Range',
  showLabel = true,
}) => {
  const [showModal, setShowModal] = useState(false);

  const [tempStartDate, setTempStartDate] = useState(
    startDate ? normalizeDate(startDate) : null
  );
  const [tempEndDate, setTempEndDate] = useState(
    endDate ? normalizeDate(endDate) : null
  );

  const [currentMonth, setCurrentMonth] = useState(
    startDate ? normalizeDate(startDate) : normalizeDate(new Date())
  );

  // Sync internal temp values when parent props change
  useEffect(() => {
    setTempStartDate(startDate ? normalizeDate(startDate) : null);
  }, [startDate]);

  useEffect(() => {
    setTempEndDate(endDate ? normalizeDate(endDate) : null);
  }, [endDate]);

  useEffect(() => {
    if (startDate) {
      setCurrentMonth(normalizeDate(startDate));
    }
  }, [startDate]);

  const monthLabel = useMemo(() => {
    return currentMonth.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentMonth]);

  const getDaysMatrix = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekDay = firstDay.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstWeekDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const days = useMemo(getDaysMatrix, [currentMonth]);

  const formatDisplayDate = (value) => {
    if (!value) return 'Select date';
    const d = value instanceof Date ? value : new Date(value);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const isSameDay = (a, b) => {
    if (!a || !b) return false;
    const da = normalizeDate(a);
    const db = normalizeDate(b);
    return da.getTime() === db.getTime();
  };

  const getMinMax = () => {
    const min = minDate ? normalizeDate(minDate) : null;
    const max = maxDate ? normalizeDate(maxDate) : null;
    return { min, max };
  };

  const isDateDisabled = (date) => {
    if (!date) return false;
    const { min, max } = getMinMax();
    const d = normalizeDate(date);
    if (min && d < min) return true;
    if (max && d > max) return true;
    return false;
  };

  const isInRange = (date) => {
    if (!tempStartDate || !tempEndDate || !date) return false;
    const d = normalizeDate(date);
    const s = normalizeDate(tempStartDate);
    const e = normalizeDate(tempEndDate);
    return d > s && d < e;
  };

  const handleDayPress = (date) => {
    if (!date || isDateDisabled(date)) return;
    const d = normalizeDate(date);

    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // Start fresh selection
      setTempStartDate(d);
      setTempEndDate(null);
      return;
    }

    // If selecting end date
    if (d < tempStartDate) {
      // Swap
      setTempEndDate(tempStartDate);
      setTempStartDate(d);
    } else if (d.getTime() === tempStartDate.getTime()) {
      // Same as start => reset end
      setTempEndDate(null);
    } else {
      setTempEndDate(d);
    }
  };

  const navigateMonth = (step) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev.getTime());
      next.setMonth(prev.getMonth() + step);
      return next;
    });
  };

  const handleApply = () => {
    if (!tempStartDate) return;

    const start = normalizeDate(tempStartDate);
    const end = tempEndDate ? normalizeDate(tempEndDate) : normalizeDate(tempStartDate);

    onStartDateChange?.(start);
    onEndDateChange?.(end);
    setShowModal(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate ? normalizeDate(startDate) : null);
    setTempEndDate(endDate ? normalizeDate(endDate) : null);
    setShowModal(false);
  };

  // For UI highlighting
  const isSelected = (date) =>
    (tempStartDate && isSameDay(date, tempStartDate)) ||
    (tempEndDate && isSameDay(date, tempEndDate));

  return (
    <View style={[styles.container, containerStyle]}>
      {showLabel && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.dateDisplay}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.dateDisplayItem}>
          <Text style={styles.dateLabel}>Check-in</Text>
          <Text style={styles.dateText}>
            {startDate ? formatDisplayDate(startDate) : 'Select date'}
          </Text>
        </View>

        <View style={styles.dateDisplayItem}>
          <Text style={styles.dateLabel}>Check-out</Text>
          <Text style={styles.dateText}>
            {endDate ? formatDisplayDate(endDate) : 'Select date'}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Dates</Text>

            <View style={styles.monthHeader}>
              <TouchableOpacity
                style={styles.monthNavButton}
                onPress={() => navigateMonth(-1)}
              >
                <Text style={styles.monthNavText}>‹</Text>
              </TouchableOpacity>

              <Text style={styles.monthTitle}>{monthLabel}</Text>

              <TouchableOpacity
                style={styles.monthNavButton}
                onPress={() => navigateMonth(1)}
              >
                <Text style={styles.monthNavText}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.weekDaysContainer}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <Text key={day} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            <ScrollView style={styles.daysContainer}>
              <View style={styles.daysGrid}>
                {days.map((date, index) => {
                  if (!date) {
                    return <View key={`empty-${index}`} style={styles.dayCell} />;
                  }

                  const disabled = isDateDisabled(date);
                  const selected = isSelected(date);
                  const inRange = isInRange(date);

                  return (
                    <TouchableOpacity
                      key={date.toISOString()}
                      style={[
                        styles.dayCell,
                        inRange && styles.dayInRange,
                        selected && styles.daySelected,
                        disabled && styles.dayDisabled,
                      ]}
                      disabled={disabled}
                      onPress={() => handleDayPress(date)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          selected && styles.daySelectedText,
                          disabled && styles.dayDisabledText,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.applyButton,
                  !tempStartDate && styles.buttonDisabled,
                ]}
                onPress={handleApply}
                disabled={!tempStartDate}
              >
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  dateDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateDisplayItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#111827',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthNavButton: {
    padding: 8,
  },
  monthNavText: {
    fontSize: 20,
    color: '#3b82f6',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  weekDayText: {
    width: '14.28%',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '500',
  },
  daysContainer: {
    maxHeight: 300,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  dayText: {
    fontSize: 14,
    color: '#111827',
  },
  daySelected: {
    backgroundColor: '#3b82f6',
    borderRadius: 999,
  },
  daySelectedText: {
    color: 'white',
    fontWeight: '600',
  },
  dayInRange: {
    backgroundColor: '#dbeafe',
    borderRadius: 999,
  },
  dayDisabled: {
    opacity: 0.3,
  },
  dayDisabledText: {
    color: '#9ca3af',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginLeft: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  applyButton: {
    backgroundColor: '#3b82f6',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#374151',
  },
});

export default DateRangeSelector;
