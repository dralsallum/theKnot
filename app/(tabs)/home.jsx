import React, { useState } from "react";
import styled from "styled-components/native";
/** For picking images from the library **/
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { uploadUserProfileImage } from "../redux/authSlice";
import { Image, TouchableOpacity, Alert, View, Text } from "react-native";
import { useRouter } from "expo-router";

/* Example icons/images – replace with your own */
const gearIcon = require("../../assets/icons/gear.png");
const bellIcon = require("../../assets/icons/notification.png");
const cameraIcon = require("../../assets/icons/camera.png");
const couplePhoto = require("../../assets/icons/couple.png");
const budgetChart = require("../../assets/icons/budget.png");

/* Venues */
const venue1 = require("../../assets/images/venue.jpg");
const venue2 = require("../../assets/images/venue.jpg");
const venue3 = require("../../assets/images/venue.jpg");

/* Other images */
const weddingCakeImg = require("../../assets/images/cake.webp");
const saveTheDateSticker = require("../../assets/icons/calendar.png");
const registryIconsImg = require("../../assets/images/cake.webp");
const invitationsImg = require("../../assets/images/cake.webp");
const detailsImg = require("../../assets/images/cake.webp");

/* Style quiz images + icons (example placeholders) */
const styleQuizImg = require("../../assets/images/flowers.webp");
const heartIcon = require("../../assets/icons/heart.png");
const closeIcon = require("../../assets/icons/cross.png");

/********************************************/
/************ STYLED COMPONENTS ************/
/********************************************/

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fdf8f2;
`;

const Content = styled.ScrollView.attrs(() => ({
  contentContainerStyle: { paddingBottom: 90 }, // extra space so bottom nav is visible
}))``;

/* Top row */
const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #ffffff;
`;

const IconButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

const AddWeddingDate = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

/* 
   ----- COUPLE SECTION -----
   Adjusted layout and styling for a cleaner look
*/
const CoupleSection = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 20px;
  background-color: #ffffff;
`;

const LeftCol = styled.View`
  flex: 1;
  padding-right: 16px;
  justify-content: center;
`;

/* Make the RightCol big & tilted */
const RightCol = styled.View`
  width: 160px;
  height: 160px;
  transform: rotate(-5deg);
`;

const CoupleNames = styled.Text`
  font-size: 30px;
  font-weight: 800;
  color: #000;
  margin-bottom: 8px;
`;

const WeddingInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const WeddingInfoIcon = styled.Image`
  width: 16px;
  height: 16px;
  tint-color: #222;
  margin-right: 6px;
`;

const WeddingInfoText = styled.Text`
  font-size: 14px;
  color: #0066cc;
  text-decoration-line: underline;
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
`;

const LocationIcon = styled.Image`
  width: 16px;
  height: 16px;
  tint-color: #222;
  margin-right: 6px;
`;

const LocationText = styled.Text`
  font-size: 14px;
  color: #333;
`;

/* Photo container (polaroid style) */
const PhotoCardContainer = styled.View`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 4px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 3;
  overflow: hidden;
  background-color: #fdf8f2;
  border: 2px #636363;
`;

const PhotoImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 4px;
`;

const CameraButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ff69b4aa;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
`;

const CameraIcon = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: #fff;
`;

/* Generic Section Title */
const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin: 0px 0 10px;
  padding: 0 20px;
`;

/* Budget Advisor Card */
const BudgetCard = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 12px;
  padding: 12px;
  margin: 0 20px 20px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
  flex-direction: row;
  align-items: center;
`;

const BudgetTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const BudgetTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 3px;
`;

const BudgetSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
`;

const BudgetChartImg = styled.Image`
  width: 50px;
  height: 50px;
`;

/* ------- Collapsed Venues Section (initial look) ------ */
const VenuesSectionCollapsed = styled.View`
  background-color: #fff;
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 16px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const VenuesRowCollapsed = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const VenuesTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const VenuesTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

const VenuesDesc = styled.Text`
  font-size: 14px;
  color: #333;
