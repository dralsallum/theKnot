import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import { publicRequest } from "../../requestMethods";

const { width } = Dimensions.get("window");
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 44 : StatusBar.currentHeight;

// ---------- STYLED COMPONENTS ----------
// Replace SafeAreaView with View for a full edge-to-edge header background.
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

// Add extra top padding using STATUSBAR_HEIGHT so that icons are pushed down.
const HeaderBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-top: ${STATUSBAR_HEIGHT + 15}px;
  padding-bottom: 16px;
  background-color: #fdf8f2;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
`;

const HeaderTitle = styled.View`
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000;
`;

const LocationText = styled.Text`
  font-size: 15px;
  color: #666;
`;

const HeaderActionButtons = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ActionButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
`;

const CarouselContainer = styled.View`
  width: 100%;
  height: 380px;
`;

const CarouselImage = styled.Image`
  width: ${width}px;
  height: 380px;
`;

const PromoBanner = styled.View`
  background-color: #fff8f8;
  padding-vertical: 12px;
  align-items: center;
`;

const PromoTitle = styled.Text`
  font-size: 22px;
  font-weight: 500;
  color: #b35d82;
  margin-bottom: 6px;
`;

const PromoDescription = styled.Text`
  font-size: 16px;
  color: #333;
`;

const PageDotsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
`;

const PageDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.active ? "#b35d82" : "rgba(179, 93, 130, 0.3)"};
  margin-horizontal: 4px;
`;

const ContentContainer = styled.View`
  padding-horizontal: 16px;
  padding-vertical: 16px;
`;

const LocationRow = styled.Text`
  font-size: 18px;
  color: #666;
  margin-bottom: 4px;
`;

const VendorNameRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const VendorName = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #000;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RatingText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-left: 4px;
`;

const ReviewCount = styled.Text`
  font-size: 18px;
  color: #666;
  margin-left: 6px;
`;

const PriceRange = styled.Text`
  font-size: 22px;
  color: #333;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const AwardBadge = styled.View`
  background-color: #f0f6ff;
  border-radius: 8px;
  padding-vertical: 8px;
  padding-horizontal: 16px;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-bottom: 16px;
`;

const AwardText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-left: 8px;
`;

const RequestQuoteButton = styled.TouchableOpacity`
  background-color: #e066a6;
  border-radius: 40px;
  padding-vertical: 16px;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 24px;
`;

const RequestQuoteText = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const SecondImage = styled.View`
  width: 100%;
  height: 380px;
  position: relative;
`;

const SecondCarouselImage = styled.Image`
  width: 100%;
  height: 380px;
`;

const OfferBadge = styled.View`
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 100px;
  padding: 12px;
`;

const OfferText = styled.Text`
  text-align: center;
`;

const OfferAmount = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000;
`;

const OfferDetails = styled.Text`
  font-size: 12px;
  color: #333;
`;

const FavoriteButton = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: white;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
`;

const PromoHeader = styled.View`
  background-color: #d7eee8;
  padding: 16px;
  margin-top: 16px;
`;

const PromoHeaderText = styled.Text`
  font-size: 30px;
  font-weight: 300;
  text-align: center;
`;

const PromoHighlight = styled.Text`
  font-weight: bold;
  font-size: 30px;
`;

const PageDotsSaleContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  background-color: #d7eee8;
  padding-bottom: 16px;
