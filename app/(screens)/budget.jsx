import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { createUserRequest } from "../../requestMethods";

/* ---------- STYLED COMPONENTS ---------- */
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fdf8f2;
`;

const Header = styled.View`
  padding: 20px;
  background-color: #fdf8f2;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const BackArrow = styled.Text`
  font-size: 20px;
  margin-right: 16px;
  color: #000;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #000;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #666;
`;

const ChartContainer = styled.View`
  margin: 20px;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const DonutCircle = styled.View`
  width: 220px;
  height: 220px;
  border-radius: 110px;
  background-color: #fff7f2;
  position: relative;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const DonutRing = styled.View`
  width: 220px;
  height: 220px;
  border-radius: 110px;
  border-width: 24px;
  border-color: #ec4899;
  position: absolute;
`;

const DonutInnerText = styled.Text`
  font-size: 22px;
  font-weight: 700;
  text-align: center;
`;

const DonutInnerSubText = styled.Text`
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const CustomizeButton = styled.TouchableOpacity`
  background-color: #ec4899;
  padding: 14px 24px;
  border-radius: 24px;
`;

const CustomizeButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const InfoContainer = styled.View`
  padding: 0 20px 20px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SectionSubtitle = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const LinkText = styled.Text`
  font-size: 14px;
  color: #0066cc;
  margin-top: 6px;
`;

/* ---------- MAIN MODAL STYLES ---------- */
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 16px;
  padding: 60px 20px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const HeaderSection = styled.View`
  flex: 1;
  align-items: ${(props) => props.align || "center"};
`;

const HeaderText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin-bottom: 8px;
`;

const ModalDescription = styled.Text`
  font-size: 14px;
  color: #666;
  line-height: 20px;
  margin-bottom: 16px;
`;

const HighlightLink = styled.Text`
  color: #0066cc;
  text-decoration-line: underline;
`;

const BoldText = styled.Text`
  font-weight: 700;
`;

const BudgetRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const BudgetLeft = styled.View``;

const BudgetAmount = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #000;
`;

const BudgetNote = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 2px;
`;

const GoalButton = styled.TouchableOpacity``;

const GoalButtonText = styled.Text`
  font-size: 14px;
  color: #0066cc;
  margin-top: 6px;
  text-decoration-line: underline;
`;

const VendorItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const VendorTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const VendorRange = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 2px;
`;

const Arrow = styled.Text`
  font-size: 20px;
  color: #000;
`;

const vendorData = [
  { title: "Venue", range: "$1,010 - $6,500" },
  { title: "Catering", range: "$1,150 - $3,450" },
  { title: "Photographer", range: "$1,230 - $3,000" },
  { title: "Videographer", range: "$602 - $2,530" },
  { title: "Wedding dress", range: "$793 - $2,302" },
  { title: "Tuxedo or suit", range: "$71 - $223" },
  { title: "Beauty services", range: "$101 - $201 per person" },
];

/* ---------- CENTERED MODAL STYLES FOR GOAL BUDGET ---------- */
const CenterModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const CenterModalContainer = styled.View`
  width: 80%;
  background-color: #fff;
  border-radius: 16px;
  padding: 30px 20px;
