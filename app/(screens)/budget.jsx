// Budget.jsx
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { createUserRequest } from "../../requestMethods";
import { Feather } from "@expo/vector-icons";

/* ---------- STYLED COMPONENTS ---------- */
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fdf8f2;
  direction: rtl;
`;
const Header = styled.View`
  padding: 20px;
  background-color: #fdf8f2;
`;
const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;
const BackArrowContainer = styled.TouchableOpacity`
  padding: 5px;
`;
const BackArrowImage = styled.Image`
  width: 20px;
  height: 20px;
`;
const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #000;
  text-align: left;
  flex: 1;
`;
const Subtitle = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: left;
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
  text-align: left;
`;
const InfoContainer = styled.View`
  padding: 0 20px 20px;
`;
const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: left;
`;
const SectionSubtitle = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  text-align: left;
`;
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
  text-align: left;
`;
const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #000;
  margin-bottom: 8px;
  text-align: left;
`;
const ModalDescription = styled.Text`
  font-size: 14px;
  color: #666;
  line-height: 20px;
  margin-bottom: 16px;
  text-align: left;
`;
const HighlightLink = styled.Text`
  color: #0066cc;
  text-decoration-line: underline;
  text-align: left;
`;
const BoldText = styled.Text`
  font-weight: 700;
  text-align: left;
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
  text-align: left;
`;
const BudgetNote = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 2px;
  text-align: left;
`;
const GoalButton = styled.TouchableOpacity``;
const GoalButtonText = styled.Text`
  font-size: 14px;
  color: #0066cc;
  margin-top: 6px;
  text-decoration-line: underline;
  text-align: left;
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
  text-align: left;
`;
const VendorRange = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 2px;
  text-align: left;
