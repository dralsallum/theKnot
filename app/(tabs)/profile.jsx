import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components/native";
import {
  I18nManager,
  ScrollView,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Share,
} from "react-native";
import { useSelector } from "react-redux";
import { userSelector } from "../redux/authSlice";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { createUserRequest } from "../../requestMethods";

/* Safe Area */
const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #f2f5f9;
`;

/* ScrollView */
const StyledScrollView = styled.ScrollView``;

/* Header */
const Header = styled.View`
  background-color: #ffffff;
  padding: 20px;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
`;

/* Profile Container */
const ProfileContainer = styled.View`
  flex-direction: row-reverse;
  align-items: center;
`;

/* Profile Image */
const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #f2f5f9;
`;

/* User Name */
const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
`;

/* Icon Button */
const IconButton = styled.TouchableOpacity`
  background-color: #f2f5f9;
  padding: 10px;
  border-radius: 10px;
`;

/* Icon Image */
const IconImage = styled.Image`
  width: 20px;
  height: 20px;
`;

/* Invite Section */
const InviteContainer = styled.View`
  background-color: #e6f7ff;
  margin: 10px 20px;
  border-radius: 15px;
  padding: 20px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 5;
`;

/* Invite Icon */
const InviteIcon = styled.Image`
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
`;

/* Invite Text */
const InviteText = styled.Text`
  font-size: 18px;
  color: #333;
  text-align: center;
  margin-bottom: 15px;
  font-weight: 600;
`;

/* Invite Button */
const InviteButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #ff69b4;
  padding: 12px 25px;
  border-radius: 25px;
  shadow-color: #4c47e9;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 3;
`;

/* Invite Button Icon */
const InviteButtonIcon = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: #fff;
  margin-left: 10px;
`;

/* Invite Button Text */
const InviteButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

/* Modal Overlay */
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;

/* Modal Container */
const ModalContainer = styled.View`
  width: 90%;
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 25px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 8;
`;

/* Close Button */
const CloseButton = styled.TouchableOpacity`
  padding: 5px;
`;

/* Number Slider Components */
const NumberSliderContainer = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

/* Slider Label */
const SliderLabel = styled.Text`
  align-self: flex-start;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
`;

/* Number List */
const NumberList = styled.FlatList``;

/* Define the width based on screen dimensions */
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = SCREEN_WIDTH * 0.2;

/* Number Item */
const NumberItem = styled.TouchableOpacity`
  width: ${ITEM_WIDTH}px;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-horizontal: 5px;
  border-radius: 5px;
  background-color: ${(props) => (props.selected ? "#4c47e9" : "#f2f5f9")};
`;

/* Number Text */
const NumberText = styled.Text`
  color: ${(props) => (props.selected ? "#fff" : "#333")};
  font-size: 16px;
  font-weight: ${(props) => (props.selected ? "600" : "400")};
`;

/* Badge Item */
const BadgeItem = styled.View`
  width: 30%;
  align-items: center;
  margin-bottom: 10px;
`;

/* Badge Icon */
const BadgeIconStyled = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: #f2f5f9;
  margin-bottom: 5px;
`;

/* Badge Label */
const BadgeLabel = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: center;
`;

/* Invite Modal Styled Components */
const InviteModalTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
`;

const InviteModalImage = styled.Image`
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
`;

const InviteModalInstruction = styled.Text`
  font-size: 16px;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
`;

const ShareSection = styled.View`
  width: 100%;
  border: 1px solid #4c47e9;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
`;

const ShareText = styled.Text`
  font-size: 16px;
  color: #333333;
  margin-bottom: 10px;
  text-align: center;
`;

/* Referral Link Container */
const ReferralLinkContainer = styled.View`
  background-color: #f2f5f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

/* Referral Link Text */
const ReferralLinkText = styled.Text`
  font-size: 14px;
  color: #333333;
  selectable: true;
`;

/* Send Button */
const SendButton = styled.TouchableOpacity`
  background-color: #4c47e9;
  padding: 10px 20px;
  border-radius: 5px;
  align-self: flex-end;
  width: 100%;
`;

/* Send Button Text */
const SendButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  text-align: center;
`;

/* Statistics Section */
const StatisticsSection = styled.View`
  width: 100%;
  align-items: flex-start;
`;

/* Invites Sent Text */
const InvitesSentText = styled.Text`
  font-size: 16px;
  color: #333333;
  margin-bottom: 5px;
`;

/* Invites Sent Number */
const InvitesSentNumber = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #4c47e9;
  opacity: 1;
`;

const EnvelopeIconsContainer = styled.View`
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

/* Envelope Icon */
const EnvelopeIcon = styled.Image`
  width: 40px;
  height: 40px;
  margin: 0 5px;
`;