`;

const VenuesImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

/* ------- Expanded Venues Section (after toggle) ------ */
const VenuesHeader = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin: 0 20px 5px;
`;

const VenuesWrapper = styled.View`
  margin-bottom: 20px;
`;

const VenuesRow = styled.ScrollView.attrs(() => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
}))`
  padding-left: 20px;
`;

const VenueCard = styled.View`
  width: 220px;
  border-radius: 8px;
  background-color: #fff;
  margin-right: 15px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
  overflow: hidden;
`;

const VenueImageContainer = styled.View`
  width: 100%;
  height: 120px;
`;

const VenueImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const VenueFavoriteButton = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  justify-content: center;
  align-items: center;
`;

const VenueInfoContainer = styled.View`
  padding: 8px;
`;

const VenueTitle = styled.Text`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

const VenueRating = styled.Text`
  font-size: 12px;
  margin-bottom: 2px;
  color: #333;
`;

const VenueLocation = styled.Text`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
`;

const VenueCapacityPrice = styled.Text`
  font-size: 12px;
  color: #666;
`;

const Badge = styled.Text`
  margin-top: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #000;
  background-color: #e0e0e0;
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
`;

const ExploreButton = styled.TouchableOpacity`
  background-color: #ff69b4;
  padding: 14px 20px;
  margin: 0 20px 20px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
`;

const ExploreButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

/* "To help with your search" */
const HelpSectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 20px 10px;
`;

const InfoCard = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 12px;
  margin: 0 20px 10px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const InfoCardTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
`;

const InfoCardDesc = styled.Text`
  font-size: 14px;
  color: #333;
`;

const LinkText = styled.Text`
  color: #0066cc;
  font-size: 14px;
  margin: 0 20px 20px;
`;

/* Vendors (Yellow) */
const VendorsSection = styled.View`
  background-color: #ffcb05;
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 16px;
`;

const VendorsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const VendorsTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const VendorsTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

const VendorsDesc = styled.Text`
  font-size: 14px;
  color: #333;
`;

const VendorsImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

/* Announcements (White) */
const AnnouncementsSection = styled.View`
  background-color: #fff;
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 16px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const AnnouncementsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AnnouncementsTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const AnnouncementsTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

const AnnouncementsDesc = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
`;

const PinkSticker = styled.Image`
  width: 80px;
  height: 80px;
`;

/* Registry (Blue) */
const RegistrySection = styled.View`
  background-color: #a0d9ff;
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 16px;
`;

const RegistryRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RegistryTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const RegistryTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

const RegistryDesc = styled.Text`
  font-size: 14px;
  color: #333;
`;

const RegistryImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
`;

/* Invitations (Orange) */
const InvitationsSection = styled.View`
  background-color: #ff9000;
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 16px;
`;

const InvitationsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const InvitationsTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const InvitationsTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

const InvitationsDesc = styled.Text`
  font-size: 14px;
  color: #333;
`;

const InvitationsImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

/* Details (White) */
const DetailsSection = styled.View`
  background-color: #fff;
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 16px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const DetailsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DetailsTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const DetailsTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

const DetailsDesc = styled.Text`
  font-size: 14px;
  color: #333;
`;

const DetailsImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

/* YOUR WEDDING */
const YourWeddingTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin: 20px;
`;

const ChecklistCard = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin: 0 20px 20px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const ChecklistHeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ChecklistTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ChecklistIcon = styled.Image`
  width: 18px;
  height: 18px;
  margin-right: 6px;
`;

const ChecklistTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const SeeAllTasks = styled.Text`
  font-size: 14px;
  color: #0066cc;
`;

const TaskItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const TaskBullet = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 1px;
  border-color: #333;
  margin-right: 8px;
`;

const TaskLabel = styled.Text`
  flex: 1;
  font-size: 14px;
  color: #333;
`;

const GuestsCard = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin: 0 20px 20px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const GuestsHeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const GuestsTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const GuestsIcon = styled.Image`
  width: 18px;
  height: 18px;
  margin-right: 6px;
`;

const GuestsTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const AddGuestsLink = styled.Text`
  font-size: 14px;
  color: #0066cc;
`;

const GuestsCountRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 4px;
`;

const GuestsCountNumber = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin-right: 4px;
`;

const GuestsCountLabel = styled.Text`
  font-size: 14px;
  color: #333;
`;

const GuestsDesc = styled.Text`
  font-size: 14px;
  color: #333;
`;

/* ***** New Style Quiz Section ***** */
const StyleQuizCard = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin: 0 20px 20px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const StyleQuizHeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StyleQuizTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StyleQuizIcon = styled.Image`
  width: 18px;
  height: 18px;
  margin-right: 6px;
  tint-color: #000;
`;

const StyleQuizTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const FindYourStyleLink = styled.Text`
  font-size: 14px;
  color: #0066cc;
`;

const StyleQuizDesc = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
`;

/* Style quiz image with heart & X icons on top */
const QuizImageContainer = styled.View`
  width: 100%;
  height: 200px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

const QuizImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const QuizCloseButton = styled.TouchableOpacity`
  position: absolute;
  left: 12px;
  bottom: 12px;
  background-color: #000;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
`;

const QuizHeartButton = styled.TouchableOpacity`
  position: absolute;
  right: 12px;
  bottom: 12px;
  background-color: #ff69b4;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
`;

/* ***** Quote Section ***** */
const QuoteSection = styled.View`
  background-color: #fdf8f2;
  padding: 40px 20px;
  align-items: center;
  justify-content: center;
`;

const QuoteText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #000;
  text-align: center;
  line-height: 28px;
  margin-bottom: 20px;
`;

const QuoteDecorRow = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const DecorIcon = styled.Image`
  width: 24px;
  height: 24px;
  margin: 0 4px;
`;

/* ***** Bottom Nav Bar ***** */
const BottomNavBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  flex-direction: row;
  background-color: #fff;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

const NavItem = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const NavIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-bottom: 2px;
  tint-color: #333;
`;

const NavLabel = styled.Text`
  font-size: 10px;
  color: #333;
`;

