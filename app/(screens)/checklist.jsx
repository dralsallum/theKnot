import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Image, // import Image for rendering logo
} from "react-native";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { createUserRequest } from "../../requestMethods";

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fdf8f5;
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
`;

const ChevronIcon = styled.Text`
  font-size: 18px;
  color: #666;
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
`;

const TaskDue = styled.Text`
  font-size: 14px;
  color: ${(props) => (props.pastDue ? "#E97451" : "#999")};
  margin-top: 4px;
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
  margin-right: 16px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const SubTitle = styled.Text`
  font-size: 16px;
  margin-top: 16px;
`;

const WeddingDate = styled.Text`
  font-size: 16px;
  text-decoration: underline;
  font-weight: 600;
`;

const TotalCount = styled.Text`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 4px;
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
`;

const PlusButton = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #3d85c6;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 16px;
`;

const PlusIcon = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
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

  const handleBack = () => {
    navigation.goBack();
  };

  // Toggle the task completion state
  const handleToggleCompleted = async (task) => {
    try {
      const res = await createUserRequest().put(`/checklist/${task._id}`, {
        isCompleted: !task.isCompleted,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await createUserRequest().get(`/checklist/${userId}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {});

  // Group tasks by month if a task has a due date
  const tasksByMonth = tasks.reduce((acc, task) => {
    if (task.due) {
      const month = new Date(task.due).toLocaleString("en-US-u-ca-gregory", {
        month: "long",
      });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(task);
    }
    return acc;
  }, {});

  const totalMonthTasks = Object.values(tasksByMonth).reduce(
    (sum, tasks) => sum + tasks.length,
    0
  );

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

  // Render tasks grouped either by category or by month
  const renderContent = () => {
    if (activeTab === "category") {
      return Object.keys(tasksByCategory).map((cat) => {
        const isExpanded = expandedCategories.includes(cat);
        // Assume that all tasks in the same category have the same iconUrl.
        const iconUrl = tasksByCategory[cat][0].iconUrl;
        return (
          <SectionContainer key={cat}>
            <SectionHeader
              onPress={() => toggleCategory(cat)}
              expanded={isExpanded}
            >
              <SectionHeaderLeft>
                <CategoryIcon>
                  <Image
                    source={{ uri: iconUrl }}
                    style={{ width: 32, height: 32, borderRadius: 8 }}
                  />
                </CategoryIcon>
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
                        <TaskDue>
                          {new Date(task.due).toLocaleDateString()}
                        </TaskDue>
                      )}
                    </TaskTitleContainer>
                    <Feather name="chevron-right" size={20} color="#ccc" />
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
                        <TaskDue>
                          {new Date(task.due).toLocaleDateString()}
                        </TaskDue>
                      )}
                    </TaskTitleContainer>
                    <Feather name="chevron-right" size={20} color="#ccc" />
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

      {/* HEADER */}
      <Header>
        <HeaderTop>
          <BackButton onPress={handleBack}>
            <Feather name="arrow-left" size={24} color="#000" />
          </BackButton>
          <Title>Checklist</Title>
        </HeaderTop>

        <SubTitle>
          Based on your wedding date: <WeddingDate>Dec 16, 2025</WeddingDate>
        </SubTitle>
      </Header>

      {/* TAB ROW */}
      <TabRow>
        <TabButton
          active={activeTab === "category"}
          onPress={() => setActiveTab("category")}
        >
          <TabButtonText active={activeTab === "category"}>
            By category
          </TabButtonText>
        </TabButton>
        <TabButton
          active={activeTab === "month"}
          onPress={() => setActiveTab("month")}
        >
          <TabButtonText active={activeTab === "month"}>By month</TabButtonText>
        </TabButton>
      </TabRow>

      {/* CONTENT */}
      <ScrollView style={{ flex: 1 }}>{renderContent()}</ScrollView>

      {/* ADD TASK BUTTON */}
      <AddTaskButton onPress={() => alert("Add new task here!")}>
        <AddTaskText>Add task</AddTaskText>
        <PlusButton>
          <PlusIcon>+</PlusIcon>
        </PlusButton>
      </AddTaskButton>
    </Container>
  );
};

export default Checklist;
