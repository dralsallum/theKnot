import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Image,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  View,
  Text,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { createUserRequest } from "../../requestMethods";
import { useRouter } from "expo-router";

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fdf8f5;
  direction: rtl;
`;

const SectionContainer = styled.View`
  margin-bottom: 1px;
`;

const SectionHeader = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-bottom-width: ${(props) => (props.expanded ? "1px" : "0")};
  border-bottom-color: #eee;
`;

const SectionHeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CategoryIcon = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  margin-right: 12px;
  overflow: hidden;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  text-align: left;
`;

const ChevronIcon = styled.Text`
  font-size: 18px;
  color: #666;
  text-align: left;
`;

const TasksContainer = styled.View`
  background-color: #fff;
`;

const TaskItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  background-color: #fff;
`;

const TaskCheckbox = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #ccc;
  margin-right: 16px;
  align-items: center;
  justify-content: center;
`;

const TaskTitleContainer = styled.View`
  flex: 1;
`;

const TaskTitle = styled.Text`
  font-size: 16px;
  color: #000;
  text-align: left;
`;

const TaskDue = styled.Text`
  font-size: 14px;
  color: ${(props) => (props.pastDue ? "#E97451" : "#999")};
  margin-top: 4px;
  text-align: left;
`;

const Header = styled.View`
  padding: 16px;
  background-color: #fdf8f5;
`;

const HeaderTop = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  margin-right: 1٢px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
  text-align: left;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  margin-top: 16px;
  text-align: left;
`;

const WeddingDate = styled.Text`
  font-size: 16px;
  text-decoration: underline;
  font-weight: 600;
  text-align: left;
`;

const TotalCount = styled.Text`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 4px;
  text-align: left;
`;

const TabRow = styled.View`
  flex-direction: row;
  margin: 16px;
  border-radius: 99px;
  background-color: #f0f0f2;
  padding: 4px;
`;

const TabButton = styled.TouchableOpacity`
  flex: 1;
  padding: 12px;
  align-items: center;
  justify-content: center;
  border-radius: 99px;
  background-color: ${(props) => (props.active ? "#fff" : "transparent")};
`;

const TabButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.active ? "#000" : "#666")};
  text-align: left;
`;

const AddTaskButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-top-width: 1px;
  border-top-color: #eee;
`;

const AddTaskText = styled.Text`
  color: #3d85c6;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
`;

const PlusButton = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #3d85c6;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 16px;
`;

const PlusIcon = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  text-align: left;
`;

const BottomNavigation = styled.View`
  flex-direction: row;
  background-color: #fff;
  padding: 12px 0;
  border-top-width: 1px;
  border-top-color: #eee;
`;

const NavButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
`;

const NavLabel = styled.Text`
  font-size: 12px;
  color: ${(props) => (props.active ? "#ec4899" : "#666")};
  margin-top: 4px;
  text-align: left;
`;

// Modal Styled Components
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContent = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  text-align: left;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

const FormGroup = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: left;
`;

const Input = styled(TextInput)`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  text-align: left;
  background-color: #fff;
`;

// Date Picker Styled Components
const DatePickerButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 12px;
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DatePickerText = styled.Text`
  font-size: 16px;
  color: ${(props) => (props.placeholder ? "#999" : "#000")};
  text-align: left;
`;

const ClearDateButton = styled.TouchableOpacity`
  padding: 4px;
`;

// Icon Selector Styled Components
const IconScrollContainer = styled.ScrollView`
  flex-direction: row;
`;

const IconOption = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props) => (props.selected ? "#3d85c6" : "#ddd")};
  margin-right: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.selected ? "#f0f7ff" : "#fff")};
`;

const IconImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
`;

const Button = styled.TouchableOpacity`
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-horizontal: 8px;
`;

const PrimaryButton = styled(Button)`
  background-color: #3d85c6;
`;

const SecondaryButton = styled(Button)`
  background-color: #f0f0f0;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.primary ? "#fff" : "#666")};
`;

const ErrorText = styled.Text`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 4px;
  text-align: left;
`;