`;

/* ---------- MAIN COMPONENT ---------- */
const Budget = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalBudget, setGoalBudget] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(20430);
  const user = useSelector((state) => state.user.currentUser);
  const userId = user?._id;

  // Fetch the budget from the backend when the component mounts (or when userId changes)
  useEffect(() => {
    const fetchBudget = async () => {
      if (!userId) return;
      try {
        const res = await createUserRequest().get(`/users/budget/${userId}`);
        // Update the budget or fallback to default if not set
        setSelectedBudget(res.data.budget || 20430);
      } catch (error) {
        console.error("Error fetching budget", error);
      }
    };
    fetchBudget();
  }, [userId]);

  // When user saves the goal budget
  const handleSaveGoalBudget = async () => {
    const numericBudget = parseInt(goalBudget, 10);
    if (!isNaN(numericBudget)) {
      try {
        const res = await createUserRequest().put(`/users/budget/${userId}`, {
          budget: numericBudget,
        });
        setSelectedBudget(res.data.budget);
      } catch (error) {
        console.error("Error updating budget", error);
      }
    }
    setGoalModalVisible(false);
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf8f2" />

      {/* HEADER WITH BACK ARROW */}
      <Header>
        <HeaderRow>
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrow>←</BackArrow>
          </TouchableOpacity>
          <Title>Budget Advisor</Title>
        </HeaderRow>
        <Subtitle>
          Get cost estimates and a breakdown of what couples in your area
          typically spend.
        </Subtitle>
      </Header>

      <ScrollView>
        {/* Donut Chart Section */}
        <ChartContainer>
          <DonutCircle>
            <DonutRing />
            <DonutInnerText>${selectedBudget}</DonutInnerText>
            <DonutInnerSubText>
              Total average cost{"\n"}Iowa City, IA
            </DonutInnerSubText>
          </DonutCircle>

          <CustomizeButton onPress={() => setModalVisible(true)}>
            <CustomizeButtonText>Customize</CustomizeButtonText>
          </CustomizeButton>
        </ChartContainer>

        {/* Extra Info */}
        <InfoContainer>
          <SectionTitle>Vendors in Iowa City, IA</SectionTitle>
          <SectionSubtitle>
            Most couples spend: $8,490 - $23,480
          </SectionSubtitle>
          {/* … Additional UI … */}
        </InfoContainer>
      </ScrollView>

      {/* ---------- MAIN "Customize" MODAL ---------- */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <HeaderSection align="flex-start">
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <HeaderText>Cancel</HeaderText>
                </TouchableOpacity>
              </HeaderSection>
              <HeaderSection>
                <HeaderText>Customize</HeaderText>
              </HeaderSection>
              <HeaderSection align="flex-end">
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <HeaderText>Save</HeaderText>
                </TouchableOpacity>
              </HeaderSection>
            </ModalHeader>

            <ModalTitle>Select vendors for your budget</ModalTitle>
            <ModalDescription>
              Start your budget with the latest spending trends in{" "}
              <HighlightLink>Iowa City, IA</HighlightLink> where the average is{" "}
              <BoldText>$20,430</BoldText>
            </ModalDescription>

            <BudgetRow>
              <BudgetLeft>
                <BudgetAmount>${selectedBudget}</BudgetAmount>
                <BudgetNote>Based on selections</BudgetNote>
              </BudgetLeft>
              <GoalButton
                onPress={() => {
                  setModalVisible(false);
                  setGoalModalVisible(true);
                }}
              >
                <GoalButtonText>Set your goal budget</GoalButtonText>
              </GoalButton>
            </BudgetRow>

            <ScrollView style={{ flex: 1 }}>
              {vendorData.map((item, index) => (
                <VendorItem key={index}>
                  <View>
                    <VendorTitle>{item.title}</VendorTitle>
                    <VendorRange>{item.range}</VendorRange>
                  </View>
                  <Arrow>›</Arrow>
                </VendorItem>
              ))}
            </ScrollView>
          </ModalContainer>
        </ModalOverlay>
      </Modal>

      {/* ---------- CENTERED "Set Goal Budget" MODAL ---------- */}
      <Modal
        visible={goalModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <CenterModalOverlay>
          <CenterModalContainer>
            <ModalHeader>
              <HeaderSection align="flex-start">
                <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                  <HeaderText>Cancel</HeaderText>
                </TouchableOpacity>
              </HeaderSection>
              <HeaderSection align="flex-end">
                <TouchableOpacity onPress={handleSaveGoalBudget}>
                  <HeaderText>Save</HeaderText>
                </TouchableOpacity>
              </HeaderSection>
            </ModalHeader>

            <View style={{ marginTop: 20 }}>
              <Text style={{ marginBottom: 8, fontSize: 16 }}>
                Enter your total budget:
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 16,
                }}
                placeholder="e.g. 25000"
                keyboardType="numeric"
                value={goalBudget}
                onChangeText={setGoalBudget}
              />
            </View>
          </CenterModalContainer>
        </CenterModalOverlay>
      </Modal>
    </Container>
  );
};

export default Budget;
