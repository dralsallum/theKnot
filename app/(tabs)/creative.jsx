import React, { useState, useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import styled from "styled-components/native";
import { publicRequest } from "../../requestMethods";
import { useRouter } from "expo-router"; // Import the router hook

/** Example icons/images — replace with your own **/
const EditIcon = require("../../assets/icons/edit.png");
const HeartIcon = require("../../assets/icons/heart.png");
const CheckIcon = require("../../assets/icons/check.png");
const SearchIcon = require("../../assets/icons/search.png");

/* Example images */
const ExampleVenueImg1 = require("../../assets/images/venue.jpg");
const BarnImg = require("../../assets/images/beach.jpg");
const GardenImg = require("../../assets/images/beach.jpg");
const BeachImg = require("../../assets/images/beach.jpg");
const DJImg = require("../../assets/images/beach.jpg");
const BandsImg = require("../../assets/images/beach.jpg");
const BeautyImg = require("../../assets/images/beach.jpg");
const FloristsImg = require("../../assets/images/beach.jpg");
const PlannersImg = require("../../assets/images/beach.jpg");
const VideographersImg = require("../../assets/images/venue.jpg");

/* Example icons for the "all categories" list (replace with your real icons) */
const GuitarIcon = require("../../assets/icons/guitar.png");
const PaperGoodsIcon = require("../../assets/icons/guitar.png");
const OfficiantsIcon = require("../../assets/icons/guitar.png");
const PhotoBoothIcon = require("../../assets/icons/guitar.png");
const PhotographerIcon = require("../../assets/icons/guitar.png");
const ReceptionIcon = require("../../assets/icons/guitar.png");
const RentalsIcon = require("../../assets/icons/guitar.png");
const BalloonsIcon = require("../../assets/icons/guitar.png");
const TransportationIcon = require("../../assets/icons/guitar.png");
const TravelIcon = require("../../assets/icons/guitar.png");
const VideoIcon = require("../../assets/icons/guitar.png");
const PlannerIcon = require("../../assets/icons/guitar.png");

// Define vendor categories data for reuse
const popularVenueTypes = [
  { id: 1, name: "Barn", image: BarnImg },
  { id: 2, name: "Garden", image: GardenImg },
  { id: 3, name: "Beach", image: BeachImg },
];

const guestCountSizes = [
  "0-50 guests",
  "51-100 guests",
  "101-150 guests",
  "151-200 guests",
  "201-250 guests",
  "251-300 guests",
  "300+ guests",
];

const vendorCategories = [
  { id: 1, name: "DJs", image: DJImg, category: "djs" },
  { id: 2, name: "Bands", image: BandsImg, category: "bands" },
  { id: 3, name: "Beauty", image: BeautyImg, category: "beauty" },
  { id: 4, name: "Florists", image: FloristsImg, category: "florists" },
  { id: 5, name: "Wedding Planners", image: PlannersImg, category: "planners" },
  {
    id: 6,
    name: "Videographers",
    image: VideographersImg,
    category: "videographers",
  },
];

const allCategories = [
  {
    id: 1,
    name: "Invitations & Paper Goods",
    icon: PaperGoodsIcon,
    category: "paper-goods",
  },
  {
    id: 2,
    name: "Officiants + Premarital Counseling",
    icon: OfficiantsIcon,
    category: "officiants",
  },
  {
    id: 3,
    name: "Photo Booths",
    icon: PhotoBoothIcon,
    category: "photo-booths",
  },
  {
    id: 4,
    name: "Photographers",
    icon: PhotographerIcon,
    category: "photographers",
  },
  { id: 5, name: "Reception Venues", icon: ReceptionIcon, category: "venues" },
  { id: 6, name: "Rentals", icon: RentalsIcon, category: "rentals" },
  {
    id: 7,
    name: "Shower + Party Venues",
    icon: BalloonsIcon,
    category: "party-venues",
  },
  {
    id: 8,
    name: "Transportation",
    icon: TransportationIcon,
    category: "transportation",
  },
  { id: 9, name: "Travel Specialists", icon: TravelIcon, category: "travel" },
  { id: 10, name: "Videographers", icon: VideoIcon, category: "videographers" },
  { id: 11, name: "Wedding Planners", icon: PlannerIcon, category: "planners" },
];

const Vendors = () => {
  const router = useRouter(); // Initialize the router
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("#fdf8f2");
  }, []);

  // Fetch venues (updated to specifically fetch venues category)
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        // Updated to specifically request venues based on category
        const res = await publicRequest.get("/vendors?category=venue&new=true");
        setVendors(res.data);
      } catch (err) {
        setError("Failed to fetch venues.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const navigateToVendorDetails = (vendorId) => {
    router.push({
      pathname: "/booking",
      params: { id: vendorId },
    });
  };

  // Updated navigateToCategory function
  const navigateToCategory = (category, categoryId = null) => {
    const id = categoryId || "default";

    // Normalize the category name to lowercase for consistency in routing
    const normalizedCategory = category.toLowerCase().trim();

    router.push({
      pathname: "/category",
      params: {
        category: normalizedCategory,
        id: id,
      },
    });
  };

  // Helper function to get the first image from a vendor's images array
  // or return a default placeholder image if no images exist
  const getVendorImage = (vendor) => {
    if (vendor.images && vendor.images.length > 0) {
      return { uri: vendor.images[0] };
    } else {
      // Return a default placeholder image
      return ExampleVenueImg1;
    }
  };

  return (
    <Container>
      <ScrollContainer>
        {/* ----- Top Header (Title, Subtitle, Edit) ----- */}
        <HeaderContainer>
          <Title>Vendors</Title>
          <SubTitleContainer>
            <SubTitle>Browse vendors near </SubTitle>
            <LocationLink onPress={() => {}}>
              <LocationText>Tangier, VA</LocationText>
            </LocationLink>
            <EditButton onPress={() => {}}>
              <EditIconImg source={EditIcon} />
            </EditButton>
          </SubTitleContainer>
        </HeaderContainer>

        {/* 
          ***** SINGLE WRAPPER for Search + Summary *****
          This matches the screenshot, ensuring 
          both the search bar + summary boxes 
          appear in one container with no gap.
        */}
        <SearchAndSummaryWrapper>
          {/* Search Bar */}
          <SearchBarContainer>
            <SearchIconImg source={SearchIcon} />
            <SearchTextInput
              placeholder="Search venues and vendors"
              placeholderTextColor="#666"
            />
          </SearchBarContainer>

          {/* Summary Boxes Row */}
          <SummaryBoxesContainer>
            <SummaryBox>
              <SummaryBoxTitle>Saved</SummaryBoxTitle>
              <SummaryBoxDescRow>
                <HeartIconImg source={HeartIcon} />
                <SummaryBoxDesc>0 vendors</SummaryBoxDesc>
              </SummaryBoxDescRow>
            </SummaryBox>

            <SummaryBox>
              <SummaryBoxTitle>Booked</SummaryBoxTitle>
              <SummaryBoxDescRow>
                <CheckIconImg source={CheckIcon} />
                <SummaryBoxDesc>0/8 vendors</SummaryBoxDesc>
              </SummaryBoxDescRow>
            </SummaryBox>
          </SummaryBoxesContainer>
        </SearchAndSummaryWrapper>

        {/* Switch to white background below */}
        <WhiteSection>
          {/* Blue Info Block */}
          <InfoBlock>
            <InfoBlockTitle>Start with venues</InfoBlockTitle>
            <InfoBlockSubtitle>
              82% of couples book a venue first!
            </InfoBlockSubtitle>

            <CardScroll horizontal showsHorizontalScrollIndicator={false}>
              {loading && (
                <LoaderContainer>
                  <ActivityIndicator size="large" color="#ec4899" />
                </LoaderContainer>
              )}

              {error && (
                <ErrorContainer>
                  <ErrorText>{error}</ErrorText>
                </ErrorContainer>
              )}

              {!loading &&
                !error &&
                vendors.slice(0, 5).map((vendor) => (
                  <TouchableVenueCard
                    key={vendor._id}
                    onPress={() => navigateToVendorDetails(vendor._id)}
                  >
                    <VenueImage
                      source={getVendorImage(vendor)}
                      resizeMode="cover"
                    />
                    <VenueCardContent>
                      <VenueTitle>{vendor.name}</VenueTitle>
                      <VenueRating>
                        ⭐ {vendor.rating} ({vendor.numReviews || 0})
                      </VenueRating>
                      <VenueLocation>{vendor.location}</VenueLocation>
                      <VenueExtra>
                        {vendor.guestRange || "N/A"} • {vendor.priceRange}
                      </VenueExtra>
                      {/* If vendor has tags or badges, map them, else skip */}
                      {vendor.badges?.map((badge) => (
                        <Badge key={badge}>{badge}</Badge>
                      ))}
                    </VenueCardContent>
                  </TouchableVenueCard>
                ))}
            </CardScroll>
          </InfoBlock>

          {/* Updated to navigate to venues category */}
          <ExploreButton onPress={() => navigateToCategory("venues")}>
            <ExploreButtonText>Explore venues</ExploreButtonText>
          </ExploreButton>

          <LinkText>Booked your venue? Add venue info</LinkText>

          {/* Popular Types of Venues */}
          <PopularSection>
            <PopularTitle>Popular types of venues</PopularTitle>
            <PopularSubtitle>Explore venues by setting</PopularSubtitle>

            <PopularScroll horizontal showsHorizontalScrollIndicator={false}>
              {popularVenueTypes.map((venue) => (
                <TypeCard key={venue.id}>
                  <TypeImage source={venue.image} resizeMode="cover" />
                  <BlackOverlay>
                    <TypeName>{venue.name}</TypeName>
                    <SeeAllButton
                      onPress={() => navigateToCategory(venue.name)}
                    >
                      <SeeAllText>See all</SeeAllText>
                    </SeeAllButton>
                  </BlackOverlay>
                </TypeCard>
              ))}
            </PopularScroll>
          </PopularSection>

          {/* Guest Count Block */}
          <GuestCountBlock>
            <GuestCountTitle>How many guests will you have?</GuestCountTitle>
            <GuestCountSubtitle>Explore venues by size</GuestCountSubtitle>

            <SizeBoxesContainer>
              {guestCountSizes.map((size, index) => (
                <SizeBox
                  key={index}
                  onPress={() => navigateToCategory("venues", `size-${index}`)}
                >
                  <SizeBoxText>{size}</SizeBoxText>
                </SizeBox>
              ))}
            </SizeBoxesContainer>
          </GuestCountBlock>

          {/* Vendors for your wedding (2-column) */}
          <VendorCategoriesSection>
            <VendorCategoriesTitle>
              Vendors for your wedding
            </VendorCategoriesTitle>
            <VendorCategoriesSubtitle>
              Explore vendor types
            </VendorCategoriesSubtitle>

            <TwoColumnList>
              {vendorCategories.map((vendor) => (
                <TwoColumnItem
                  key={vendor.id}
                  onPress={() => navigateToCategory(vendor.category)}
                >
                  <TwoColumnIcon source={vendor.image} resizeMode="cover" />
                  <TwoColumnLabel>{vendor.name}</TwoColumnLabel>
                </TwoColumnItem>
              ))}
            </TwoColumnList>
          </VendorCategoriesSection>

          <ExploreAllCategoriesTitle>
            Explore all categories
          </ExploreAllCategoriesTitle>
          <AllCategoriesList>
            {allCategories.map((category) => (
              <CategoryRow
                key={category.id}
                onPress={() => navigateToCategory(category.category)}
              >
                <CategoryRowIcon source={category.icon} />
                <CategoryRowLabel>{category.name}</CategoryRowLabel>
              </CategoryRow>
            ))}
          </AllCategoriesList>

          <ImageCreditsLink>View image credits ▾</ImageCreditsLink>
        </WhiteSection>
      </ScrollContainer>
    </Container>
  );
};