/***********************************************/
/************ MAIN COMPONENT: Home *************/
/***********************************************/
const Home = () => {
  const router = useRouter();
  const [showVenues, setShowVenues] = useState(false);
  const [showVendors, setShowVendors] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showRegistry, setShowRegistry] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?._id;
  const [customPhoto, setCustomPhoto] = useState(
    currentUser?.profileImage || null
  );

  const navigateToVendorDetails = (vendorId) => {
    router.push("/budget");
  };

  // Open image library to pick a new photo
  const handleCameraIconPress = () => {
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets?.length
      ) {
        const selected = response.assets[0]; // { uri, fileName, type, etc. }

        // 1) Immediately display locally
        setCustomPhoto(selected.uri);

        // 2) Dispatch your thunk to upload to S3 & update user in DB
        if (userId) {
          try {
            await dispatch(
              uploadUserProfileImage({ userId, imageAsset: selected })
            ).unwrap();

            // Optionally show success
            Alert.alert("Success", "Profile image uploaded successfully!");
          } catch (err) {
            Alert.alert("Upload error", err.toString());
            // Revert local preview if you want
            // setCustomPhoto(null);
          }
        }
      }
    });
  };

  return (
    <Container>
      <Content>
        {/* Top Row */}
        <TopRow>
          <IconButton onPress={() => {}}>
            <Image source={gearIcon} style={{ width: 24, height: 24 }} />
          </IconButton>
          <AddWeddingDate>+ Add wedding date</AddWeddingDate>
          <IconButton onPress={() => {}}>
            <Image source={bellIcon} style={{ width: 24, height: 24 }} />
          </IconButton>
        </TopRow>

        {/* ----- Couple Section ----- */}
        <CoupleSection>
          <LeftCol>
            <CoupleNames>Saud & Sara</CoupleNames>

            <WeddingInfoRow>
              <WeddingInfoIcon
                source={require("../../assets/icons/calendar.png")}
              />
              <WeddingInfoText>Add wedding date</WeddingInfoText>
            </WeddingInfoRow>

            <LocationRow>
              <LocationIcon
                source={require("../../assets/icons/location.png")}
              />
              <LocationText>Tangier, 01</LocationText>
            </LocationRow>
          </LeftCol>

          <RightCol>
            <PhotoCardContainer>
              <PhotoImage
                source={customPhoto ? { uri: customPhoto } : couplePhoto}
                resizeMode="cover"
              />
              <CameraButtonContainer onPress={handleCameraIconPress}>
                <CameraIcon source={cameraIcon} />
              </CameraButtonContainer>
            </PhotoCardContainer>
          </RightCol>
        </CoupleSection>

        {/* Budget Advisor Card */}
        <SectionTitle>NEW</SectionTitle>
        <BudgetCard onPress={() => navigateToVendorDetails()}>
          <BudgetTextContainer>
            <BudgetTitle>Budget Advisor</BudgetTitle>
            <BudgetSubtitle>
              Explore real wedding costs in your area.
            </BudgetSubtitle>
          </BudgetTextContainer>
          <BudgetChartImg source={budgetChart} />
        </BudgetCard>

        {/* ------- Venues Section (Toggle) ------- */}
        {!showVenues && (
          <VenuesSectionCollapsed>
            <TouchableOpacity onPress={() => setShowVenues(true)}>
              <VenuesRowCollapsed>
                <VenuesTextContainer>
                  <VenuesTitle>Venues ▾</VenuesTitle>
                  <VenuesDesc>
                    Find your kind of place for the celebration to go down.
                  </VenuesDesc>
                </VenuesTextContainer>
                <VenuesImg source={venue1} resizeMode="cover" />
              </VenuesRowCollapsed>
            </TouchableOpacity>
          </VenuesSectionCollapsed>
        )}

        {showVenues && (
          <>
            <VenuesHeader>Venue explore</VenuesHeader>
            <VenuesWrapper>
              <VenuesRow>
                <VenueCard>
                  <VenueImageContainer>
                    <VenueImage source={venue1} resizeMode="cover" />
                    <VenueFavoriteButton>
                      <Image
                        source={heartIcon}
                        style={{ width: 16, height: 16 }}
                      />
                    </VenueFavoriteButton>
                  </VenueImageContainer>
                  <VenueInfoContainer>
                    <VenueTitle>The Cove</VenueTitle>
                    <VenueRating>⭐ 5.0 (1)</VenueRating>
                    <VenueLocation>Virginia Beach, VA</VenueLocation>
                    <VenueCapacityPrice>
                      101-150 guests • $$ – Affordable
                    </VenueCapacityPrice>
                  </VenueInfoContainer>
                </VenueCard>

                <VenueCard>
                  <VenueImageContainer>
                    <VenueImage source={venue2} resizeMode="cover" />
                    <VenueFavoriteButton>
                      <Image
                        source={heartIcon}
                        style={{ width: 16, height: 16 }}
                      />
                    </VenueFavoriteButton>
                  </VenueImageContainer>
                  <VenueInfoContainer>
                    <VenueTitle>Blue Pete's Restaurant</VenueTitle>
                    <VenueRating>⭐ 5.0 (30)</VenueRating>
                    <VenueLocation>Virginia Beach, VA</VenueLocation>
                    <VenueCapacityPrice>
                      151-200 guests • $$ – Affordable
                    </VenueCapacityPrice>
                    <Badge>Best of Weddings</Badge>
                  </VenueInfoContainer>
                </VenueCard>

                <VenueCard>
                  <VenueImageContainer>
                    <VenueImage source={venue3} resizeMode="cover" />
                    <VenueFavoriteButton>
                      <Image
                        source={heartIcon}
                        style={{ width: 16, height: 16 }}
                      />
                    </VenueFavoriteButton>
                  </VenueImageContainer>
                  <VenueInfoContainer>
                    <VenueTitle>Kefford Hall</VenueTitle>
                    <VenueRating>⭐ 5.0 (12)</VenueRating>
                    <VenueLocation>Newport News, VA</VenueLocation>
                    <VenueCapacityPrice>
                      101-150 guests • $$ – Affordable
                    </VenueCapacityPrice>
                    <Badge>Virtual Tour</Badge>
                  </VenueInfoContainer>
                </VenueCard>
              </VenuesRow>
            </VenuesWrapper>

            <ExploreButton onPress={() => setShowVenues(false)}>
              <ExploreButtonText>Hide venues</ExploreButtonText>
            </ExploreButton>

            {/* Info Cards */}
            <HelpSectionTitle>To help with your search</HelpSectionTitle>
            <InfoCard>
              <InfoCardTitle>Prioritize your vendors</InfoCardTitle>
              <InfoCardDesc>
                Organize and edit any vendor categories you'd like to explore.
              </InfoCardDesc>
            </InfoCard>
            <InfoCard>
              <InfoCardTitle>Start your budget</InfoCardTitle>
              <InfoCardDesc>
                See average venue costs for your area and what’s involved.
              </InfoCardDesc>
            </InfoCard>
            <InfoCard>
              <InfoCardTitle>Start your guest list</InfoCardTitle>
              <InfoCardDesc>
                Make sure your venue can hold everyone you plan to invite.
              </InfoCardDesc>
            </InfoCard>
            <LinkText>Booked your venue? Add venue info</LinkText>
          </>
        )}

        {/* Vendors Section - Collapsed / Expanded */}
        {!showVendors && (
          <VendorsSection>
            <TouchableOpacity onPress={() => setShowVendors(true)}>
              <VendorsRow>
                <VendorsTextContainer>
                  <VendorsTitle>Vendors ▾</VendorsTitle>
                  <VendorsDesc>
                    Get in touch with photographers, DJs, florists and more.
                  </VendorsDesc>
                </VendorsTextContainer>
                <VendorsImg source={weddingCakeImg} />
              </VendorsRow>
            </TouchableOpacity>
          </VendorsSection>
        )}

        {showVendors && (
          <>
            <VenuesHeader>Vendors explore</VenuesHeader>
            <VenuesWrapper>
              <VenuesRow>
                <VenueCard>
                  <VenueImageContainer>
                    <VenueImage source={weddingCakeImg} resizeMode="cover" />
                    <VenueFavoriteButton>
                      <Image
                        source={heartIcon}
                        style={{ width: 16, height: 16 }}
                      />
                    </VenueFavoriteButton>
                  </VenueImageContainer>
                  <VenueInfoContainer>
                    <VenueTitle>Awesome Photographer</VenueTitle>
                    <VenueRating>⭐ 5.0 (15)</VenueRating>
                    <VenueLocation>Richmond, VA</VenueLocation>
                    <VenueCapacityPrice>
                      Starting at $2,000 • Photo + Video
                    </VenueCapacityPrice>
                  </VenueInfoContainer>
                </VenueCard>

                <VenueCard>
                  <VenueImageContainer>
                    <VenueImage source={weddingCakeImg} resizeMode="cover" />
                    <VenueFavoriteButton>
                      <Image
                        source={heartIcon}
                        style={{ width: 16, height: 16 }}
                      />
                    </VenueFavoriteButton>
                  </VenueImageContainer>
                  <VenueInfoContainer>
                    <VenueTitle>DJ MixMaster</VenueTitle>
                    <VenueRating>⭐ 4.9 (24)</VenueRating>
                    <VenueLocation>Norfolk, VA</VenueLocation>
                    <VenueCapacityPrice>
                      Hourly packages • $$ – Affordable
                    </VenueCapacityPrice>
                    <Badge>Best of Weddings</Badge>
                  </VenueInfoContainer>
                </VenueCard>
              </VenuesRow>
              <VenuesHeader>As you look for vendors</VenuesHeader>

              {/* Budget estimates card */}
              <View
                style={{
                  margin: 20,
                  padding: 20,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 5,
                  elevation: 3,
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}
                >
                  See budget estimates
                </Text>
                <Text style={{ fontSize: 16, color: "#333" }}>
                  Get a breakdown of how much couples spend on each vendor.
                </Text>
              </View>

              {/* Your vendors section with management link */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  marginBottom: 20,
                }}
              >
                <Text style={{ fontSize: 24, fontWeight: "700" }}>
                  Your vendors
                </Text>
                <Text style={{ fontSize: 16, color: "#0066cc" }}>
                  Manage vendors
                </Text>
              </View>

              {/* Vendor category circles */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingHorizontal: 10,
                  marginBottom: 10,
                }}
              >
                {/* Photographers */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: "#f2f2f2",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 32,
                        color: "#ff69b4",
                        fontWeight: "300",
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Photographers
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#333",
                      textAlign: "center",
                      marginTop: 5,
                    }}
                  >
                    2 saved
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#333", textAlign: "center" }}
                  >
                    0 messages
                  </Text>
                </View>

                {/* Bridal Salons */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: "#f2f2f2",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 32,
                        color: "#ff69b4",
                        fontWeight: "300",
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Bridal Salons
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#333",
                      textAlign: "center",
                      marginTop: 5,
                    }}
                  >
                    1 saved
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#333", textAlign: "center" }}
                  >
                    0 messages
                  </Text>
                </View>

                {/* Caterers */}
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: "#f2f2f2",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 32,
                        color: "#ff69b4",
                        fontWeight: "300",
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Caterers
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#333",
                      textAlign: "center",
                      marginTop: 5,
                    }}
                  >
                    0 saved
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#333", textAlign: "center" }}
                  >
                    0 messages
                  </Text>
                </View>
              </View>

              {/* Mark vendors done button */}
              <View
                style={{
                  alignItems: "center",
                  marginTop: 30,
                  marginBottom: 30,
                }}
              >
                <TouchableOpacity>
                  <Text style={{ fontSize: 18, color: "#0066cc" }}>
                    Mark vendors done
                  </Text>
                </TouchableOpacity>
              </View>

              <ExploreButton onPress={() => setShowVendors(false)}>
                <ExploreButtonText>Hide vendors</ExploreButtonText>
              </ExploreButton>
            </VenuesWrapper>
          </>
        )}

        {/* Announcements Section - Collapsed / Expanded */}
        {!showAnnouncements && (
          <AnnouncementsSection>
            <TouchableOpacity onPress={() => setShowAnnouncements(true)}>
              <AnnouncementsRow>
                <AnnouncementsTextContainer>
                  <AnnouncementsTitle>Announcements ▾</AnnouncementsTitle>
                  <AnnouncementsDesc>
                    Start spreading the word with save the dates and a free
                    website.
                  </AnnouncementsDesc>
                </AnnouncementsTextContainer>
                <PinkSticker source={saveTheDateSticker} resizeMode="contain" />
              </AnnouncementsRow>
            </TouchableOpacity>
          </AnnouncementsSection>
        )}

        {showAnnouncements && (
          <>
            <VenuesHeader>Announcements explore</VenuesHeader>
            <VenuesWrapper>
              <VenuesRow>
                <VenueCard>
                  <VenueImageContainer>
                    <VenueImage
                      source={saveTheDateSticker}
                      resizeMode="cover"
                    />
                  </VenueImageContainer>
                  <VenueInfoContainer>
                    <VenueTitle>Save the Dates</VenueTitle>
                    <VenueRating>Choose from many designs</VenueRating>
                  </VenueInfoContainer>
                </VenueCard>

                <VenueCard>
                  <VenueImageContainer>
                    <VenueImage source={weddingCakeImg} resizeMode="cover" />
                  </VenueImageContainer>
                  <VenueInfoContainer>
                    <VenueTitle>Wedding Website</VenueTitle>
                    <VenueRating>Free and easy to share</VenueRating>
                  </VenueInfoContainer>
                </VenueCard>
              </VenuesRow>
            </VenuesWrapper>

            <ExploreButton onPress={() => setShowAnnouncements(false)}>
              <ExploreButtonText>Hide announcements</ExploreButtonText>
            </ExploreButton>
          </>
        )}

        {/* Registry Section - Collapsed / Expanded */}
        {!showRegistry && (
          <RegistrySection>
            <TouchableOpacity onPress={() => setShowRegistry(true)}>
              <RegistryRow>
                <RegistryTextContainer>
                  <RegistryTitle>Registry ▾</RegistryTitle>
                  <RegistryDesc>
                    Make it easy for guests to find every gift you want in one
                    place.
                  </RegistryDesc>
                </RegistryTextContainer>
                <RegistryImg source={registryIconsImg} resizeMode="cover" />
              </RegistryRow>
            </TouchableOpacity>
          </RegistrySection>
        )}

        {showRegistry && (
          <>
            <VenuesHeader>Registry explore</VenuesHeader>
            <VenuesWrapper>
              <VenuesRow>
                <VenueCard>
                  <VenueImageContainer>
                    <VenueImage source={registryIconsImg} resizeMode="cover" />
                  </VenueImageContainer>
                  <VenueInfoContainer>
                    <VenueTitle>Universal Registry</VenueTitle>
                    <VenueRating>Link all your favorite stores</VenueRating>
                  </VenueInfoContainer>
                </VenueCard>
              </VenuesRow>
            </VenuesWrapper>

            <ExploreButton onPress={() => setShowRegistry(false)}>
              <ExploreButtonText>Hide registry</ExploreButtonText>
            </ExploreButton>
          </>
        )}

        {/* Invitations Section - Collapsed / Expanded */}
        {!showInvitations && (
          <InvitationsSection>
            <TouchableOpacity onPress={() => setShowInvitations(true)}>
              <InvitationsRow>
                <InvitationsTextContainer>
                  <InvitationsTitle>Invitations ▾</InvitationsTitle>
                  <InvitationsDesc>
                    Create beautiful invitations that fit your budget and feel
                    like you.
                  </InvitationsDesc>
                </InvitationsTextContainer>
                <InvitationsImg source={invitationsImg} resizeMode="cover" />
              </InvitationsRow>
            </TouchableOpacity>
          </InvitationsSection>
        )}

        {showInvitations && (
          <>
            <VenuesHeader>Invitations explore</VenuesHeader>
            <VenuesWrapper>
              <VenuesRow>
                <VenueCard>
                  <VenueImageContainer>
                    <VenueImage source={invitationsImg} resizeMode="cover" />
                  </VenueImageContainer>
                  <VenueInfoContainer>
                    <VenueTitle>Digital Invitations</VenueTitle>
                    <VenueRating>Instantly send & track RSVPs</VenueRating>
                  </VenueInfoContainer>
                </VenueCard>
              </VenuesRow>
            </VenuesWrapper>

            <ExploreButton onPress={() => setShowInvitations(false)}>
              <ExploreButtonText>Hide invitations</ExploreButtonText>
            </ExploreButton>
          </>
        )}

        {/* Details Section - Collapsed / Expanded */}
        {!showDetails && (
          <DetailsSection>
            <TouchableOpacity onPress={() => setShowDetails(true)}>
              <DetailsRow>
                <DetailsTextContainer>
                  <DetailsTitle>Details ▾</DetailsTitle>
                  <DetailsDesc>
                    From place cards to guest books, details add distinction to
                    your day.
                  </DetailsDesc>
                </DetailsTextContainer>
                <DetailsImg source={detailsImg} resizeMode="cover" />
              </DetailsRow>
            </TouchableOpacity>
          </DetailsSection>
        )}

        {showDetails && (
          <>
            <VenuesHeader>Details explore</VenuesHeader>
            <VenuesWrapper>
              <VenuesRow>
                <VenueCard>
                  <VenueImageContainer>
                    <VenueImage source={detailsImg} resizeMode="cover" />
                  </VenueImageContainer>
                  <VenueInfoContainer>
                    <VenueTitle>Decor & Signage</VenueTitle>
                    <VenueRating>Personalize your touches</VenueRating>
                  </VenueInfoContainer>
                </VenueCard>
              </VenuesRow>
            </VenuesWrapper>

            <ExploreButton onPress={() => setShowDetails(false)}>
              <ExploreButtonText>Hide details</ExploreButtonText>
            </ExploreButton>
          </>
        )}

        {/* YOUR WEDDING */}
        <YourWeddingTitle>YOUR WEDDING</YourWeddingTitle>

        {/* Next on your checklist */}
        <ChecklistCard>
          <ChecklistHeaderRow>
            <ChecklistTitleRow>
              <ChecklistIcon source={gearIcon} />
              <ChecklistTitle>Next on your checklist</ChecklistTitle>
            </ChecklistTitleRow>
            <TouchableOpacity onPress={() => {}}>
              <SeeAllTasks>See all tasks</SeeAllTasks>
            </TouchableOpacity>
          </ChecklistHeaderRow>

          <TaskItem>
            <TaskBullet />
            <TaskLabel>
              Research and estimate costs for major budget items
            </TaskLabel>
          </TaskItem>
          <TaskItem>
            <TaskBullet />
            <TaskLabel>Discover your wedding style</TaskLabel>
          </TaskItem>
          <TaskItem>
            <TaskBullet />
            <TaskLabel>Start your guest list</TaskLabel>
          </TaskItem>
          <TaskItem>
            <TaskBullet />
            <TaskLabel>Explore and tour venues</TaskLabel>
          </TaskItem>
        </ChecklistCard>

        {/* Guests & RSVPs */}
        <GuestsCard>
          <GuestsHeaderRow>
            <GuestsTitleRow>
              <GuestsIcon source={gearIcon} />
              <GuestsTitle>Guests & RSVPs</GuestsTitle>
            </GuestsTitleRow>

            <TouchableOpacity onPress={() => {}}>
              <AddGuestsLink>Add guests</AddGuestsLink>
            </TouchableOpacity>
          </GuestsHeaderRow>
          <GuestsCountRow>
            <GuestsCountNumber>0</GuestsCountNumber>
            <GuestsCountLabel>guests</GuestsCountLabel>
          </GuestsCountRow>
          <GuestsDesc>
            Keep all your guest info and RSVPs organized for every event.
          </GuestsDesc>
        </GuestsCard>

        {/* Style Quiz Card */}
        <StyleQuizCard>
          <StyleQuizHeaderRow>
            <StyleQuizTitleRow>
              <StyleQuizIcon source={heartIcon} />
              <StyleQuizTitle>Style quiz</StyleQuizTitle>
            </StyleQuizTitleRow>

            <TouchableOpacity onPress={() => {}}>
              <FindYourStyleLink>Find your style</FindYourStyleLink>
            </TouchableOpacity>
          </StyleQuizHeaderRow>

          <StyleQuizDesc>
            Get inspired and find your look with our fun and quick quiz.
          </StyleQuizDesc>

          <QuizImageContainer>
            <QuizImage source={styleQuizImg} resizeMode="cover" />
            <QuizCloseButton
              onPress={() => {
                /* user disliked this style */
              }}
            >
              <Image
                source={closeIcon}
                style={{ width: 16, height: 16, tintColor: "#fff" }}
              />
            </QuizCloseButton>
            <QuizHeartButton
              onPress={() => {
                /* user liked this style */
              }}
            >
              <Image
                source={heartIcon}
                style={{ width: 16, height: 16, tintColor: "#fff" }}
              />
            </QuizHeartButton>
          </QuizImageContainer>
        </StyleQuizCard>

        {/* Quote Section */}
        <QuoteSection>
          <QuoteText>
            “I love you for all that you are, all that you have been and all you
            will be.”
          </QuoteText>
          {/* Optional decor icons row */}
          <QuoteDecorRow>
            <DecorIcon source={heartIcon} />
            <DecorIcon source={heartIcon} />
          </QuoteDecorRow>
        </QuoteSection>
      </Content>
    </Container>
  );
};

export default Home;