`;

const ChatBubble = styled.View`
  position: absolute;
  bottom: 24px;
  right: 24px;
  background-color: white;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`;

const ChatNotification = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e54c65;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ChatNotificationText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// ---------- MAIN COMPONENT ----------
const Category = () => {
  const router = useRouter();
  const { category, id } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  // Change from a single vendor to an array of vendors
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to navigate to vendor details
  const navigateToVendorDetails = (vendorId) => {
    router.push({
      pathname: "/booking",
      params: { id: vendorId },
    });
  };

  // Format category name for display
  const formatCategoryName = (cat) => {
    if (!cat) return "";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Fallback mock data function based on category
  const getCategoryMockData = (category, id) => {
    const defaultData = {
      id: id || "defaultId",
      location: "Charlottesville, VA",
      rating: 4.3,
      reviews: 100,
      priceRange: "$$$",
      awards: ["Top Choice"],
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
      offers: [
        {
          title: "Spring Sale!",
          description: "Limited Time Offer",
        },
      ],
      isFeatured: true,
    };

    switch (category) {
      case "photographers":
        return {
          ...defaultData,
          name: "George Street Photo & Video",
          description: "Professional wedding photography",
          rating: 4.8,
          reviews: 2632,
          priceRange: "$1,000-$1,999",
          awards: ["Best of Weddings"],
          offers: [
            {
              title: "Spring Sale!",
              description: "$600 OFF The Love Captured Package",
            },
            {
              title: "$200 OFF",
              description: "Any Photo or Video",
              secondLine: "$400 OFF",
              secondDescription: "10hr Photo & Video",
            },
          ],
        };
      case "dj":
        return {
          ...defaultData,
          name: "Elite Sound DJ",
          description: "Professional DJ services for all events",
          rating: 4.7,
          reviews: 1243,
          priceRange: "$500-$999",
          awards: ["Best Entertainment"],
          offers: [
            {
              title: "Early Booking",
              description: "15% OFF for early bookings",
            },
          ],
        };
      case "salon":
        return {
          ...defaultData,
          name: "Glamour Bridal Salon",
          description: "Complete bridal beauty services",
          rating: 4.9,
          reviews: 876,
          priceRange: "$200-$599",
          awards: ["Top Rated Salon"],
          offers: [
            {
              title: "Bridal Package",
              description: "Hair & Makeup special",
            },
          ],
        };
      case "catering":
        return {
          ...defaultData,
          name: "Delicious Affairs Catering",
          description: "Gourmet catering for weddings and events",
          rating: 4.6,
          reviews: 1532,
          priceRange: "$35-$75 per person",
          awards: ["Best Caterer"],
          offers: [
            {
              title: "Tasting Special",
              description: "Free tasting for parties of 100+",
            },
          ],
        };
      default:
        return {
          ...defaultData,
          name: "Premium Vendor",
          description: "High quality services",
        };
    }
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        let response;

        // If a specific vendor ID is provided, fetch that vendor and wrap it in an array
        if (id && id !== "default") {
          response = await publicRequest.get(`/vendors/${id}`);
          setVendors([response.data]);
        }
        // Otherwise, fetch all vendors for the category (note: no limit parameter)
        else if (category) {
          response = await publicRequest.get(`/vendors?category=${category}`);
          if (Array.isArray(response.data) && response.data.length > 0) {
            setVendors(response.data);
          } else {
            throw new Error("No vendors found for this category");
          }
        } else {
          throw new Error("No category or vendor ID provided");
        }
        setLoading(false);
      } catch (err) {
        console.log("Error fetching vendors:", err);
        // Use mock data when an error occurs
        const mockVendorData = getCategoryMockData(category, id);
        setVendors([mockVendorData]);
        setLoading(false);
      }
    };

    fetchVendors();
  }, [category, id]);

  const onScrollEnd = (e) => {
    let contentOffset = e.nativeEvent.contentOffset.x;
    let index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#e066a6" />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <Text>{error || "Something went wrong."}</Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#e066a6",
            borderRadius: 8,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: "white" }}>Go Back</Text>
        </TouchableOpacity>
      </LoadingContainer>
    );
  }

  // If no vendors are loaded even after loading completes, use fallback data
  if (!vendors.length) {
    const fallbackVendor = getCategoryMockData(category, id);
    setVendors([fallbackVendor]);
    return null;
  }

  // Sample images for demonstration purposes
  const images = [
    require("../../assets/images/beach.jpg"),
    require("../../assets/images/beach.jpg"),
  ];

  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header Bar */}
      <HeaderBar>
        <BackButton onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </BackButton>

        <HeaderTitle>
          <TitleText>{formatCategoryName(category)}</TitleText>
          {/* Optionally show a location if there is only one vendor */}
          {vendors.length === 1 && (
            <LocationText>{vendors[0].location}</LocationText>
          )}
        </HeaderTitle>

        <HeaderActionButtons>
          <ActionButton>
            <Feather name="search" size={24} color="#000" />
          </ActionButton>
          <ActionButton>
            <Feather name="sliders" size={24} color="#000" />
          </ActionButton>
        </HeaderActionButtons>
      </HeaderBar>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map over all vendors and wrap each card in a TouchableOpacity */}
        {vendors.map((vendorItem) => (
          <TouchableOpacity
            key={vendorItem.id}
            onPress={() => navigateToVendorDetails(vendorItem.id)}
            activeOpacity={0.8}
          >
            <View>
              {/* First Image Carousel */}
              <CarouselContainer>
                <CarouselImage source={images[0]} resizeMode="cover" />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 10,
                  }}
                  onPress={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                  }}
                >
                  <Feather
                    name="heart"
                    size={32}
                    color={isFavorite ? "#e066a6" : "white"}
                  />
                </TouchableOpacity>
              </CarouselContainer>

              {/* Promo Banner if offers exist */}
              {vendorItem.offers && vendorItem.offers.length > 0 && (
                <PromoBanner>
                  <PromoTitle>{vendorItem.offers[0].title}</PromoTitle>
                  <PromoDescription>
                    {vendorItem.offers[0].description}
                  </PromoDescription>
                  <PageDotsContainer>
                    {vendorItem.offers.map((offer, index) => (
                      <PageDot key={index} active={index === 0} />
                    ))}
                  </PageDotsContainer>
                </PromoBanner>
              )}

              {/* Vendor Details */}
              <ContentContainer>
                <LocationRow>{vendorItem.location}</LocationRow>
                <VendorNameRow>
                  <VendorName>{vendorItem.name}</VendorName>
                  <RatingContainer>
                    <Feather name="star" size={22} color="#FFD700" />
                    <RatingText>{vendorItem.rating}</RatingText>
                    <ReviewCount>({vendorItem.reviews})</ReviewCount>
                  </RatingContainer>
                </VendorNameRow>
                {vendorItem.description && (
                  <Text
                    style={{ marginBottom: 12, fontSize: 16, color: "#666" }}
                  >
                    {vendorItem.description}
                  </Text>
                )}
                <PriceRange>{vendorItem.priceRange}</PriceRange>
                {vendorItem.awards && vendorItem.awards.length > 0 && (
                  <AwardBadge>
                    <Feather name="award" size={18} color="#333" />
                    <AwardText>{vendorItem.awards[0]}</AwardText>
                  </AwardBadge>
                )}
                <RequestQuoteButton>
                  <RequestQuoteText>Request Quote</RequestQuoteText>
                </RequestQuoteButton>
              </ContentContainer>

              {/* Second Image with Offer (if a second offer exists) */}
              {vendorItem.offers && vendorItem.offers.length > 1 && (
                <SecondImage>
                  <SecondCarouselImage source={images[1]} resizeMode="cover" />
                  <OfferBadge>
                    <OfferText>
                      <OfferAmount>{vendorItem.offers[1].title}</OfferAmount>
                      {"\n"}
                      <OfferDetails>
                        {vendorItem.offers[1].description}
                      </OfferDetails>
                      {vendorItem.offers[1].secondLine && (
                        <>
                          {"\n"}
                          <OfferAmount>
                            {vendorItem.offers[1].secondLine}
                          </OfferAmount>
                          {"\n"}
                          <OfferDetails>
                            {vendorItem.offers[1].secondDescription}
                          </OfferDetails>
                        </>
                      )}
                    </OfferText>
                  </OfferBadge>
                  <FavoriteButton
                    onPress={(e) => {
                      e.stopPropagation();
                      setIsFavorite(!isFavorite);
                    }}
                  >
                    <Feather
                      name="heart"
                      size={26}
                      color={isFavorite ? "#e066a6" : "#000"}
                    />
                  </FavoriteButton>
                </SecondImage>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chat Bubble */}
      <ChatBubble>
        <Image
          source={require("../../assets/icons/family.png")}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <ChatNotification>
          <ChatNotificationText>1</ChatNotificationText>
        </ChatNotification>
      </ChatBubble>
    </Container>
  );
};

export default Category;