`;
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

const sumSubBudgets = (obj) =>
  Object.values(obj)
    .map((v) => Number(v) || 0)
    .reduce((a, b) => a + b, 0);

/* ---------- MAIN COMPONENT ---------- */
const Budget = () => {
  /* ---------- ROUTER & USER ---------- */
  const router = useRouter();
  const user = useSelector((state) => state.user.currentUser);
  const userId = user?._id;
  const [modalVisible, setModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [individualModalVisible, setIndividualModalVisible] = useState(false);
  const [inputBudget, setInputBudget] = useState("");
  const [currentField, setCurrentField] = useState("budget");
  const [currentVendorTitle, setCurrentVendorTitle] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(0);
  const [locationBudget, setLocationBudget] = useState(0);
  const [photoBudget, setPhotoBudget] = useState(0);
  const [dressBudget, setDressBudget] = useState(0);
  const [thoabBudget, setThoabBudget] = useState(0);
  const [salonBudget, setSalonBudget] = useState(0);
  const [flowersBudget, setFlowersBudget] = useState(0);
  const [cateringBudget, setCateringBudget] = useState(0);
  const [realBudget, setRealBudget] = useState(0);

  /* ---------- SETTER MAP ---------- */
  const setterMap = {
    budget: setSelectedBudget,
    locationBudget: setLocationBudget,
    photoBudget: setPhotoBudget,
    dressBudget: setDressBudget,
    thoabBudget: setThoabBudget,
    salonBudget: setSalonBudget,
    flowersBudget: setFlowersBudget,
    cateringBudget: setCateringBudget,
  };

  /* ---------- CALCULATE REAL BUDGET WHENEVER SUB-BUDGETS CHANGE ---------- */
  useEffect(() => {
    const newRealBudget = sumSubBudgets({
      locationBudget,
      photoBudget,
      dressBudget,
      thoabBudget,
      salonBudget,
      flowersBudget,
      cateringBudget,
    });
    setRealBudget(newRealBudget);
  }, [
    locationBudget,
    photoBudget,
    dressBudget,
    thoabBudget,
    salonBudget,
    flowersBudget,
    cateringBudget,
  ]);

  /* ---------- FETCH INITIAL DATA ---------- */
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await createUserRequest().get(`/users/budget/${userId}`);
        const data = res.data;

        // تأكد أن الـ backend يُرجع جميع الحقول
        setSelectedBudget(data.budget ?? 20430);
        setLocationBudget(data.locationBudget ?? 0);
        setPhotoBudget(data.photoBudget ?? 0);
        setDressBudget(data.dressBudget ?? 0);
        setThoabBudget(data.thoabBudget ?? 0);
        setSalonBudget(data.salonBudget ?? 0);
        setFlowersBudget(data.flowersBudget ?? 0);
        setCateringBudget(data.cateringBudget ?? 0);
        // Remove the setRealBudget call from here since it will be calculated by the useEffect above
      } catch (err) {
        console.error("خطأ في جلب الميزانية", err);
      }
    })();
  }, [userId]);

  /* ---------- SAVE (TOTAL OR INDIVIDUAL) ---------- */
  const handleSaveBudget = async () => {
    const numeric = parseInt(inputBudget, 10);
    if (isNaN(numeric)) return;

    const setter = setterMap[currentField];
    if (setter) setter(numeric);

    try {
      await createUserRequest().put(`/users/budget/${userId}`, {
        [currentField]: numeric,
      });
    } catch (err) {
      console.error("error with budget", err);
    }

    setGoalModalVisible(false);
    setIndividualModalVisible(false);
    setInputBudget("");
  };

  /* ---------- OPEN MODALS ---------- */
  const openGoalModal = () => {
    setCurrentField("budget");
    setCurrentVendorTitle("الإجمالية");
    setInputBudget(selectedBudget.toString());
    setModalVisible(false);
    setGoalModalVisible(true);
  };

  const openVendorModal = (field, title) => {
    // قيمة الحقل الحالي
    const currentValue = {
      locationBudget,
      photoBudget,
      dressBudget,
      thoabBudget,
      salonBudget,
      flowersBudget,
      cateringBudget,
    }[field];

    setCurrentField(field);
    setCurrentVendorTitle(title);
    setInputBudget((currentValue ?? "").toString());
    setModalVisible(false);
    setIndividualModalVisible(true);
  };

  /* ---------- VENDOR DATA ---------- */
  const vendorData = [
    { key: "locationBudget", title: "الموقع", range: `${locationBudget} ريال` },
    { key: "flowersBudget", title: "الورد", range: `${flowersBudget} ريال` },
    { key: "photoBudget", title: "المصور", range: `${photoBudget} ريال` },
    {
      key: "cateringBudget",
      title: "مصمم الفيديو",
      range: `${cateringBudget} ريال`,
    },
    { key: "dressBudget", title: "فستان الزفاف", range: `${dressBudget} ريال` },
    { key: "thoabBudget", title: "بذلة رسمية", range: `${thoabBudget} ريال` },
    {
      key: "salonBudget",
      title: "خدمات التجميل",
      range: `${salonBudget} ريال`,
    },
  ];

  /* ---------- RENDER ---------- */
  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf8f2" />
      {/* HEADER */}
      <Header>
        <HeaderRow>
          <Title>مستشار الميزانية</Title>
          <BackArrowContainer onPress={() => router.back()}>
            <BackArrowImage
              source={require("../../assets/icons/arrowLeft.png")}
            />
          </BackArrowContainer>
        </HeaderRow>
        <Subtitle>
          احصل على تقديرات التكلفة وتفصيل لما ينفقه الأزواج عادة في منطقتك.
        </Subtitle>
      </Header>

      <ScrollView>
        {/* DONUT */}
        <ChartContainer>
          <DonutCircle>
            <DonutRing />
            <DonutInnerText>{selectedBudget} ر.س</DonutInnerText>
            <DonutInnerSubText>ميزانيتك التي حددتها</DonutInnerSubText>
          </DonutCircle>
          <CustomizeButton onPress={() => setModalVisible(true)}>
            <CustomizeButtonText>تخصيص</CustomizeButtonText>
          </CustomizeButton>
        </ChartContainer>

        {/* INFO */}
        <InfoContainer>
          <SectionTitle>الموردون في آيوا سيتي، أيوا</SectionTitle>
          <SectionSubtitle>
            ينفق معظم الأزواج: 8,490 - 23,480 ر.س
          </SectionSubtitle>
        </InfoContainer>
      </ScrollView>

      {/* ---------- MAIN CUSTOMIZE MODAL ---------- */}
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
                  <HeaderText>إلغاء</HeaderText>
                </TouchableOpacity>
              </HeaderSection>
              <HeaderSection>
                <HeaderText>تخصيص</HeaderText>
              </HeaderSection>
              <HeaderSection align="flex-end">
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <HeaderText>حفظ</HeaderText>
                </TouchableOpacity>
              </HeaderSection>
            </ModalHeader>

            <ModalTitle>اختر الموردين لميزانيتك</ModalTitle>
            <ModalDescription>
              ابدأ ميزانيتك بأحدث اتجاهات الإنفاق في{" "}
              <HighlightLink>آيوا سيتي، أيوا</HighlightLink> حيث المتوسط هو{" "}
              <BoldText>{selectedBudget} ر.س</BoldText>
            </ModalDescription>

            <BudgetRow>
              <BudgetLeft>
                <BudgetAmount>{realBudget} ر.س</BudgetAmount>
                <BudgetNote>بناءً على الاختيارات</BudgetNote>
              </BudgetLeft>
              <GoalButton onPress={openGoalModal}>
                <GoalButtonText>حدد ميزانيتك المستهدفة</GoalButtonText>
              </GoalButton>
            </BudgetRow>

            <ScrollView style={{ flex: 1 }}>
              {vendorData.map((item) => (
                <VendorItem
                  key={item.key}
                  onPress={() => openVendorModal(item.key, item.title)}
                >
                  <View>
                    <VendorTitle>{item.title}</VendorTitle>
                    <VendorRange>{item.range}</VendorRange>
                  </View>
                  <Feather name="chevron-left" size={22} color="black" />
                </VendorItem>
              ))}
            </ScrollView>
          </ModalContainer>
        </ModalOverlay>
      </Modal>

      {/* ---------- TOTAL BUDGET MODAL ---------- */}
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
                  <HeaderText>إلغاء</HeaderText>
                </TouchableOpacity>
              </HeaderSection>
              <HeaderSection align="flex-end">
                <TouchableOpacity onPress={handleSaveBudget}>
                  <HeaderText>حفظ</HeaderText>
                </TouchableOpacity>
              </HeaderSection>
            </ModalHeader>

            <View style={{ marginTop: 20 }}>
              <Text style={{ marginBottom: 8, fontSize: 16 }}>
                أدخل ميزانيتك الإجمالية:
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 16,
                }}
                placeholder="مثلاً 25000"
                keyboardType="numeric"
                value={inputBudget}
                onChangeText={setInputBudget}
              />
            </View>
          </CenterModalContainer>
        </CenterModalOverlay>
      </Modal>

      {/* ---------- INDIVIDUAL VENDOR MODAL ---------- */}
      <Modal
        visible={individualModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIndividualModalVisible(false)}
      >
        <CenterModalOverlay>
          <CenterModalContainer>
            <ModalHeader>
              <HeaderSection align="flex-start">
                <TouchableOpacity
                  onPress={() => setIndividualModalVisible(false)}
                >
                  <HeaderText>إلغاء</HeaderText>
                </TouchableOpacity>
              </HeaderSection>
              <HeaderSection align="flex-end">
                <TouchableOpacity onPress={handleSaveBudget}>
                  <HeaderText>حفظ</HeaderText>
                </TouchableOpacity>
              </HeaderSection>
            </ModalHeader>

            <View style={{ marginTop: 20 }}>
              <Text style={{ marginBottom: 8, fontSize: 16 }}>
                أدخل ميزانيتك لـ{currentVendorTitle}:
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 16,
                }}
                placeholder="مثلاً 2500"
                keyboardType="numeric"
                value={inputBudget}
                onChangeText={setInputBudget}
              />
            </View>
          </CenterModalContainer>
        </CenterModalOverlay>
      </Modal>
    </Container>
  );
};

export default Budget;
