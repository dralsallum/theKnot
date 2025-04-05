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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import { publicRequest } from "../../requestMethods";

const { width } = Dimensions.get("window");
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 44 : StatusBar.currentHeight;

// ---------- STYLED COMPONENTS ----------
// Changed from SafeAreaView to View so header background goes edge-to-edge
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

// Updated for two-column layout:
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

// ---------- MAIN COMPONENT ----------
const Booking = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const onScrollEnd = (e) => {
    let contentOffset = e.nativeEvent.contentOffset.x;
    let index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

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
        <FavoriteButton onPress={() => setIsFavorite(!isFavorite)}>
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
            <PageIndicatorText>{`${currentIndex + 1}/${
              images.length
            }`}</PageIndicatorText>
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
          <CallButton>
            <CallButtonText>Call</CallButtonText>
          </CallButton>
          <QuoteButton>
            <QuoteButtonText>Request Quote</QuoteButtonText>
          </QuoteButton>
        </ButtonsRow>
      </ButtonsRowWrapper>
    </Container>
  );
};

export default Booking;