/* Profile Component */
const Profile = () => {
  const { currentUser } = useSelector(userSelector);
  const router = useRouter();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [invitesAccepted, setInvitesAccepted] = useState(0);
  const [referralLink, setReferralLink] = useState("");

  // Invite Function
  const handleInvite = async () => {
    try {
      const result = await Share.share({
        message:
          "انضم إلى تطبيقنا الرائع واستمتع بتجربة مميزة! حمل التطبيق الآن من هنا: " +
          referralLink,
        url: referralLink,
        title: "دعوة للانضمام إلى تطبيقنا",
      });

      if (result.action === Share.sharedAction) {
        console.log("Invite link shared successfully!");
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dialog dismissed");
      }
    } catch (error) {
      alert("حدث خطأ أثناء محاولة المشاركة: " + error.message);
    }
  };

  useEffect(() => {
    if (inviteModalVisible && currentUser) {
      fetchInvitesAccepted();
    }
  }, [inviteModalVisible, currentUser]);

  const fetchInvitesAccepted = async () => {
    try {
      const userRequest = createUserRequest();
      const response = await userRequest.get(
        `/users/${currentUser._id}/invitesAccepted`
      );
      if (response.status === 200) {
        setInvitesAccepted(response.data.invitesAccepted);
      } else {
        console.error(
          "Failed to fetch invites accepted:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching invites accepted:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const link = `https://apps.apple.com/sa/app/fluentfox-language-lessons/id6673901781?referralCode=${currentUser.referralCode}`;
      setReferralLink(link);
    }
  }, [currentUser]);

  // Handle functions
  const handleSeeMore = (section) => {
    router.push("subscription");
  };

  const handleSetting = (section) => {
    router.push("setting");
  };

  // Define Badges with XP Requirements
  const badges = [
    {
      icon: require("../../assets/icons/axe.png"),
      label: "مستمع شغوف",
      requiredXp: 5,
    },
    {
      icon: require("../../assets/icons/badge.png"),
      label: "متعلم ماهر",
      requiredXp: 10,
    },
    {
      icon: require("../../assets/icons/reputation.png"),
      label: "متعلم ممتاز",
      requiredXp: 15,
    },
  ];

  return (
    <SafeArea>
      {/* Scrollable Content */}
      <StyledScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header>
          <ProfileContainer>
            <ProfileImage source={require("../../assets/images/profile.png")} />
            <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
              <UserName>{currentUser ? currentUser.username : "ضيف"}</UserName>
            </View>
          </ProfileContainer>
          <IconButton onPress={handleSetting}>
            <IconImage source={require("../../assets/icons/settings.png")} />
          </IconButton>
        </Header>

        {/* Invite Section */}
        <InviteContainer>
          <InviteIcon source={require("../../assets/icons/invite.png")} />
          <InviteText>ادعُ أصدقاءك واحصل على مكافآت مجانية</InviteText>
          <InviteButton
            onPress={() => setInviteModalVisible(true)}
            activeOpacity={0.7}
          >
            <InviteButtonText>ادعُ أصدقاءك</InviteButtonText>
            <InviteButtonIcon
              source={require("../../assets/icons/share.png")}
            />
          </InviteButton>
        </InviteContainer>
      </StyledScrollView>

      {/* Invite Friends Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={inviteModalVisible}
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContainer>
            {/* Close Button */}
            <CloseButton onPress={() => setInviteModalVisible(false)}>
              <AntDesign name="close" size={24} color="#333333" />
            </CloseButton>
            {/* Header Section */}
            <InviteModalImage
              source={require("../../assets/icons/reputation.png")}
            />
            <InviteModalTitle>شارك اصدقائك التعليم!</InviteModalTitle>
            {/* Instruction Section */}
            <InviteModalInstruction>
              احصل على بادج اذا دعوت ٥ اصدقاء
            </InviteModalInstruction>
            {/* Share Section */}
            <ShareSection>
              <ShareText>شارك هذا الرابط:</ShareText>
              <ReferralLinkContainer>
                <ReferralLinkText selectable={true}>
                  {referralLink}
                </ReferralLinkText>
              </ReferralLinkContainer>
              <SendButton onPress={handleInvite}>
                <SendButtonText>إرسال</SendButtonText>
              </SendButton>
            </ShareSection>
            <EnvelopeIconsContainer>
              {[...Array(5)].map((_, index) => (
                <EnvelopeIcon
                  key={index}
                  source={require("../../assets/icons/referral.png")}
                  style={{ opacity: index < invitesAccepted ? 1 : 0.4 }}
                />
              ))}
            </EnvelopeIconsContainer>
            {/* Statistics Section */}
            <StatisticsSection>
              <InvitesSentText>عدد الدعوات المقبولة:</InvitesSentText>
              <InvitesSentNumber>{invitesAccepted}</InvitesSentNumber>
            </StatisticsSection>
          </ModalContainer>
        </ModalOverlay>
      </Modal>
    </SafeArea>
  );
};

export default Profile;