const Checklist = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.currentUser);
  const userId = user?._id;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("category");
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedMonths, setExpandedMonths] = useState([]);

  // Available icon options
  const iconOptions = [
    {
      id: "food",
      url: "https://alsallum.s3.eu-north-1.amazonaws.com/food.png",
      name: "طعام",
    },
    {
      id: "music",
      url: "https://alsallum.s3.eu-north-1.amazonaws.com/music.png",
      name: "موسيقى",
    },
    {
      id: "registry",
      url: "https://alsallum.s3.eu-north-1.amazonaws.com/registry.png",
      name: "التسجيل",
    },
    {
      id: "invitation",
      url: "https://alsallum.s3.eu-north-1.amazonaws.com/invitation.png",
      name: "الدعوات",
    },
    {
      id: "Photograph",
      url: "https://alsallum.s3.eu-north-1.amazonaws.com/photo.png",
      name: "التصوير",
    },
    {
      id: "location",
      url: "https://alsallum.s3.eu-north-1.amazonaws.com/location.png",
      name: "مكان",
    },
  ];

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [newTask, setNewTask] = useState({
    category: "",
    title: "",
    iconUrl: "",
    due: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleBack = () => {
    router.push("home");
  };

  // Toggle task completion status

  // Fixed handleToggleCompleted function
  const handleToggleCompleted = async (task) => {
    try {
      const newCompletionStatus = !task.isCompleted;

      // Optimistically update the UI first
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, isCompleted: newCompletionStatus } : t
        )
      );

      const res = await createUserRequest().patch(
        `/users/${userId}/checklist/${task._id}`,
        {
          isCompleted: newCompletionStatus,
        }
      );

      // Verify the response and update with server data if needed
      if (res.data && res.data.checklistItem) {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t._id === task._id ? res.data.checklistItem : t
          )
        );
      }
    } catch (err) {
      console.error(
        "error updating tasks",
        err.response?.status,
        err.response?.data,
        err.message
      );

      // Revert the optimistic update on error - use the original task state
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? task : t))
      );

      Alert.alert("خطأ", "فشل في تحديث المهمة");
    }
  };

  // Enhanced version with loading states and debouncing
  const [updatingTasks, setUpdatingTasks] = useState(new Set());

  // Fetch tasks from server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await createUserRequest().get(`/users/${userId}/checklist`);
        setTasks(res.data.checklist || []);
      } catch (err) {
        console.error("error fetching checklist", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  // Open modal for adding new task
  const handleAddTask = () => {
    setModalVisible(true);
    setFormErrors({});
    setNewTask({
      category: "",
      title: "",
      iconUrl: "",
      due: null,
    });
  };

  // Close modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setFormErrors({});
    setNewTask({
      category: "",
      title: "",
      iconUrl: "",
      due: null,
    });
    setShowDatePicker(false);
  };

  // Handle icon selection
  const handleIconSelect = (iconUrl) => {
    setNewTask((prev) => ({ ...prev, iconUrl }));
  };

  // Handle date picker change
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setNewTask((prev) => ({ ...prev, due: selectedDate }));
    }
  };

  // Show date picker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Clear selected date
  const clearDate = () => {
    setNewTask((prev) => ({ ...prev, due: null }));
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return null;
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!newTask.category.trim()) {
      errors.category = "الفئة مطلوبة";
    }

    if (!newTask.title.trim()) {
      errors.title = "عنوان المهمة مطلوب";
    }

    if (!newTask.iconUrl.trim()) {
      errors.iconUrl = "يرجى اختيار أيقونة";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit new task
  const handleSubmitTask = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const taskData = {
        category: newTask.category.trim(),
        title: newTask.title.trim(),
        iconUrl: newTask.iconUrl.trim(),
      };

      // Add due date if provided
      if (newTask.due) {
        taskData.due = newTask.due.toISOString();
      }

      const res = await createUserRequest().post(
        `/users/${userId}/checklist`,
        taskData
      );

      // Add the new task to local state
      if (res.data.checklistItem) {
        setTasks((prevTasks) => [...prevTasks, res.data.checklistItem]);
        handleCloseModal();
        Alert.alert("نجح", "تم إضافة المهمة بنجاح");
      }
    } catch (err) {
      console.error("خطأ في إضافة المهمة", err);
      Alert.alert("خطأ", "فشل في إضافة المهمة");
    } finally {
      setSubmitting(false);
    }
  };

  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {});

  // Group tasks by month if task has due date
  const tasksByMonth = tasks.reduce((acc, task) => {
    if (task.due) {
      const month = new Date(task.due).toLocaleString("ar-SA", {
        month: "long",
      });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(task);
    }
    return acc;
  }, {});

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleMonth = (month) => {
    setExpandedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  if (loading) {
    return (
      <Container style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </Container>
    );
  }

  // Render content grouped by category or month
  const renderContent = () => {
    if (activeTab === "category") {
      return Object.keys(tasksByCategory).map((cat) => {
        const isExpanded = expandedCategories.includes(cat);
        const iconUrl = tasksByCategory[cat][0]?.iconUrl;

        return (
          <SectionContainer key={cat}>
            <SectionHeader
              onPress={() => toggleCategory(cat)}
              expanded={isExpanded}
            >
              <SectionHeaderLeft>
                {iconUrl && (
                  <CategoryIcon>
                    <Image
                      source={{ uri: iconUrl }}
                      style={{ width: 32, height: 32, borderRadius: 8 }}
                      onError={() =>
                        console.log("Failed to load image:", iconUrl)
                      }
                    />
                  </CategoryIcon>
                )}
                <SectionTitle>{cat}</SectionTitle>
              </SectionHeaderLeft>
              <ChevronIcon>{isExpanded ? "▲" : "▼"}</ChevronIcon>
            </SectionHeader>
            {isExpanded && (
              <TasksContainer>
                {tasksByCategory[cat].map((task) => (
                  <TaskItem
                    key={task._id}
                    onPress={() => handleToggleCompleted(task)}
                  >
                    <TaskCheckbox>
                      {task.isCompleted && (
                        <Feather name="check" size={16} color="#000" />
                      )}
                    </TaskCheckbox>
                    <TaskTitleContainer>
                      <TaskTitle>{task.title}</TaskTitle>
                      {task.due && (
                        <TaskDue pastDue={new Date(task.due) < new Date()}>
                          {new Date(task.due).toLocaleDateString("ar-SA")}
                        </TaskDue>
                      )}
                    </TaskTitleContainer>
                    <Feather name="chevron-left" size={20} color="#ccc" />
                  </TaskItem>
                ))}
              </TasksContainer>
            )}
          </SectionContainer>
        );
      });
    } else {
      return Object.keys(tasksByMonth).map((month) => {
        const isExpanded = expandedMonths.includes(month);
        return (
          <SectionContainer key={month}>
            <SectionHeader
              onPress={() => toggleMonth(month)}
              expanded={isExpanded}
            >
              <SectionHeaderLeft>
                <SectionTitle>{month}</SectionTitle>
              </SectionHeaderLeft>
              <ChevronIcon>{isExpanded ? "▲" : "▼"}</ChevronIcon>
            </SectionHeader>
            {isExpanded && (
              <TasksContainer>
                {tasksByMonth[month].map((task) => (
                  <TaskItem
                    key={task._id}
                    onPress={() => handleToggleCompleted(task)}
                  >
                    <TaskCheckbox>
                      {task.isCompleted && (
                        <Feather name="check" size={16} color="#000" />
                      )}
                    </TaskCheckbox>
                    <TaskTitleContainer>
                      <TaskTitle>{task.title}</TaskTitle>
                      {task.due && (
                        <TaskDue pastDue={new Date(task.due) < new Date()}>
                          {new Date(task.due).toLocaleDateString("ar-SA")}
                        </TaskDue>
                      )}
                    </TaskTitleContainer>
                    <Feather name="chevron-left" size={20} color="#ccc" />
                  </TaskItem>
                ))}
              </TasksContainer>
            )}
          </SectionContainer>
        );
      });
    }
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <Header>
        <HeaderTop>
          <BackButton onPress={handleBack}>
            <Feather name="arrow-right" size={24} color="#000" />
          </BackButton>
          <Title>قائمة المهام</Title>
        </HeaderTop>

        <SubTitle>
          بناءً على تاريخ زفافك: <WeddingDate>16 ديسمبر 2025</WeddingDate>
        </SubTitle>
      </Header>
      {/* Tab Row */}
      <TabRow>
        <TabButton
          active={activeTab === "category"}
          onPress={() => setActiveTab("category")}
        >
          <TabButtonText active={activeTab === "category"}>
            حسب الفئة
          </TabButtonText>
        </TabButton>
        <TabButton
          active={activeTab === "month"}
          onPress={() => setActiveTab("month")}
        >
          <TabButtonText active={activeTab === "month"}>
            حسب الشهر
          </TabButtonText>
        </TabButton>
      </TabRow>
      {/* Content */}
      <ScrollView style={{ flex: 1 }}>
        {tasks.length === 0 ? (
          <Container
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
            }}
          >
            <Title style={{ fontSize: 18, textAlign: "center" }}>
              لا توجد مهام بعد
            </Title>
            <SubTitle style={{ textAlign: "center", marginTop: 8 }}>
              ابدأ بإضافة مهام جديدة لتنظيم زفافك
            </SubTitle>
          </Container>
        ) : (
          renderContent()
        )}
      </ScrollView>
      {/* Add Task Button */}
      <AddTaskButton onPress={handleAddTask}>
        <AddTaskText>إضافة مهمة</AddTaskText>
        <PlusButton>
          <PlusIcon>+</PlusIcon>
        </PlusButton>
      </AddTaskButton>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ModalOverlay>
            <TouchableWithoutFeedback>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>إضافة مهمة جديدة</ModalTitle>
                  <CloseButton onPress={handleCloseModal}>
                    <Feather name="x" size={24} color="#666" />
                  </CloseButton>
                </ModalHeader>

                <FormGroup>
                  <Label>الفئة *</Label>
                  <Input
                    value={newTask.category}
                    onChangeText={(text) =>
                      setNewTask((prev) => ({ ...prev, category: text }))
                    }
                    placeholder="مثال: التخطيط، الديكور، الطعام"
                    placeholderTextColor="#999"
                  />
                  {formErrors.category && (
                    <ErrorText>{formErrors.category}</ErrorText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>عنوان المهمة *</Label>
                  <Input
                    value={newTask.title}
                    onChangeText={(text) =>
                      setNewTask((prev) => ({ ...prev, title: text }))
                    }
                    placeholder="اكتب عنوان المهمة"
                    placeholderTextColor="#999"
                  />
                  {formErrors.title && (
                    <ErrorText>{formErrors.title}</ErrorText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>اختر الأيقونة *</Label>
                  <IconScrollContainer
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 8 }}
                  >
                    {iconOptions.map((icon) => (
                      <IconOption
                        key={icon.id}
                        selected={newTask.iconUrl === icon.url}
                        onPress={() => handleIconSelect(icon.url)}
                      >
                        <IconImage
                          source={{ uri: icon.url }}
                          onError={(error) =>
                            console.log("Icon load error:", error)
                          }
                        />
                      </IconOption>
                    ))}
                  </IconScrollContainer>
                  {formErrors.iconUrl && (
                    <ErrorText>{formErrors.iconUrl}</ErrorText>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>تاريخ الانتهاء (اختياري)</Label>
                  <DatePickerButton onPress={showDatepicker}>
                    <DatePickerText>
                      {newTask.due ? formatDate(newTask.due) : "اختر التاريخ"}
                    </DatePickerText>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {newTask.due && (
                        <ClearDateButton onPress={clearDate}>
                          <Feather name="x" size={16} color="#999" />
                        </ClearDateButton>
                      )}
                      <Feather name="calendar" size={20} color="#666" />
                    </View>
                  </DatePickerButton>
                  {formErrors.due && <ErrorText>{formErrors.due}</ErrorText>}
                </FormGroup>

                <ButtonRow>
                  <SecondaryButton onPress={handleCloseModal}>
                    <ButtonText>إلغاء</ButtonText>
                  </SecondaryButton>
                  <PrimaryButton
                    onPress={handleSubmitTask}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <ButtonText primary>إضافة</ButtonText>
                    )}
                  </PrimaryButton>
                </ButtonRow>

                {/* Date Picker - Now inside the Modal */}
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={newTask.due || new Date()}
                    mode="date"
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </ModalContent>
            </TouchableWithoutFeedback>
          </ModalOverlay>
        </TouchableWithoutFeedback>
      </Modal>
    </Container>
  );
};

export default Checklist;
