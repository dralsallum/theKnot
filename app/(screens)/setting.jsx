import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Text,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/native";
import * as Linking from "expo-linking";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import axios from "axios";

import {
  userSelector,
  updateUserProfile,
  deleteUser,
  signOut,
} from "../redux/authSlice";

// Define status bar height similar to the Category page
const STATUSBAR_HEIGHT =
  Platform.OS === "ios" ? 44 : StatusBar.currentHeight + 15;

// ---------- STYLED COMPONENTS ----------

// Main container with a white background for a clean look
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

// Header bar similar to your Category page with a light background
const HeaderBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-top: ${STATUSBAR_HEIGHT}px;
  padding-bottom: 16px;
  background-color: #fdf8f2;
`;

// Back button styled as a simple touchable area
const BackButton = styled.TouchableOpacity`
  padding: 10px;
`;

// Centered header title in bold dark text
const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000;
`;

// A placeholder view to balance the header layout
const HeaderPlaceholder = styled.View`
  width: 40px;
`;

// Profile card styling with subtle shadow and rounded corners
const ProfileContainer = styled.View`
  background-color: white;
  margin: 15px;
  border-radius: 10px;
  padding: 20px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

// Profile image styled as a circle
const ProfileImage = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  margin-bottom: 15px;
`;

// Bold profile text (username)
const ProfileText = styled.Text`
  font-size: 22px;
  margin-bottom: 5px;
  font-weight: bold;
  color: #000;
`;

// Subtext for email and additional info
const SubText = styled.Text`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 5px;
`;

// Section header with clear margins for each section grouping
const SectionHeader = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 15px;
  padding-horizontal: 10px;
`;

// Option container styled as a card with rounded corners and subtle shadow
const OptionContainer = styled.View`
  background-color: white;
  padding: 15px;
  margin: 0 15px 10px;
  border-radius: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 2;
`;

// Row layout for options
const OptionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

// Option text styling
const OptionText = styled.Text`
  font-size: 16px;
  color: #333;
  flex: 1;
`;

// Input field for editing options
const InputField = styled.TextInput`
  border-width: ${(props) => (props.isEditing ? "1px" : "0px")};
  border-color: #ddd;
  padding: ${(props) => (props.isEditing ? "10px" : "0px")};
  margin-top: 5px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 5px;
  font-size: 16px;
  text-align: right;
`;

// Button styled with your accent color for primary actions
const Button = styled.TouchableOpacity`
  background-color: #e066a6;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  margin: 10px;
`;

// Text styling for buttons
const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

// Danger button (e.g., delete) using a red background
const DangerButton = styled.TouchableOpacity`
  background-color: #ff3b30;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin: 20px 15px;
`;

// Modal container styling for overlay
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

// Modal content styled as a card
const ModalContent = styled.View`
  width: 80%;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

// Grouping for modal buttons
const ButtonGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

// Notification buttons reusing the primary Button style with slight adjustments
const NotificationButton = styled(Button)`
  flex: 1;
  margin-horizontal: 5px;
`;

const SettingsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(userSelector);
  const profileImage = require("../../assets/images/profile.png");
  const [country, setCountry] = useState(currentUser?.country || "");
  const [city, setCity] = useState(currentUser?.city || "");
  const [language, setLanguage] = useState(currentUser?.language || "");
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);

  const handleToggleNotifications = () => {
    setNotificationModalVisible(true);
  };

  const handleOptInNotifications = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
          android: {},
        });
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "الإشعارات معطلة",
          "لتلقي الإشعارات، يرجى تفعيل الأذونات في الإعدادات.",
          [
            {
              text: "إلغاء",
              style: "cancel",
            },
            {
              text: "فتح الإعدادات",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const expoPushToken = tokenData.data;
      if (currentUser && currentUser._id && currentUser.accessToken) {
        const userId = currentUser._id;
        const accessToken = currentUser.accessToken;
        await axios.put(
          `https://quizeng-022517ad949b.herokuapp.com/api/users/profile/${userId}`,
          { expoPushToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        dispatch(updateUserProfile({ userId, updates: { expoPushToken } }));
        Alert.alert("تم", "تم تفعيل الإشعارات بنجاح.");
      } else {
        console.error("Current user is not defined.");
      }
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء تفعيل الإشعارات. يرجى المحاولة لاحقًا."
      );
    } finally {
      setNotificationModalVisible(false);
    }
  };

  const handleOptOutNotifications = () => {
    setNotificationModalVisible(false);
  };

  const handleUpdateCountry = () => {
    if (currentUser && currentUser._id) {
      dispatch(
        updateUserProfile({ userId: currentUser._id, updates: { country } })
      );
      setIsEditingCountry(false);
    }
  };

  const handleUpdateCity = () => {
    if (currentUser && currentUser._id) {
      dispatch(
        updateUserProfile({ userId: currentUser._id, updates: { city } })
      );
      setIsEditingCity(false);
    }
  };

  const handleEditCountry = () => setIsEditingCountry(true);
  const handleEditCity = () => setIsEditingCity(true);
  const handleEditLanguage = () => setIsEditingLanguage(true);

  const handleUpdateLanguage = () => {
    if (currentUser && currentUser._id) {
      dispatch(
        updateUserProfile({ userId: currentUser._id, updates: { language } })
      );
      setIsEditingLanguage(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: () => {
            if (currentUser && currentUser._id) {
              dispatch(deleteUser({ userId: currentUser._id })).then(() => {
                dispatch(signOut());
                router.push("/sign-in");
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSignOut = () => {
    dispatch(signOut());
    router.push("/sign-in");
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <HeaderBar>
        <BackButton onPress={handleBackPress}>
          <Feather name="arrow-left" size={24} color="#000" />
        </BackButton>
        <HeaderTitle>الإعدادات</HeaderTitle>
        <HeaderPlaceholder />
      </HeaderBar>

      <ScrollView>
        <ProfileContainer>
          <ProfileImage source={profileImage} />
          <ProfileText>{currentUser?.username}</ProfileText>
          <SubText>{currentUser?.email}</SubText>
          <SubText>يمكنك تغيير اسمك أو كلمة المرور على موقعنا.</SubText>
        </ProfileContainer>

        <SectionHeader>حسابي</SectionHeader>

        {/* Country Option */}
        <OptionContainer>
          <OptionRow>
            <OptionText>البلد</OptionText>
            {!isEditingCountry && (
              <TouchableOpacity onPress={handleEditCountry}>
                <Feather name="edit-2" size={20} color="#e066a6" />
              </TouchableOpacity>
            )}
          </OptionRow>
          {isEditingCountry ? (
            <>
              <InputField
                placeholder="أدخل البلد"
                value={country}
                onChangeText={setCountry}
                isEditing={isEditingCountry}
              />
              <Button onPress={handleUpdateCountry}>
                <ButtonText>تحديث البلد</ButtonText>
              </Button>
            </>
          ) : (
            <OptionText style={{ marginTop: 5 }}>{country || "--"}</OptionText>
          )}
        </OptionContainer>

        {/* City Option */}
        <OptionContainer>
          <OptionRow>
            <OptionText>المدينة</OptionText>
            {!isEditingCity && (
              <TouchableOpacity onPress={handleEditCity}>
                <Feather name="edit-2" size={20} color="#e066a6" />
              </TouchableOpacity>
            )}
          </OptionRow>
          {isEditingCity ? (
            <>
              <InputField
                placeholder="أدخل المدينة"
                value={city}
                onChangeText={setCity}
                isEditing={isEditingCity}
              />
              <Button onPress={handleUpdateCity}>
                <ButtonText>تحديث المدينة</ButtonText>
              </Button>
            </>
          ) : (
            <OptionText style={{ marginTop: 5 }}>{city || "--"}</OptionText>
          )}
        </OptionContainer>

        {/* Language Option */}
        <OptionContainer>
          <OptionRow>
            <OptionText>أنا أتحدث</OptionText>
            {!isEditingLanguage && (
              <TouchableOpacity onPress={handleEditLanguage}>
                <Feather name="edit-2" size={20} color="#e066a6" />
              </TouchableOpacity>
            )}
          </OptionRow>
          {isEditingLanguage ? (
            <>
              <InputField
                placeholder="أدخل اللغة"
                value={language}
                onChangeText={setLanguage}
                isEditing={isEditingLanguage}
              />
              <Button onPress={handleUpdateLanguage}>
                <ButtonText>تحديث اللغة</ButtonText>
              </Button>
            </>
          ) : (
            <OptionText style={{ marginTop: 5 }}>{language || "--"}</OptionText>
          )}
        </OptionContainer>

        {/* Streak Information */}
        <OptionContainer>
          <OptionRow>
            <OptionText>
              عدد أيام الحماس: {currentUser?.streak?.count ?? 0}
            </OptionText>
            <Image
              source={require("../../assets/icons/fire.png")}
              style={{ width: 24, height: 24, marginRight: 8 }}
            />
          </OptionRow>
        </OptionContainer>

        <SectionHeader>عام</SectionHeader>

        {/* Notifications Option */}
        <TouchableOpacity onPress={handleToggleNotifications}>
          <OptionContainer>
            <OptionRow>
              <OptionText>الإشعارات</OptionText>
              <Feather name="bell" size={20} color="#e066a6" />
            </OptionRow>
          </OptionContainer>
        </TouchableOpacity>

        {/* Display Language Option */}
        <OptionContainer>
          <OptionRow>
            <OptionText>لغة العرض</OptionText>
            <OptionText>{currentUser?.displayLanguage ?? "العربية"}</OptionText>
          </OptionRow>
        </OptionContainer>

        <DangerButton onPress={handleDeleteAccount}>
          <ButtonText>حذف الحساب</ButtonText>
        </DangerButton>

        <Button onPress={handleSignOut}>
          <ButtonText>تسجيل الخروج</ButtonText>
        </Button>
      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={notificationModalVisible}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              لتلقي التذكيرات والتحديثات، يرجى تفعيل الإشعارات.
            </Text>
            <ButtonGroup>
              <NotificationButton
                onPress={handleOptOutNotifications}
                style={{ backgroundColor: "#f0f0f0" }}
              >
                <ButtonText style={{ color: "#000" }}>ربما لاحقًا</ButtonText>
              </NotificationButton>
              <NotificationButton onPress={handleOptInNotifications}>
                <ButtonText>تفعيل الإشعارات</ButtonText>
              </NotificationButton>
            </ButtonGroup>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default SettingsPage;