export default Vendors;

/******************************************/
/************ STYLED COMPONENTS ***********/
/******************************************/

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fdf8f2;
`;

const ScrollContainer = styled.ScrollView`
  background-color: #fff;
`;

const LoaderContainer = styled.View`
  height: 100px;
  justify-content: center;
  align-items: center;
`;

const ErrorContainer = styled.View`
  height: 100px;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  color: red;
`;

// For the Modal
const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  width: 80%;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ModalText = styled.Text`
  font-size: 14px;
  margin-bottom: 4px;
`;

const CloseButton = styled.TouchableOpacity`
  background-color: #ec4899;
  padding: 10px 16px;
  border-radius: 8px;
  margin-top: 14px;
`;

const CloseButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

/* ---------- Header (Vendors title, location, etc.) --------- */
const HeaderContainer = styled.View`
  padding: 20px;
  background-color: #fdf8f2;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

const SubTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const SubTitle = styled.Text`
  font-size: 14px;
  color: #444;
`;

const LocationLink = styled.TouchableOpacity`
  margin: 0 2px;
`;

const LocationText = styled.Text`
  font-size: 14px;
  color: #0066cc;
  text-decoration-line: underline;
`;

const EditButton = styled.TouchableOpacity`
  margin-left: 4px;
`;

