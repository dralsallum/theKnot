import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import { publicRequest, createUserRequest } from "../../requestMethods";
import { useSelector } from "react-redux"; // Import Redux selector

const { width } = Dimensions.get("window");
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 44 : StatusBar.currentHeight;

// ---------- STYLED COMPONENTS ----------
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: ${STATUSBAR_HEIGHT + 30}px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  z-index: 10;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`;

const HeaderButtonsContainer = styled.View`
  position: absolute;
  top: ${STATUSBAR_HEIGHT + 30}px;
  right: 20px;
  flex-direction: row;
  z-index: 10;
`;

const ShareButton = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`;

const FavoriteButton = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`;

const CarouselContainer = styled.View`
  width: 100%;
  height: 380px;
`;

const CarouselImage = styled.Image`
  width: ${width}px;
  height: 380px;
`;

const OfferBadge = styled.View`
  position: absolute;
  top: ${STATUSBAR_HEIGHT + 80}px;
  left: 20px;
  background-color: rgba(255, 105, 180, 0.9);
  border-radius: 12px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
  z-index: 6;
`;

const OfferText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const PageDotsContainer = styled.View`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 6;
`;

const PageDots = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PageDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.active ? "#ffffff" : "rgba(255,255,255,0.5)"};
  margin-horizontal: 4px;
`;

const PageIndicator = styled.View`
  position: absolute;
  bottom: 30px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  padding-horizontal: 10px;
  padding-vertical: 4px;
  z-index: 6;
`;

const PageIndicatorText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const ContentContainer = styled.View`
  padding-horizontal: 24px;
  padding-vertical: 24px;
  flex: 1;
  padding-bottom: 100px;
  margin-top: -24px;
  background-color: white;
  z-index: 4;
`;

const VenueTitle = styled.Text`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const VenueSubtitle = styled.Text`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
`;

const LocationRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  padding: 12px 16px;
  border-radius: 12px;
`;

const LocationText = styled.Text`
  font-size: 16px;
  margin-left: 10px;
  color: #333;
`;

const InfoCard = styled.View`
  background-color: #f9f9f9;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
`;

const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const RatingLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RatingText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-left: 8px;
`;

const ReviewLink = styled.TouchableOpacity`
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
`;

const ReviewLinkText = styled.Text`
  font-size: 14px;
  color: #555;
  font-weight: 500;
`;

const VenueRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

const VenueType = styled.View`
  background-color: #ff69b4;
  padding: 6px 12px;
  border-radius: 20px;
`;

const VenueTypeText = styled.Text`
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  color: white;
  font-weight: bold;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #eee;
  margin-vertical: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const PriceRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
  margin-top: 8px;
`;

const PriceInfo = styled.View`
  margin-left: 12px;
`;

const PriceText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const PriceDetails = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const FeatureRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
  justify-content: space-between;
`;

const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  padding: 10px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
  width: 48%;
`;

const FeatureText = styled.Text`
  font-size: 14px;
  margin-left: 8px;
  color: #555;
`;

const ResponseTime = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  padding: 12px 16px;
  border-radius: 24px;
`;

const ResponseTimeText = styled.Text`
  font-size: 14px;
  margin-left: 8px;
  color: #666;
`;

const ButtonsRowWrapper = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding-horizontal: 24px;
  padding-vertical: 25px;
  border-top-width: 1px;
  border-top-color: #eee;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 8;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const CallButton = styled.TouchableOpacity`
  flex: 1;
  background-color: white;
  border-radius: 16px;
  border-width: 2px;
  border-color: #ff69b4;
  padding-vertical: 16px;
  align-items: center;
  margin-right: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 2;
`;

const CallButtonText = styled.Text`
  color: #ff69b4;
  font-size: 18px;
  font-weight: bold;
`;

const QuoteButton = styled.TouchableOpacity`
  flex: 1.5;
  background-color: #ff69b4;
  border-radius: 16px;
  padding-vertical: 16px;
  align-items: center;
  margin-left: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 4;
`;

const QuoteButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// ---------- MODAL STYLES ----------
const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

const ModalCard = styled.View`
  width: 90%;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
`;

const StepIndicator = styled.Text`
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
  text-align: center;
`;

const FormField = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding-horizontal: 12px;
  padding-vertical: 10px;
  margin-bottom: 12px;
`;

const ModalButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
`;

const ModalButton = styled.TouchableOpacity`
  flex: 1;
  margin-horizontal: 8px;
  background-color: ${(props) => (props.primary ? "#ff69b4" : "#f0f0f0")};
  padding-vertical: 12px;
  border-radius: 8px;
  align-items: center;
`;

const ModalButtonText = styled.Text`
  color: ${(props) => (props.primary ? "#fff" : "#333")};
  font-weight: bold;
`;

const CallModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
  align-items: center;
`;

const CallModalCard = styled.View`
  width: 100%;
  background-color: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
`;

const CallModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
`;

const CallOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const CallOptionText = styled.Text`
  font-size: 18px;
  margin-left: 16px;
`;

const CancelButton = styled.TouchableOpacity`
  margin-top: 16px;
  background-color: #f0f0f0;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
`;

const CancelButtonText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #333;
`;

const Booking = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // ---------- FAVORITES LOGIC START ----------
  // Redux for user auth
  const currentUser = useSelector((state) => state.user.currentUser);
  const isAuthenticated = !!currentUser;
  const userId = currentUser?._id || null;

  // States
  const [userFavorites, setUserFavorites] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [formStep, setFormStep] = useState(1);

  // Form data states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [weddingDetails, setWeddingDetails] = useState("");

  // Fetch venue details
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const res = await publicRequest.get(`/vendors/${id}`);
        setVenue(res.data);
      } catch (err) {
        setError("Failed to fetch venue details.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVenue();
    }
  }, [id]);

  // Fetch user favorites (if logged in)
  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!isAuthenticated || !userId) return;

      try {
        const userReq = createUserRequest(); // properly handles token
        const response = await userReq.get(`/users/${userId}/favorites`);
        if (Array.isArray(response.data)) {
          // If the API returns an array of vendor docs, we can map them to IDs
          const favoriteIds = response.data.map((fav) =>
            fav._id ? fav._id : fav
          );
          setUserFavorites(favoriteIds);

          // Check if current venue is in favorites
          if (id && favoriteIds.includes(id)) {
            setIsFavorite(true);
          }
        }
      } catch (err) {
        console.log("Error fetching user favorites:", err);
      }
    };

    fetchUserFavorites();
  }, [isAuthenticated, userId, id]);

  // Toggle favorite functionality
  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      // If user not logged in, prompt to sign-in
      router.push("/sign-in");
      return;
    }

    if (!id) return;

    try {
      const userReq = createUserRequest();

      // Optimistic UI update
      setIsFavorite(!isFavorite);

      if (isFavorite) {
        // Remove from favorites
        setUserFavorites((prev) => prev.filter((item) => item !== id));
        await userReq.delete(`/users/${userId}/favorites/${id}`);
      } else {
        // Add to favorites
        setUserFavorites((prev) => [...prev, id]);
        await userReq.post(`/users/${userId}/favorites`, { vendorId: id });
      }
    } catch (err) {
      console.log("Error toggling favorite:", err);
      // Revert UI if error
      setIsFavorite(!isFavorite);
    }
  };
  // ---------- FAVORITES LOGIC END ----------

  const onScrollEnd = (e) => {
    let contentOffset = e.nativeEvent.contentOffset.x;
    let index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const handleOpenQuoteModal = () => {
    // Reset form if needed:
    setFirstName("");
    setLastName("");
    setEmail("");
    setWeddingDate("");
    setGuestCount("");
    setPhoneNumber("");
    setWeddingDetails("");
    setFormStep(1);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleNextStep = () => {
    if (formStep === 1) {
      // Validate step-1 fields if needed
      setFormStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (formStep === 2) {
      setFormStep(1);
    }
  };

  const handleSubmitForm = () => {
    // Do final submission or call an API
    console.log("Form data:", {
      firstName,
      lastName,
      email,
      weddingDate,
      guestCount,
      phoneNumber,
      weddingDetails,
    });
    // Then close modal
    setModalVisible(false);
    // Possibly show a success message or navigate
  };

  // ---------- CALL LOGIC START ----------
  const handleOpenCallModal = () => {
    setCallModalVisible(true);
  };

  const handleCloseCallModal = () => {
    setCallModalVisible(false);
  };

  const handleMakeCall = async (phoneNum) => {
    // Default to venue phone number if provided, otherwise use a fallback
    const numberToCall = phoneNum || venue?.phone || "1234567890";

    const phoneUrl = `tel:${numberToCall}`;

    try {
      const supported = await Linking.canOpenURL(phoneUrl);

      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          "Cannot Make Call",
          "Your device doesn't support making phone calls or no phone app is available.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while trying to make the call. Please try again.",
        [{ text: "OK" }]
      );
      console.error("Error making call:", error);
    } finally {
      handleCloseCallModal();
    }
  };
  // ---------- CALL LOGIC END ----------

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#ff69b4" />
      </LoadingContainer>
    );
  }

  if (error || !venue) {
    return (
      <LoadingContainer>
        <Text>{error || "Something went wrong."}</Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#ff69b4",
            borderRadius: 8,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: "white" }}>Go Back</Text>
        </TouchableOpacity>
      </LoadingContainer>
    );
  }

  const images =
    venue.images && venue.images.length > 0
      ? venue.images.map((img) => ({ uri: img }))
      : [
          { uri: venue.imgUrl || "https://via.placeholder.com/400x600/cccccc" },
          { uri: "https://via.placeholder.com/400x600/dddddd" },
          { uri: "https://via.placeholder.com/400x600/eeeeee" },
        ];

  // Sample features for demonstration
  const features = [
    { icon: "users", text: "Up to 300 guests" },
    { icon: "calendar", text: "Available weekends" },
    { icon: "coffee", text: "Catering included" },
    { icon: "music", text: "Live music allowed" },
  ];

  // Phone numbers for the venue
  const venuePhoneNumbers = [
    { type: "Main Office", number: venue.phone || "555-123-4567" },
    { type: "Sales Team", number: venue.salesPhone || "555-987-6543" },
  ];

  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Header Buttons */}
      <BackButton onPress={() => router.back()}>
        <Feather name="arrow-left" size={22} color="#000" />
      </BackButton>

      <HeaderButtonsContainer>
        <ShareButton>
          <Feather name="share" size={20} color="#000" />
        </ShareButton>
        <FavoriteButton onPress={toggleFavorite}>
          <Feather
            name="heart"
            size={20}
            color={isFavorite ? "#ff69b4" : "#000"}
          />
        </FavoriteButton>
      </HeaderButtonsContainer>

      {/* Main Scrollable Content */}
      <ScrollView>
        {/* Carousel Section */}
        <CarouselContainer>
          <ScrollView
            horizontal
            pagingEnabled
            onMomentumScrollEnd={onScrollEnd}
            showsHorizontalScrollIndicator={false}
          >
            {images.map((img, idx) => (
              <CarouselImage key={idx} source={img} resizeMode="cover" />
            ))}
          </ScrollView>

          {venue.hasOffers && (
            <OfferBadge>
              <OfferText>2026 Wedding Offers</OfferText>
            </OfferBadge>
          )}

          <PageIndicator>
            <PageIndicatorText>
              {`${currentIndex + 1}/${images.length}`}
            </PageIndicatorText>
          </PageIndicator>

          <PageDotsContainer>
            <PageDots>
              {images.map((_, i) => (
                <PageDot key={i} active={i === currentIndex} />
              ))}
            </PageDots>
          </PageDotsContainer>
        </CarouselContainer>

        {/* Venue Details */}
        <ContentContainer>
          <VenueTitle>{venue.name}</VenueTitle>
          <VenueSubtitle>
            {venue.tagline || "Your Dream Wedding Venue"}
          </VenueSubtitle>

          <LocationRow>
            <Feather name="map-pin" size={20} color="#ff69b4" />
            <LocationText>
              {venue.location || "Location unavailable"}
            </LocationText>
          </LocationRow>

          <InfoCard>
            <RatingRow>
              <RatingLeft>
                <Feather name="star" size={22} color="#FFD700" />
                <RatingText>{venue.rating}</RatingText>
              </RatingLeft>
              <ReviewLink>
                <ReviewLinkText>{venue.numReviews || 0} reviews</ReviewLinkText>
              </ReviewLink>
            </RatingRow>

            <VenueRow>
              <VenueType>
                <VenueTypeText>
                  {venue.category || "WEDDING VENUE"}
                </VenueTypeText>
              </VenueType>
              {venue.logoUrl && (
                <Image
                  source={{ uri: venue.logoUrl }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
              )}
            </VenueRow>
          </InfoCard>

          <SectionTitle>Pricing</SectionTitle>
          <PriceRow>
            <Feather name="dollar-sign" size={24} color="#ff69b4" />
            <PriceInfo>
              <PriceText>
                {venue.priceRange || "$9,000 starting price"}
              </PriceText>
              <PriceDetails>Tap for full pricing details</PriceDetails>
            </PriceInfo>
          </PriceRow>

          <Divider />

          <SectionTitle>Venue Features</SectionTitle>
          <FeatureRow>
            {features.map((feature, index) => (
              <FeatureItem key={index}>
                <Feather name={feature.icon} size={16} color="#ff69b4" />
                <FeatureText>{feature.text}</FeatureText>
              </FeatureItem>
            ))}
          </FeatureRow>

          <ResponseTime>
            <Feather name="clock" size={16} color="#ff69b4" />
            <ResponseTimeText>
              {venue.responseTime || "Typically responds within 24h"}
            </ResponseTimeText>
          </ResponseTime>
        </ContentContainer>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <ButtonsRowWrapper>
        <ButtonsRow>
          <CallButton onPress={handleOpenCallModal}>
            <CallButtonText>Call</CallButtonText>
          </CallButton>
          <QuoteButton onPress={handleOpenQuoteModal}>
            <QuoteButtonText>Request Quote</QuoteButtonText>
          </QuoteButton>
        </ButtonsRow>
      </ButtonsRowWrapper>

      {/* 2-STEP MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <ModalContainer>
          <ModalCard>
            {formStep === 1 ? (
              <>
                <ModalTitle>Contact Info</ModalTitle>
                <StepIndicator>Step 1 of 2</StepIndicator>

                <FormField
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <FormField
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                />
                <FormField
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
                <FormField
                  placeholder="Estimated Wedding Date (MM/DD/YYYY)"
                  value={weddingDate}
                  onChangeText={setWeddingDate}
                />
                <FormField
                  placeholder="Estimated Guest Count"
                  value={guestCount}
                  onChangeText={setGuestCount}
                />
                <FormField
                  placeholder="Phone Number (optional)"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />

                <ModalButtonRow>
                  <ModalButton onPress={handleCloseModal}>
                    <ModalButtonText>Cancel</ModalButtonText>
                  </ModalButton>
                  <ModalButton onPress={handleNextStep} primary>
                    <ModalButtonText primary>Next</ModalButtonText>
                  </ModalButton>
                </ModalButtonRow>
              </>
            ) : (
              <>
                <ModalTitle>About Your Wedding</ModalTitle>
                <StepIndicator>Step 2 of 2</StepIndicator>

                <FormField
                  placeholder="Describe what's important for your wedding..."
                  value={weddingDetails}
                  onChangeText={setWeddingDetails}
                  multiline
                  style={{ height: 100, textAlignVertical: "top" }}
                />

                <ModalButtonRow>
                  <ModalButton onPress={handlePreviousStep}>
                    <ModalButtonText>Back</ModalButtonText>
                  </ModalButton>
                  <ModalButton onPress={handleSubmitForm} primary>
                    <ModalButtonText primary>Submit</ModalButtonText>
                  </ModalButton>
                </ModalButtonRow>
              </>
            )}
          </ModalCard>
        </ModalContainer>
      </Modal>

      {/* CALL MODAL */}
      <Modal
        visible={callModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseCallModal}
      >
        <CallModalContainer>
          <CallModalCard>
            <CallModalTitle>Call {venue.name}</CallModalTitle>

            {venuePhoneNumbers.map((phoneInfo, index) => (
              <CallOption
                key={index}
                onPress={() => handleMakeCall(phoneInfo.number)}
              >
                <Feather name="phone" size={24} color="#ff69b4" />
                <CallOptionText>
                  {phoneInfo.type}: {phoneInfo.number}
                </CallOptionText>
              </CallOption>
            ))}

            <CancelButton onPress={handleCloseCallModal}>
              <CancelButtonText>Cancel</CancelButtonText>
            </CancelButton>
          </CallModalCard>
        </CallModalContainer>
      </Modal>
    </Container>
  );
};

export default Booking;
