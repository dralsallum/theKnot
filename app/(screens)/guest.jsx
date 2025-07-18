import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Linking,
  FlatList,
  Alert,
  Modal,
  ScrollView,
  View,
  StatusBar,
  ActivityIndicator, // <-- Added for loading spinner
} from "react-native";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";

// --- Import Redux hooks/selectors ---
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/authSlice"; // <-- Adjust path as needed

import { createUserRequest } from "../../requestMethods"; // adjust path as needed

// ---------------------- COMMON STYLED COMPONENTS ----------------------

// Container: Represents the safe area with the designated background.
const Container = styled.View`
  flex: 1;
  background-color: #fff6ec;
  padding-top: ${Constants.statusBarHeight}px;
  direction: rtl;
`;

const Header = styled.View`
  background-color: #fff6ec;
  padding: 24px 20px 16px;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #000;
  margin-left: 16px;
`;

// TabBar container.
const TabBar = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #ececec;
  background-color: #fff6ec;
`;

// Tab button.
const TabButton = styled.TouchableOpacity`
  flex: 1;
  padding: 16px 0;
  align-items: center;
  border-bottom-width: ${(props) => (props.active ? "2px" : "0px")};
  border-bottom-color: ${(props) => (props.active ? "#000" : "transparent")};
`;

// Tab text.
const TabText = styled.Text`
  font-size: 16px;
  color: ${(props) => (props.active ? "#000" : "#666")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  text-align: left;
`;

// ContentWrapper: Main content area.
const ContentWrapper = styled.View`
  flex: 1;
  background-color: #fff;
`;

// ---------------------- GUEST TAB STYLED COMPONENTS ----------------------
const GuestContainer = styled.View`
  padding: 20px;
  flex: 1;
`;

const SubHeader = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
  color: #000;
  text-align: left;
`;

const Card = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const IconWrapper = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background-color: #ffe8d2;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const CardTextContainer = styled.View`
  flex: 1;
`;

const CardTitle = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #000;
  margin-bottom: 6px;
  text-align: left;
`;

const CardSubtitle = styled.Text`
  font-size: 15px;
  color: #666;
  line-height: 20px;
  text-align: left;
`;

const CardArrow = styled(Feather)`
  color: #000;
  margin-left: 8px;
`;

const FooterLink = styled.Text`
  font-size: 15px;
  color: #555;
  margin-top: 30px;
  text-align: center;
`;

// Guest List specific components
const GuestItemContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 3px;
  elevation: 2;
`;

const GuestItemText = styled.Text`
  color: #000;
  font-size: 17px;
  font-weight: 600;
  text-align: left;
`;

const GuestCountText = styled.Text`
  font-size: 17px;
  margin-vertical: 20px;
  color: #333;
  text-align: left;
`;

// ---------------------- RSVP TAB STYLED COMPONENTS ----------------------
const RsvpContainer = styled.View`
  flex: 1;
  padding: 24px;
`;

const InstructionList = styled.View`
  margin-bottom: 24px;
`;

const InstructionItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const Bullet = styled.View`
  width: 6px;
  height: 6px;
  background-color: #000;
  border-radius: 3px;
  margin-right: 12px;
  margin-top: 8px;
`;

const InstructionText = styled.Text`
  font-size: 16px;
  color: #333;
  line-height: 22px;
  flex: 1;
  text-align: left;
`;

const SetupButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-bottom: 32px;
  shadow-color: #000;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.15;
  shadow-radius: 5px;
  elevation: 3;
`;

const SetupButtonText = styled.Text`
  font-size: 17px;
  color: #fff;
  font-weight: bold;
  text-align: left;
`;

const SectionHeader = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #000;
  text-align: left;
`;

const OuterCircle = styled.View`
  width: 130px;
  height: 130px;
  border-radius: 65px;
  background-color: #ff9a9e;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  align-self: center;
`;

const InnerCircle = styled.View`
  width: 94px;
  height: 94px;
  border-radius: 47px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;

const GaugeText = styled.Text`
  font-size: 15px;
  color: #000;
  text-align: center;
`;

const LegendContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-horizontal: 12px;
  margin-top: 8px;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 6px;
`;

const ColorBox = styled.View`
  width: 14px;
  height: 14px;
  background-color: ${(props) => props.color || "#ccc"};
  margin-right: 8px;
  border-radius: 7px;
`;

const LegendLabel = styled.Text`
  font-size: 12px;
  color: #000;
  margin-right: 6px;
  text-align: left;
`;

const LegendCount = styled.Text`
  font-size: 15px;
  color: #666;
  font-weight: 500;
  text-align: left;
`;

// ---------------------- MESSAGES TAB STYLED COMPONENTS ----------------------
const MessagesContainer = styled.View`
  padding: 24px;
`;

const MessagesHeader = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
  text-align: left;
`;

const MessagesSubheader = styled.Text`
  font-size: 15px;
  color: #666;
  margin-bottom: 32px;
  line-height: 20px;
  text-align: left;
`;

const TemplateHeader = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #000;
  margin-bottom: 16px;
  text-align: left;
`;

const TemplateGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const TemplateCard = styled.TouchableOpacity`
  width: 48%;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px 16px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const TemplateCardText = styled.Text`
  font-size: 15px;
  color: #000;
  text-align: center;
`;

const SentMessagesHeader = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #000;
  margin-bottom: 16px;
  text-align: left;
`;

const PlaceholderContainer = styled.View`
  align-items: center;
  margin-top: 24px;
  padding: 16px;
`;

const PlaceholderImage = styled.View`
  width: 70px;
  height: 70px;
  background-color: #f5f5f5;
  margin-bottom: 20px;
  border-radius: 10px;
`;

const PlaceholderMessage = styled.Text`
  font-size: 15px;
  color: #666;
  text-align: center;
  line-height: 22px;
  max-width: 280px;
`;

// ---------------------- MODAL & FORM STYLED COMPONENTS ----------------------
const ModalContainer = styled.View`
  flex: 1;
  background-color: #fff;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 60px 20px 10px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #ececec;
`;

const ModalHeaderButton = styled.Text`
  font-size: 17px;
  color: ${(props) => (props.disabled ? "#ccc" : props.color || "#000")};
  padding: 4px;
  text-align: left;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const FormSection = styled.View`
  padding: 24px 20px;
`;

const SectionTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #000;
  text-align: left;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const StyledInput = styled.TextInput`
  border-width: 1px;
  border-color: #e0e0e0;
  border-radius: 10px;
  padding: 14px;
  font-size: 16px;
  background-color: #fafafa;
`;

// Checkbox container
const CheckboxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 16px;
`;

const CheckboxLabel = styled.Text`
  font-size: 17px;
  margin-left: 12px;
  color: #333;
  text-align: left;
`;

const AddMoreButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  padding: 4px;
`;

const AddMoreButtonText = styled.Text`
  color: #0084ff;
  font-size: 16px;
  margin-left: 10px;
  text-align: left;
`;

const ContactInfoSection = styled.View`
  border-top-width: 8px;
  border-top-color: #f5f5f5;
  padding: 24px 20px;
`;

const NotesSection = styled.View`
  border-top-width: 8px;
  border-top-color: #f5f5f5;
  padding: 24px 20px;
  margin-bottom: 24px;
`;

const NotesInput = styled.TextInput`
  border-width: 1px;
  border-color: #e0e0e0;
  border-radius: 10px;
  padding: 16px;
  font-size: 16px;
  height: 120px;
  text-align-vertical: top;
  background-color: #fafafa;
`;

// ---------------------- SEARCH & FILTER STYLED COMPONENTS (GUESTS) ----------------------
const SearchBar = styled.View`
  background-color: #f5f5f5;
  margin: 0 0 20px 0;
  padding: 14px 16px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
`;

const SearchInput = styled.TextInput`
  margin-left: 10px;
  font-size: 16px;
  color: #777;
  flex: 1;
`;

const FilterSection = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterButton = styled.TouchableOpacity`
  background-color: ${(props) => (props.active ? "#000" : "#fff")};
  padding: 10px 20px;
  border-radius: 20px;
  margin-right: 12px;
  margin-bottom: 8px;
  border-width: ${(props) => (props.active ? "0" : "1px")};
  border-color: #ddd;
`;

const FilterText = styled.Text`
  color: ${(props) => (props.active ? "#fff" : "#000")};
  font-size: 15px;
  font-weight: 500;
  text-align: left;
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 8px;
  padding: 4px;
`;

const AddButtonText = styled.Text`
  color: #0084ff;
  font-size: 15px;
  margin-left: 6px;
  text-align: left;
`;

// ---------------------- EVENTS TAB STYLED COMPONENTS ----------------------

// Container for the Events tab
const EventsContainer = styled.View`
  flex: 1;
  padding: 0;
`;

// A card-like container for each event
const EventCard = styled.View`
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #ececec;
  padding: 20px;
`;

// Top row: event title & pencil icon
const EventTopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const EventTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin-bottom: 12px;
  text-align: left;
`;

const EditIcon = styled.TouchableOpacity`
  padding: 8px;
`;

// Row for event info (guest count, date, etc.)
const EventInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const EventInfoText = styled.Text`
  color: #000;
  font-size: 15px;
  margin-left: 8px;
  text-align: left;
`;

const AddEventContainer = styled.View`
  position: absolute;
  left: 20px;
  bottom: 36px;
`;

const AddEventText = styled.Text`
  color: #0084ff;
  font-size: 17px;
  font-weight: 500;
  text-align: left;
`;

// Button in bottom right
const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 36px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #0084ff;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.25;
  shadow-radius: 5px;
  elevation: 5;
`;
const Footer = styled.View`
  background-color: #fff;
  padding: 25px;
  border-top-width: 1px;
  border-top-color: #eee;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
`;

// ---------------------- MAIN COMPONENT ----------------------
const Guest = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("الضيوف");
  const [hasGuests, setHasGuests] = useState(false);
  const [activeFilter, setActiveFilter] = useState("جميع الفعاليات");
  const [guestsList, setGuestsList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isWeddingDay, setIsWeddingDay] = useState(true);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [notes, setNotes] = useState("");

  // --- Loading state ---
  const [loading, setLoading] = useState(false);

  // --- Redux: get the currently logged in user from store ---
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?._id; // <-- This replaces the hard-coded user ID

  // Fetch guests from backend when the "Guests" tab is active.
  const fetchGuests = async () => {
    if (!userId) {
      // If user is not logged in or userId not available, skip fetching
      return;
    }
    try {
      setLoading(true);
      const reqInstance = createUserRequest();
      const res = await reqInstance.get(`/guests/${userId}`);
      setGuestsList(res.data);
      setHasGuests(res.data.length > 0);
    } catch (err) {
      console.error("Error fetching guests:", err);
      Alert.alert("خطأ", "لا يمكن جلب قائمة الضيوف");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "الضيوف") {
      fetchGuests();
    }
  }, [activeTab]);

  // Hard-coded link
  const handleLearnMore = () => {
    Linking.openURL("https://example.com/spreadsheet-template");
  };

  // Options for the guest card actions.
  const guestCards = [
    {
      title: "إضافة من جهات الاتصال",
      subtitle: "اختر الضيوف مباشرة من هاتفك.",
      icon: "user-plus",
      onPress: () => console.log("Add from contacts pressed"),
    },
    {
      title: "إضافة واحد تلو الآخر",
      subtitle: "اكتب أسماء الضيوف ومعلومات الاتصال.",
      icon: "edit-3",
      onPress: () => setIsModalVisible(true),
    },
    {
      title: "إرسال نموذج للضيوف",
      subtitle: "شارك نموذج جمع العناوين الخاص بك.",
      icon: "file-text",
      onPress: () => console.log("Send guests a form pressed"),
    },
  ];

  // Save guest to backend
  const handleSaveGuest = async () => {
    if (!firstName.trim() && !lastName.trim()) {
      Alert.alert("التحقق", "يرجى إدخال اسم الضيف.");
      return;
    }
    if (!userId) {
      Alert.alert("غير مسجل الدخول", "يرجى تسجيل الدخول قبل إضافة الضيوف.");
      return;
    }

    try {
      setLoading(true);
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

      const newGuest = {
        userId: userId,
        name: fullName,
        phone: phone.trim(),
        email: email.trim(),
        mailingAddress: mailingAddress.trim(),
        notes: notes.trim(),
        // If user checked the box, eventName = "Wedding Day"
        eventName: isWeddingDay ? "يوم الزفاف" : "",
      };

      const reqInstance = createUserRequest();
      await reqInstance.post("/guests", newGuest);

      // Refresh list after saving.
      fetchGuests();

      // Reset fields and close modal.
      resetForm();
      setIsModalVisible(false);
    } catch (err) {
      console.error("Error saving guest:", err);
      Alert.alert("خطأ", "لا يمكن حفظ الضيف");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setIsWeddingDay(true);
    setPhone("");
    setEmail("");
    setMailingAddress("");
    setNotes("");
  };

  const cancelModal = () => {
    resetForm();
    setIsModalVisible(false);
  };

  // Simple checkbox component used in the modal form
  const Checkbox = ({ checked, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Feather
        name={checked ? "check-square" : "square"}
        size={24}
        color={checked ? "#000" : "#ccc"}
      />
    </TouchableOpacity>
  );

  // Count how many guests are assigned to "Wedding Day"
  const weddingDayCount = guestsList.filter(
    (guest) => guest.eventName.toLowerCase() === "يوم الزفاف"
  ).length;

  // Render tab-specific content.
  const renderContent = () => {
    if (loading) {
      // Show a spinner while loading data or saving
      return (
        <GuestContainer
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#000" />
        </GuestContainer>
      );
    }

    if (activeTab === "الضيوف") {
      // If no guests, show the initial "add guests" screen.
      if (!hasGuests) {
        return (
          <GuestContainer>
            <SubHeader>لنضيف الضيوف! اختر الطريقة:</SubHeader>
            {guestCards.map((card, index) => (
              <Card key={index} onPress={card.onPress}>
                <IconWrapper>
                  <Feather name={card.icon} size={24} color="#000" />
                </IconWrapper>
                <CardTextContainer>
                  <CardTitle>{card.title}</CardTitle>
                  <CardSubtitle>{card.subtitle}</CardSubtitle>
                </CardTextContainer>
                <CardArrow name="chevron-left" size={24} />
              </Card>
            ))}
            <TouchableOpacity onPress={handleLearnMore}>
              <FooterLink>تريد قالب جدول بيانات؟ تعلم المزيد</FooterLink>
            </TouchableOpacity>
          </GuestContainer>
        );
      } else {
        // If guests exist, show a search bar, filter section, guest list.
        return (
          <GuestContainer>
            <SearchBar>
              <Feather name="search" size={20} color="#777" />
              <SearchInput placeholder="البحث عن الضيوف" />
            </SearchBar>

            <FilterSection>
              <FilterButton
                active={activeFilter === "جميع الفعاليات"}
                onPress={() => setActiveFilter("جميع الفعاليات")}
              >
                <FilterText active={activeFilter === "جميع الفعاليات"}>
                  جميع الفعاليات
                </FilterText>
              </FilterButton>

              <FilterButton
                active={activeFilter === "يوم الزفاف"}
                onPress={() => setActiveFilter("يوم الزفاف")}
              >
                <FilterText active={activeFilter === "يوم الزفاف"}>
                  يوم الزفاف
                </FilterText>
              </FilterButton>

              <AddButton onPress={() => console.log("Add new event")}>
                <Feather name="plus-circle" size={20} color="#0084ff" />
                <AddButtonText>إضافة فعالية جديدة</AddButtonText>
              </AddButton>
            </FilterSection>

            <GuestCountText>
              {guestsList.length} {guestsList.length === 1 ? "ضيف" : "ضيوف"}
            </GuestCountText>

            <FlatList
              data={guestsList}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <GuestItemContainer>
                  <GuestItemText>{item.name}</GuestItemText>
                  <CardSubtitle>{item.eventName}</CardSubtitle>
                </GuestItemContainer>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </GuestContainer>
        );
      }
    } else if (activeTab === "الفعاليات") {
      // Updated "Events" tab to match your screenshot
      return (
        <EventsContainer>
          {/* Single event card */}
          <EventCard>
            <EventTopRow>
              <EventTitle>يوم الزفاف</EventTitle>
              <EditIcon onPress={() => console.log("Edit event pressed")}>
                <Feather name="edit-2" size={20} color="#000" />
              </EditIcon>
            </EventTopRow>
            <EventInfoRow>
              <Feather
                name="user"
                size={16}
                color="#000"
                style={{ marginLeft: 4 }}
              />
              <EventInfoText>
                {weddingDayCount} {weddingDayCount === 1 ? "ضيف" : "ضيوف"}
              </EventInfoText>

              {/* Add spacing between icons */}
              <View style={{ width: 20 }} />

              <Feather
                name="calendar"
                size={16}
                color="#000"
                style={{ marginLeft: 4 }}
              />
              <EventInfoText>الجمعة، 7 أبريل</EventInfoText>
            </EventInfoRow>
          </EventCard>

          {/* "Add an event" link near the bottom */}
          <AddEventContainer>
            <TouchableOpacity
              onPress={() => console.log("Add an event pressed")}
            >
              <AddEventText>إضافة فعالية</AddEventText>
            </TouchableOpacity>
          </AddEventContainer>

          {/* Plus button in bottom-right corner */}
          <FloatingButton
            onPress={() => console.log("Floating add event pressed")}
          >
            <Feather name="plus" size={24} color="#fff" />
          </FloatingButton>
        </EventsContainer>
      );
    } else if (activeTab === "الردود") {
      return (
        <RsvpContainer>
          <InstructionList>
            <InstructionItem>
              <Bullet />
              <InstructionText>تخصيص صفحة الردود الخاصة بك.</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <Bullet />
              <InstructionText>شارك رابط موقعك مع الضيوف.</InstructionText>
            </InstructionItem>
            <InstructionItem>
              <Bullet />
              <InstructionText>تتبع ردود الضيوف بسهولة!</InstructionText>
            </InstructionItem>
          </InstructionList>
          <SetupButton onPress={() => console.log("Set up RSVPs pressed")}>
            <SetupButtonText>إعداد الردود</SetupButtonText>
          </SetupButton>
          <SectionHeader>يوم الزفاف</SectionHeader>
          <OuterCircle>
            <InnerCircle>
              <GaugeText>0 / 1 رد</GaugeText>
            </InnerCircle>
          </OuterCircle>
          <LegendContainer>
            <LegendItem>
              <ColorBox color="green" />
              <LegendLabel>سيحضر</LegendLabel>
              <LegendCount>0</LegendCount>
            </LegendItem>
            <LegendItem>
              <ColorBox color="red" />
              <LegendLabel>رفض</LegendLabel>
              <LegendCount>0</LegendCount>
            </LegendItem>
            <LegendItem>
              <ColorBox color="#ccc" />
              <LegendLabel>لا يوجد رد</LegendLabel>
              <LegendCount>1</LegendCount>
            </LegendItem>
          </LegendContainer>
        </RsvpContainer>
      );
    } else if (activeTab === "الرسائل") {
      return (
        <MessagesContainer>
          <MessagesHeader>التواصل مع الضيوف</MessagesHeader>
          <MessagesSubheader>
            شارك التفاصيل بسهولة وأرسل تذكيرات لضيوفك.
          </MessagesSubheader>
          <TemplateHeader>اختر قالباً:</TemplateHeader>
          <TemplateGrid>
            <TemplateCard onPress={() => {}}>
              <TemplateCardText>شارك موقعك</TemplateCardText>
            </TemplateCard>
            <TemplateCard onPress={() => {}}>
              <TemplateCardText>جمع العناوين</TemplateCardText>
            </TemplateCard>
            <TemplateCard onPress={() => {}}>
              <TemplateCardText>رسالة مخصصة</TemplateCardText>
            </TemplateCard>
            <TemplateCard onPress={() => {}}>
              <TemplateCardText>تذكير الضيوف بالرد</TemplateCardText>
            </TemplateCard>
          </TemplateGrid>
          <SentMessagesHeader>الرسائل المرسلة:</SentMessagesHeader>
          <PlaceholderContainer>
            <PlaceholderImage />
            <PlaceholderMessage>
              لم ترسل أي رسائل بعد، ولكن ستراها هنا عندما تفعل ذلك.
            </PlaceholderMessage>
          </PlaceholderContainer>
        </MessagesContainer>
      );
    }
  };

  return (
    <Container>
      {/* Set status bar appearance */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff6ec" />

      {/* Header */}
      <Header>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-right" size={24} color="#000" />
        </TouchableOpacity>
        <Title>الضيوف والردود</Title>
      </Header>

      {/* Tab Bar */}
      <TabBar>
        {["الضيوف", "الفعاليات", "الردود", "الرسائل"].map((tab) => (
          <TabButton
            key={tab}
            active={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          >
            <TabText active={activeTab === tab}>{tab}</TabText>
          </TabButton>
        ))}
      </TabBar>

      {/* Main content area */}
      <ContentWrapper>{renderContent()}</ContentWrapper>

      {/* Add Guest Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={cancelModal}
      >
        <ModalContainer>
          <ModalHeader>
            <TouchableOpacity onPress={cancelModal}>
              <ModalHeaderButton>إلغاء</ModalHeaderButton>
            </TouchableOpacity>
            <ModalTitle>إضافة ضيف</ModalTitle>
            <TouchableOpacity
              onPress={handleSaveGuest}
              disabled={!firstName.trim() && !lastName.trim()}
            >
              <ModalHeaderButton
                color="#0084ff"
                disabled={!firstName.trim() && !lastName.trim()}
              >
                حفظ
              </ModalHeaderButton>
            </TouchableOpacity>
          </ModalHeader>
          <ScrollView>
            {/* Guest Names Section */}
            <FormSection>
              <SectionTitle>أسماء الضيوف</SectionTitle>
              <InputRow>
                <Feather
                  name="user"
                  size={24}
                  color="#000"
                  style={{ marginLeft: 12 }}
                />
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <StyledInput
                      placeholder="الاسم الأول"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <StyledInput
                      placeholder="اسم العائلة"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>
              </InputRow>
              <CheckboxContainer>
                <Checkbox
                  checked={isWeddingDay}
                  onPress={() => setIsWeddingDay(!isWeddingDay)}
                />
                <CheckboxLabel>يوم الزفاف</CheckboxLabel>
              </CheckboxContainer>
              <AddMoreButton>
                <Feather name="plus-circle" size={24} color="#0084ff" />
                <AddMoreButtonText>إضافة ضيف آخر</AddMoreButtonText>
              </AddMoreButton>
            </FormSection>

            {/* Contact Info Section */}
            <ContactInfoSection>
              <SectionTitle>معلومات الاتصال</SectionTitle>
              <StyledInput
                placeholder="رقم الهاتف"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={{ marginBottom: 16 }}
              />
              <StyledInput
                placeholder="عنوان البريد الإلكتروني"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={{ marginBottom: 16 }}
              />
              <StyledInput
                placeholder="عنوان المراسلة"
                value={mailingAddress}
                onChangeText={setMailingAddress}
              />
            </ContactInfoSection>

            {/* Notes Section */}
            <NotesSection>
              <SectionTitle>ملاحظات</SectionTitle>
              <NotesInput
                placeholder="أدخل ملاحظات حول ضيوفك، مثل الحساسية الغذائية"
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </NotesSection>
          </ScrollView>
        </ModalContainer>
      </Modal>

      {/* Bottom button for adding a guest (when guests exist) */}
      {hasGuests && activeTab === "الضيوف" && (
        <Footer>
          <AddButtonText style={{ color: "#0084ff", fontSize: 18 }}>
            إضافة ضيف
          </AddButtonText>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#0084ff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="plus" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </Footer>
      )}
    </Container>
  );
};

export default Guest;