const EditIconImg = styled.Image`
  width: 16px;
  height: 16px;
  tint-color: #000;
`;

const SearchAndSummaryWrapper = styled.View`
  background-color: #fdf8f2;
  padding: 0 20px 20px; /* Horizontal + bottom padding */
`;

/* Search Bar (white inside #fdf8f2) */
const SearchBarContainer = styled.View`
  background-color: #fff;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 16px; /* space between search and summary boxes */
`;

const SearchIconImg = styled.Image`
  width: 18px;
  height: 18px;
  tint-color: #666;
  margin-right: 6px;
`;

const SearchTextInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: #000;
`;

/* Summary Boxes Row */
const SummaryBoxesContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const SummaryBox = styled.View`
  background-color: #fff;
  border-radius: 8px;
  flex: 1;
  margin-right: 10px; /* space between boxes */
  padding: 16px;

  &:last-child {
    margin-right: 0;
  }
`;

const SummaryBoxTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin-bottom: 6px;
`;

const SummaryBoxDescRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const HeartIconImg = styled.Image`
  width: 18px;
  height: 18px;
  tint-color: #000;
  margin-right: 4px;
`;

const CheckIconImg = styled.Image`
  width: 18px;
  height: 18px;
  tint-color: #000;
  margin-right: 4px;
`;

