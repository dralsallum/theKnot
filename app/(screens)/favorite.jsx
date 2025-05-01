import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  TouchableOpacity,
  TextInput as RNTextInput,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styled from "styled-components/native";
import { createUserRequest } from "../../requestMethods";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectSavedVendorIds } from "../redux/authSlice";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32; // 16px padding on each side

const Favorites = () => {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const savedVendorIds = useSelector(selectSavedVendorIds);

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryCounts, setCategoryCounts] = useState({});
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (currentUser) {
          setIsAuthenticated(true);
        } else {
          // Check for stored userData in AsyncStorage as fallback
          const userData = await AsyncStorage.getItem("userData");
          if (userData) {
            setIsAuthenticated(true);
          } else {
            // If not authenticated, redirect to login
            Alert.alert(
              "Sign In Required",
              "Please sign in to view your favorites",
              [
                {
                  text: "Cancel",
                  onPress: () => router.back(),
                  style: "cancel",
                },
                { text: "Sign In", onPress: () => router.push("/login") },
              ]
            );
          }
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
      } finally {
        // If user is authenticated, continue; otherwise we stop loading here
        if (!isAuthenticated) {
          setLoading(false);
        }
      }
    };

    checkAuthStatus();
  }, [currentUser]);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        let userId = currentUser?._id;

        if (!userId) {
          // Try to get user ID from AsyncStorage as fallback
          const userData = await AsyncStorage.getItem("userData");
          if (userData) {
            const parsedUser = JSON.parse(userData);
            userId = parsedUser._id;
          } else {
            throw new Error("User ID not found");
          }
        }

        const userRequest = createUserRequest();
        const response = await userRequest.get(`/users/${userId}/favorites`);

        if (response.data && Array.isArray(response.data)) {
          setFavorites(response.data);
          // Calculate category counts
          const counts = { All: response.data.length };
          response.data.forEach((vendor) => {
            const category = vendor.category || "Uncategorized";
            counts[category] = (counts[category] || 0) + 1;
          });
          setCategoryCounts(counts);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        Alert.alert(
          "Error",
          "Could not load your favorites. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, savedVendorIds]);

  // Filter favorites by category
  useEffect(() => {
    let filtered = favorites;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (vendor) => vendor.category === selectedCategory
      );
    }

    setFilteredFavorites(filtered);
  }, [selectedCategory, favorites]);

  // Remove from favorites
  const removeFromFavorites = async (vendorId) => {
    try {
      let userId = currentUser?._id;

      if (!userId) {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          userId = parsedUser._id;
        } else {
          throw new Error("User ID not found");
        }
      }

      const userRequest = createUserRequest();
      await userRequest.delete(`/users/${userId}/favorites/${vendorId}`);

      // Update local state
      const updatedFavorites = favorites.filter(
        (vendor) => vendor._id !== vendorId
      );
      setFavorites(updatedFavorites);

      // Recalculate category counts
      const updatedCounts = { All: updatedFavorites.length };
      updatedFavorites.forEach((vendor) => {
        const category = vendor.category || "Uncategorized";
        updatedCounts[category] = (updatedCounts[category] || 0) + 1;
      });
      setCategoryCounts(updatedCounts);

      // Show success message
      Alert.alert("Success", "Vendor removed from favorites.");
    } catch (err) {
      console.error("Error removing from favorites:", err);
      Alert.alert(
        "Error",
        "Could not remove from favorites. Please try again."
      );
    }
  };

  // Navigate to vendor details
  const navigateToVendorDetails = (vendorId) => {
    router.push({
      pathname: "/booking",
      params: { id: vendorId },
    });
  };

  // Get all unique categories from favorites
  const getCategories = () => {
    const categories = ["All"];
    Object.keys(categoryCounts).forEach((category) => {
      if (category && category !== "All" && !categories.includes(category)) {
        categories.push(category);
      }
    });
    return categories;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "All":
        return "grid";
      case "Venue":
        return "home";
      case "Photographer":
        return "camera";
      case "Florist":
        return "flower";
      case "Catering":
        return "coffee";
      case "Music":
        return "music";
      case "Cake":
        return "pie-chart";
      case "DJ":
        return "disc";
      case "Planner":
        return "calendar";
      case "Decor":
        return "layers";
      default:
        return "bookmark";
    }
  };

  // Render empty state
  const renderEmptyState = () => (
    <EmptyContainer>
      <EmptyIconContainer>
        <Feather name="heart" size={60} color="#e066a6" />
      </EmptyIconContainer>
      <EmptyTitle>No favorites yet</EmptyTitle>
      <EmptySubtitle>
        {selectedCategory === "All"
          ? "Your favorite vendors will appear here"
          : `You haven't saved any ${selectedCategory} vendors yet`}
      </EmptySubtitle>
      <BrowseButton onPress={() => router.push("/")}>
        <BrowseButtonText>Browse Vendors</BrowseButtonText>
      </BrowseButton>
    </EmptyContainer>
  );

  // Render vendor item
  const renderVendorItem = ({ item }) => (
    <VendorCard>
      <TouchableCard onPress={() => navigateToVendorDetails(item._id)}>
        <VendorImageContainer>
          <VendorImage
            source={
              item.images && item.images.length > 0
                ? { uri: item.images[0] }
                : require("../../assets/images/beach.jpg")
            }
            resizeMode="cover"
          />
          <Gradient />
          <CategoryBadge>
            <Feather
              name={getCategoryIcon(item.category)}
              size={12}
              color="#fff"
              style={{ marginRight: 4 }}
            />
            <CategoryBadgeText>{item.category || "Venue"}</CategoryBadgeText>
          </CategoryBadge>
          <HeartButton
            onPress={(e) => {
              e.stopPropagation();
              removeFromFavorites(item._id);
            }}
          >
            <Feather name="heart" size={20} color="#e066a6" />
          </HeartButton>
        </VendorImageContainer>

        <InfoContainer>
          <VendorName numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </VendorName>

          <VendorLocation numberOfLines={1} ellipsizeMode="tail">
            <Feather
              name="map-pin"
              size={14}
              color="#666"
              style={{ marginRight: 4 }}
            />
            {item.location || "Location not specified"}
          </VendorLocation>

          <InfoRow>
            <RatingContainer>
              <Feather name="star" size={16} color="#FFD700" />
              <RatingText>{item.rating || "0.0"}</RatingText>
              <ReviewCount>({item.reviews || 0})</ReviewCount>
            </RatingContainer>

            <PriceContainer>
              <PriceText>{item.priceRange || "$$"}</PriceText>
            </PriceContainer>
          </InfoRow>

          <CapacityContainer>
            <Feather
              name="users"
              size={14}
              color="#666"
              style={{ marginRight: 4 }}
            />
            <CapacityText>{item.capacity || "N/A"} guests</CapacityText>
          </CapacityContainer>

          <NoteInput
            placeholder="Add a note about this vendor..."
            placeholderTextColor="#999"
            multiline={true}
            numberOfLines={2}
            maxLength={100}
          />

          <ButtonRow>
            <ViewDetailsButton
              onPress={() => navigateToVendorDetails(item._id)}
            >
              <ViewDetailsButtonText>View Details</ViewDetailsButtonText>
            </ViewDetailsButton>

            <RequestQuoteButton
              onPress={() => navigateToVendorDetails(item._id)}
            >
              <RequestQuoteButtonText>Request Quote</RequestQuoteButtonText>
            </RequestQuoteButton>
          </ButtonRow>
        </InfoContainer>
      </TouchableCard>
    </VendorCard>
  );

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#e066a6" />
      </LoadingContainer>
    );
  }

  const categories = getCategories();
  const totalCount = favorites.length;

  return (
    <Container>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header>
        <BackButton onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </BackButton>
        <HeaderTitle>Saved Vendors</HeaderTitle>
        <HeaderSubTitle>({totalCount})</HeaderSubTitle>
        <SortButton>
          <Feather name="sliders" size={20} color="#666" />
        </SortButton>
      </Header>

      {/* Fixed-height Category Tabs */}
      <TabsContainer>
        <TabsScrollContainer horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TabItem
              key={category}
              active={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            >
              <TabIcon active={selectedCategory === category}>
                <Feather
                  name={getCategoryIcon(category)}
                  size={16}
                  color={selectedCategory === category ? "#fff" : "#666"}
                />
              </TabIcon>
              <TabText active={selectedCategory === category}>
                {category === "All" ? "All" : category}
                {` (${categoryCounts[category] || 0})`}
              </TabText>
            </TabItem>
          ))}
        </TabsScrollContainer>
      </TabsContainer>

      {/* Favorites List */}
      <FlatList
        data={filteredFavorites}
        renderItem={renderVendorItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={listContentStyle}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default Favorites;

/* ---------------------------- STYLED COMPONENTS ---------------------------- */

const listContentStyle = {
  paddingHorizontal: 16,
  paddingBottom: 80,
  flexGrow: 1,
};

const Container = styled.View`
  flex: 1;
  background-color: #f9f9f9;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 16px;
  padding-horizontal: 16px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 12px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const HeaderSubTitle = styled.Text`
  font-size: 18px;
  color: #666;
  margin-left: 4px;
`;

const SortButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: auto;
`;

const TabsContainer = styled.View`
  height: 70px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const TabsScrollContainer = styled.ScrollView`
  height: 70px;
  padding-vertical: 12px;
  padding-horizontal: 16px;
`;

const TabItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
  padding-horizontal: 14px;
  padding-vertical: 8px;
  border-radius: 20px;
  background-color: ${(props) => (props.active ? "#e066a6" : "#f0f0f0")};
  border-width: ${(props) => (props.active ? "0px" : "1px")};
  border-color: #e0e0e0;
`;

const TabIcon = styled.View`
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 6px;
  border-radius: 12px;
  background-color: ${(props) =>
    props.active ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)"};
`;

const TabText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.active ? "#fff" : "#666")};
`;

const EmptyContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px;
  flex: 1;
  min-height: 400px;
`;

const EmptyIconContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: rgba(224, 102, 166, 0.1);
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-top: 8px;
  color: #333;
`;

const EmptySubtitle = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 16px;
`;

const BrowseButton = styled.TouchableOpacity`
  background-color: #e066a6;
  padding-horizontal: 24px;
  padding-vertical: 12px;
  border-radius: 8px;
  elevation: 2;
`;

const BrowseButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const VendorCard = styled.View`
  background-color: #fff;
  border-radius: 16px;
  margin-vertical: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  overflow: hidden;
`;

const TouchableCard = styled.TouchableOpacity`
  width: 100%;
`;

const VendorImageContainer = styled.View`
  position: relative;
  width: 100%;
  height: 180px;
`;

const VendorImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Gradient = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.3);
`;

const CategoryBadge = styled.View`
  position: absolute;
  top: 16px;
  left: 16px;
  flex-direction: row;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding-horizontal: 10px;
  padding-vertical: 6px;
  border-radius: 20px;
`;

const CategoryBadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const HeartButton = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
  elevation: 2;
`;

const InfoContainer = styled.View`
  padding: 16px;
`;

const VendorName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
`;

const VendorLocation = styled.Text`
  font-size: 14px;
  color: #666;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RatingText = styled.Text`
  margin-left: 4px;
  font-weight: bold;
  font-size: 14px;
  color: #333;
`;

const ReviewCount = styled.Text`
  font-size: 14px;
  color: #666;
  margin-left: 4px;
`;

const PriceContainer = styled.View`
  padding-horizontal: 10px;
  padding-vertical: 4px;
  background-color: #f0f0f0;
  border-radius: 4px;
`;

const PriceText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #666;
`;

const CapacityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const CapacityText = styled.Text`
  font-size: 14px;
  color: #666;
`;

const NoteInput = styled(RNTextInput)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  min-height: 60px;
  background-color: #f9f9f9;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ViewDetailsButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding-vertical: 12px;
  align-items: center;
  margin-right: 8px;
`;

const ViewDetailsButtonText = styled.Text`
  color: #333;
  font-weight: bold;
  font-size: 14px;
`;

const RequestQuoteButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #e066a6;
  border-radius: 8px;
  padding-vertical: 12px;
  align-items: center;
  margin-left: 8px;
`;

const RequestQuoteButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 14px;
`;