const SummaryBoxDesc = styled.Text`
  font-size: 14px;
  color: #333;
`;

/* Everything below is white background */
const WhiteSection = styled.View`
  background-color: #fff;
`;

/* Blue Info Block */
const InfoBlock = styled.View`
  background-color: #e5f4ff;
  padding: 20px;
  margin: 20px;
  border-radius: 12px;
`;

const InfoBlockTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

const InfoBlockSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
`;

const CardScroll = styled.ScrollView``;

// Modified to use TouchableOpacity for navigation
const TouchableVenueCard = styled.TouchableOpacity`
  width: 220px;
  background-color: #fff;
  border-radius: 8px;
  margin-right: 16px;
  shadow-color: #000;
  shadow-opacity: 0.03;
  shadow-radius: 3px;
  elevation: 3;
`;

const VenueImage = styled.Image`
  width: 100%;
  height: 120px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const VenueCardContent = styled.View`
  padding: 8px;
`;

const VenueTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 2px;
`;

const VenueRating = styled.Text`
  font-size: 12px;
  color: #333;
  margin-bottom: 2px;
`;

const VenueLocation = styled.Text`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
`;

const VenueExtra = styled.Text`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
`;

const Badge = styled.Text`
  background-color: #dcdcdc;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #000;
  padding: 2px 6px;
  margin-top: 4px;
  align-self: flex-start;
`;

/* Pink "Explore venues" button */
const ExploreButton = styled.TouchableOpacity`
  background-color: #ff69b4;
  padding: 14px 20px;
  margin: 0 20px 10px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
`;

const ExploreButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const LinkText = styled.Text`
  color: #0066cc;
  font-size: 14px;
  margin-left: 20px;
  margin-bottom: 20px;
`;

/* Popular types of venues */
const PopularSection = styled.View`
  margin: 0 20px;
`;

const PopularTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 2px;
`;

const PopularSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
`;

const PopularScroll = styled.ScrollView``;

const TypeCard = styled.View`
  width: 200px;
  height: 280px;
  border-radius: 12px;
  margin-right: 16px;
  overflow: hidden;
`;

const TypeImage = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const BlackOverlay = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  padding: 12px;
  opacity: 0.8;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TypeName = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 700;
`;

const SeeAllButton = styled.TouchableOpacity`
  border: 1px solid #fff;
  border-radius: 16px;
  padding: 4px 10px;
`;

const SeeAllText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
`;

/* Guest Count Block */
const GuestCountBlock = styled.View`
  background-color: #e5f4ff;
  padding: 20px;
  margin: 20px;
  border-radius: 12px;
`;

const GuestCountTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

const GuestCountSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
`;

const SizeBoxesContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const SizeBox = styled.TouchableOpacity`
  width: 48%;
  background-color: #fff;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
`;

const SizeBoxText = styled.Text`
  font-size: 14px;
  color: #000;
`;

/* 2-column vendor categories */
const VendorCategoriesSection = styled.View`
  margin: 0 20px 20px;
`;

const VendorCategoriesTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 2px;
`;

const VendorCategoriesSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
`;

const TwoColumnList = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const TwoColumnItem = styled.TouchableOpacity`
  width: 48%;
  border-radius: 8px;
  background-color: #fff;
  margin-bottom: 14px;
  overflow: hidden;
  align-items: center;
`;

const TwoColumnIcon = styled.Image`
  width: 100%;
  height: 80px;
  background-color: #ccc;
`;

const TwoColumnLabel = styled.Text`
  font-size: 14px;
  color: #000;
  padding: 8px 0;
`;

/* Explore all categories list */
const ExploreAllCategoriesTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 20px 10px;
`;

const AllCategoriesList = styled.View`
  margin: 0 20px;
  border-top-width: 1px;
  border-top-color: #ccc;
  padding-top: 10px;
`;

const CategoryRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const CategoryRowIcon = styled.Image`
  width: 18px;
  height: 18px;
  tint-color: #333;
  margin-right: 10px;
`;

const CategoryRowLabel = styled.Text`
  font-size: 14px;
  color: #000;
`;

const ImageCreditsLink = styled.Text`
  font-size: 14px;
  color: #0066cc;
  text-align: center;
  margin-bottom: 20px;
`;
