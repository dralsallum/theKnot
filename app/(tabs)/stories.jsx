import React, { useState, useEffect } from "react";
import {
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
} from "react-native";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { publicRequest } from "../../requestMethods";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  addProduct,
  removeProduct,
  clearFeedbackIcon,
} from "../redux/registrySlice";

/* --------------------------------------------------------------------------------
   GLOBAL CONSTANTS
-------------------------------------------------------------------------------- */
const windowWidth = Dimensions.get("window").width;
const placeholder = "https://via.placeholder.com/400x350/f5f5f5/000000";

/* --------------------------------------------------------------------------------
   STYLED COMPONENTS
-------------------------------------------------------------------------------- */

// Top-level container
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

// Search icon at top-right
const SearchIcon = styled.View`
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 10;
`;

// Registry Title
const RegistryTitle = styled.Text`
  font-size: 38px;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
`;

/* Tabs */
const TabsContainer = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;
const TabsScroll = styled.ScrollView`
  flex-direction: row;
`;
const Tab = styled.TouchableOpacity`
  padding-vertical: 15px;
  padding-horizontal: 20px;
  position: relative;
`;
const TabText = styled.Text`
  font-size: 16px;
  color: ${(props) => (props.active ? "#000" : "#666")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
`;
const TabIndicator = styled.View`
  position: absolute;
  bottom: 0;
  left: 20px;
  height: 3px;
  width: 100%;
  background-color: #000;
  display: ${(props) => (props.active ? "flex" : "none")};
`;

/* Main scroll container for content */
const ContentContainer = styled.ScrollView`
  flex: 1;
`;

/* Divider line */
const DividerLine = styled.View`
  height: 1px;
  background-color: #e0e0e0;
  margin-vertical: 20px;
`;

/* Section Title */
const SectionTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
`;

/* Category Layout */
const CategoryRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 20px;
`;
const CategoryItem = styled.View`
  align-items: center;
  width: 30%;
`;
const CategoryImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 10px;
`;
const CategoryText = styled.Text`
  text-align: center;
  font-size: 16px;
  font-weight: bold;
`;

/* Collections Banner */
const CollectionBanner = styled.Image`
  width: ${windowWidth - 40}px;
  height: 250px;
  margin-horizontal: 20px;
  margin-bottom: 20px;
`;

/* Essentials Section */
const EssentialsTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-horizontal: 20px;
  margin-top: 15px;
`;
const EssentialsSubtitle = styled.Text`
  font-size: 18px;
  margin-horizontal: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  line-height: 24px;
`;

/* Cards (two side-by-side) */
const CardContainer = styled.View`
  flex-direction: row;
  padding-horizontal: 10px;
  margin-bottom: 30px;
`;
const Card = styled.View`
  background-color: #e6f2f7;
  border-radius: 10px;
  width: ${(windowWidth - 60) / 2}px;
  height: 230px;
  margin-horizontal: 10px;
  overflow: hidden;
`;
const CardImage = styled.Image`
  width: 100%;
  height: 160px;
`;
const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin: 10px;
`;

/* Horizontal Scroll containers */
const HorizontalScroll = styled.ScrollView`
  margin-bottom: 20px;
`;
const SlideItem = styled.View`
  align-items: center;
  width: 120px;
  margin-horizontal: 10px;
`;

/* Price Section */
const PriceSection = styled.View`
  margin-horizontal: 20px;
`;
const PriceSectionTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 15px;
`;
const PriceText = styled.Text`
  font-size: 18px;
  line-height: 28px;
`;
const PriceHighlight = styled.Text`
  font-weight: bold;
`;

/* Price Range */
const PriceRangeContainer = styled.ScrollView`
  margin-vertical: 15px;
`;
const PriceRangeCard = styled.View`
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  padding: 15px;
  margin-right: 15px;
  width: 250px;
`;
const PriceRangeContainer2 = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-horizontal: 20px;
  margin-top: 15px;
  margin-bottom: 25px;
`;
const PriceRangeButton = styled.TouchableOpacity`
  border-width: 2px;
  border-color: ${(props) => (props.active ? "#000" : "#ccc")};
  border-radius: 20px;
  padding-vertical: 8px;
  padding-horizontal: 12px;
`;
const PriceRangeText = styled.Text`
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
`;

/* Product Card for horizontal lists (Overview, Category view) */
const ProductCard = styled.View`
  width: 180px;
  margin-horizontal: 10px;
`;
const ProductImageContainer = styled.View`
  position: relative;
  margin-bottom: 10px;
`;
const ProductImage = styled.Image`
  width: 180px;
  height: 180px;
  border-radius: 8px;
  resize-mode: cover;
`;
const ProductManageImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 8px;
  resize-mode: cover;
`;
const AddButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #ec4899;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const BrandText = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 4px;
`;
const ProductTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  line-height: 22px;
  margin-bottom: 6px;
`;
const ProductPrice = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

/* "See more" button */
const SeeMoreButton = styled.TouchableOpacity`
  border-width: 2px;
  border-color: #ec4899;
  border-radius: 40px;
  padding-vertical: 15px;
  justify-content: center;
  align-items: center;
  margin-horizontal: 20px;
  margin-bottom: 40px;
`;
const SeeMoreText = styled.Text`
  color: #ec4899;
  font-size: 22px;
  font-weight: bold;
`;

/* Section Divider (thicker) */
const SectionDivider = styled.View`
  height: 8px;
  background-color: #f3f4f6;
  margin-vertical: 25px;
`;

/* Footer */
const FooterContainer = styled.View`
  padding-horizontal: 20px;
  padding-vertical: 30px;
  background-color: #f9f9f9;
`;
const FooterText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  line-height: 24px;
`;
const FooterLinks = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`;
const FooterLink = styled.TouchableOpacity`
  margin-horizontal: 10px;
`;
const FooterLinkText = styled.Text`
  color: #ec4899;
  font-weight: bold;
`;

/* Loading & Error states */
const LoadingContainer = styled.View`
  padding: 20px;
  align-items: center;
`;
const ErrorContainer = styled.View`
  padding: 20px;
  align-items: center;
`;
const ErrorText = styled.Text`
  color: #ec4899;
  font-size: 16px;
`;

/* Cash Funds section */
const CashFundContainer = styled.View`
  margin-horizontal: 20px;
  margin-bottom: 40px;
  border: 2px dashed #ec4899;
  border-radius: 16px;
  padding: 20px;
  background-color: #fff8fb;
`;
const CashFundTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #ec4899;
  margin-bottom: 15px;
  text-align: center;
`;
const CashFundDescription = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: #444;
  margin-bottom: 20px;
  text-align: center;
`;
const CashFundRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const CashFundCard = styled.TouchableOpacity`
  width: 48%;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  margin-bottom: 15px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;
const CashFundCardIcon = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #f5e1eb;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;
const CashFundCardText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
const CreateButton = styled.TouchableOpacity`
  background-color: #ec4899;
  border-radius: 40px;
  padding-vertical: 15px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const CreateButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-left: 8px;
`;

/* Cash Fund Modal */
const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;
const ModalContent = styled.View`
  width: 90%;
  background-color: white;
  border-radius: 20px;
  padding: 25px;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
`;
const ModalTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ec4899;
`;
const InputLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  align-self: flex-start;
  margin-bottom: 5px;
  color: #333;
`;
const StyledInput = styled.TextInput`
  width: 100%;
  padding: 12px;
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 15px;
`;
const ModalButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;
const CancelButton = styled.TouchableOpacity`
  padding-vertical: 12px;
  padding-horizontal: 20px;
  border-radius: 8px;
  background-color: #f2f2f2;
  width: 48%;
  align-items: center;
`;
const SaveButton = styled.TouchableOpacity`
  padding-vertical: 12px;
  padding-horizontal: 20px;
  border-radius: 8px;
  background-color: #ec4899;
  width: 48%;
  align-items: center;
`;
const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.light ? "white" : "#333")};
`;

/* Created Cash Funds */
const CreatedFundItem = styled.View`
  background-color: white;
  border-radius: 12px;
  margin-bottom: 15px;
  padding: 15px;
  flex-direction: row;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
`;
const FundImageContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: #f5e1eb;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;
const FundDetailsContainer = styled.View`
  flex: 1;
  justify-content: center;
`;
const FundTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
`;
const FundGoal = styled.Text`
  font-size: 16px;
  color: #ec4899;
  font-weight: bold;
  margin-bottom: 6px;
`;
const FundDescription = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
`;
const ProgressContainer = styled.View`
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 6px;
`;
const ProgressBar = styled.View`
  height: 100%;
  width: ${(props) => props.progress || "0%"};
  background-color: #ec4899;
`;

/* Track Gifts */
const TrackGiftsMessage = styled.Text`
  font-size: 20px;
  text-align: center;
  margin: 20px;
  line-height: 32px;
  align-self: center;
`;
const ShareButton = styled.TouchableOpacity`
  background-color: #ec4899;
  border-radius: 40px;
  padding-vertical: 15px;
  justify-content: center;
  align-items: center;
  margin: 10px 40px;
  align-self: center;
  width: 80%;
`;
const ShareButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

/* Manage Registry */
const GiftAdvisorContainer = styled.View`
  padding: 10px 20px;
`;
const GiftAdvisorTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
`;
const GiftAdvisorText = styled.Text`
  font-size: 18px;
  line-height: 26px;
  margin-bottom: 15px;
`;
const GuestCount = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-decoration: underline;
`;
const PriceRangeHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const PriceRangeTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
const ShopButton = styled.TouchableOpacity`
  background-color: white;
  border: 2px solid #0070f3;
  border-radius: 20px;
  padding-horizontal: 10px;
  padding-vertical: 4px;
`;
const ShopButtonText = styled.Text`
  color: #0070f3;
  font-size: 16px;
  font-weight: bold;
`;
const ProgressInfo = styled.Text`
  font-size: 16px;
  margin-vertical: 10px;
`;
const ProgressBarContainer = styled.View`
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  width: 100%;
`;
const Progress = styled.View`
  height: 100%;
  width: ${(props) => props.width || "5%"};
  background-color: #0070f3;
  border-radius: 5px;
`;
const GiftListContainer = styled.View`
  padding: 10px 20px;
`;
const GiftListHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const GiftListTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
`;
const GiftItemCount = styled.Text`
  font-size: 18px;
  color: #666;
`;
const GiftItemStatus = styled.Text`
  font-size: 16px;
  color: #666;
`;

// Grid Wrapper for the added products in Manage Registry
const ProductGridWrapper = styled.View`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

// Each item in the Manage Registry grid
const ProductGridItem = styled.View`
  width: 48%;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #fff;
  padding: 10px;
  position: relative;
  overflow: hidden;
`;

const RemoveButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #ec4899;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

/* Navigation Items (for clickable images/text) */
const NavItemButton = styled.TouchableOpacity`
  align-items: center;
`;

/* Settings screen */
const SettingsContentContainer = styled.View`
  padding: 20px;
  background-color: #fff;
  flex: 1;
`;
const SettingsSection = styled.View`
  padding-vertical: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
  position: relative;
`;
const SettingsSectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #000;
`;
const SettingsSectionSubtitle = styled.Text`
  font-size: 16px;
  color: #666;
  margin-right: 50px;
`;
const EditLink = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  top: 20px;
`;
const EditLinkText = styled.Text`
  color: #007aff;
  font-weight: bold;
  font-size: 16px;
`;
const LinkBox = styled.View`
  background-color: #f7f7f7;
  border-radius: 6px;
  padding: 10px;
  margin-vertical: 10px;
`;
const LinkText = styled.Text`
  font-size: 16px;
  color: #333;
`;
const ShareLinkButton = styled.TouchableOpacity`
  background-color: transparent;
  border: 2px solid #ec4899;
  border-radius: 40px;
  padding-vertical: 12px;
  padding-horizontal: 24px;
  align-self: flex-start;
  margin-top: 10px;
`;
const ShareLinkText = styled.Text`
  color: #ec4899;
  font-size: 16px;
  font-weight: bold;
`;

/* --------------------------------------------------------------------------------
   HELPER COMPONENTS
-------------------------------------------------------------------------------- */

// Category grid
const CategoryGrid = ({ categories, columnsPerRow, onCategoryPress }) => {
  const renderCategoryRows = () => {
    const rows = [];
    for (let i = 0; i < categories.length; i += columnsPerRow) {
      const rowCategories = categories.slice(i, i + columnsPerRow);
      rows.push(
        <CategoryRow key={`row-${i}`}>
          {rowCategories.map((category, index) => (
            <CategoryItem key={`cat-${i + index}`}>
              <TouchableOpacity onPress={() => onCategoryPress(category.name)}>
                <CategoryImage source={{ uri: category.image }} />
                <CategoryText>{category.name}</CategoryText>
              </TouchableOpacity>
            </CategoryItem>
          ))}
        </CategoryRow>
      );
    }
    return rows;
  };

  return <>{renderCategoryRows()}</>;
};

// Horizontal items (slides)
const HorizontalItems = ({ items, renderItem }) => {
  return (
    <HorizontalScroll
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 5 }}
    >
      {items.map((item, index) => renderItem(item, index))}
    </HorizontalScroll>
  );
};

/* --------------------------------------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------------------------------------- */
const RegistryApp = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Manage Registry", "Track Gifts", "Settings"];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { addedProducts, feedbackIcons } = useSelector(
    (state) => state.registry
  );

  const [activeRange, setActiveRange] = useState("$0-$49");

  // Cash Fund States
  const [modalVisible, setModalVisible] = useState(false);
  const [cashFunds, setCashFunds] = useState([]);
  const [newFund, setNewFund] = useState({
    title: "",
    description: "",
    goal: "",
    type: "",
  });

  // Category handling
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState(null);

  // Categories (sample data)
  const categories = [
    {
      name: "Home",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/B7EAF36E-CF69-4350-94BB-71A8EC7052AE.png",
    },
    {
      name: "Lifestyle",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/2EFCC5A9-29E4-4D49-A384-EB631A6CC02C.jpeg",
    },
    {
      name: "Bed & Rooms",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/99B3B494-731F-48CF-8482-3D175CF01846.jpeg",
    },
    {
      name: "Kitchen",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/AA3C0006-DA87-45C3-B15B-0AC943899150.jpeg",
    },
    {
      name: "Tabletop",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/043EAB86-3D49-4F77-9A95-A54EA08AB2AC.png",
    },
    {
      name: "Bathroom",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/71F63128-CBC7-4E3D-9C05-C97691F96B9F.png",
    },
  ];
  const slides = [
    {
      name: "Serveware",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/20FD9A0A-48E5-4668-AA76-51897022A4A8.png",
    },
    {
      name: "Bakeware",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/5052598F-9111-4AB1-80DC-67234A9E8861.png",
    },
    {
      name: "Smart Home",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/DF6991CE-4597-46DE-AC27-3480AE7A774F.png",
    },
    {
      name: "Adventure Activities",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/D5C98280-9E38-48BF-9C8D-58059C277B84.png",
    },
    {
      name: "Decor",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/90F0336F-E445-4944-B521-294AC3AD9A13.png",
    },
  ];
  const priceRanges = ["$0-$49", "$50-$99", "$100-$149", "$150+"];

  // Fetch random products for "Overview"
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await publicRequest.get("/products");
      const allProducts = response.data;
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      const randomProducts = shuffled.slice(0, 4);
      setProducts(randomProducts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Tab switching
  const handleTabPress = (tab) => {
    setSelectedCategory(null);
    setActiveTab(tab);
  };

  // Price range
  const handlePriceRangeClick = (range) => {
    setActiveRange(range);
  };

  // Add product
  const handleAddProduct = (product) => {
    dispatch(addProduct(product));
    // Remove feedback icon after 1 second
    setTimeout(() => {
      dispatch(clearFeedbackIcon(product._id));
    }, 1000);
  };

  // Remove product
  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct(productId));
  };

  // Category press
  const handleCategoryPress = (catName) => {
    router.push({
      pathname: "/products",
      params: { category: catName },
    });
  };

  // Category back
  const handleCategoryBack = () => {
    setActiveTab("Overview");
    setSelectedCategory(null);
    setCategoryProducts([]);
  };

  // Cash Fund
  const handleFundTypeSelect = (type) => {
    setNewFund({ ...newFund, type });
    setModalVisible(true);
  };
  const handleCreateFund = () => {
    if (!newFund.title || !newFund.goal) {
      alert("Please enter a title and goal amount.");
      return;
    }
    const fund = {
      ...newFund,
      id: Date.now().toString(),
      collected: 0,
      progress: "0%",
    };
    setCashFunds([...cashFunds, fund]);
    setNewFund({
      title: "",
      description: "",
      goal: "",
      type: newFund.type,
    });
    setModalVisible(false);
  };

  // Render user's existing cash funds
  const renderCashFunds = () => {
    if (cashFunds.length === 0) return null;
    return (
      <>
        <SectionTitle>Your Cash Funds</SectionTitle>
        {cashFunds.map((fund) => (
          <CreatedFundItem key={fund.id}>
            <FundImageContainer>
              <Feather
                name={
                  {
                    Honeymoon: "umbrella",
                    "Home Down Payment": "home",
                    Experiences: "map",
                    Charity: "heart",
                  }[fund.type] || "dollar-sign"
                }
                size={36}
                color="#ec4899"
              />
            </FundImageContainer>
            <FundDetailsContainer>
              <FundTitle>{fund.title}</FundTitle>
              <FundGoal>${parseFloat(fund.goal).toLocaleString()}</FundGoal>
              <FundDescription>{fund.description}</FundDescription>
              <ProgressContainer>
                <ProgressBar progress={fund.progress} />
              </ProgressContainer>
            </FundDetailsContainer>
          </CreatedFundItem>
        ))}
      </>
    );
  };

  /* =========== RENDER SECTIONS =========== */
  const renderShopContent = () => {
    return (
      <>
        <SectionTitle>Browse by category</SectionTitle>
        <CategoryGrid
          categories={categories}
          columnsPerRow={3}
          onCategoryPress={handleCategoryPress}
        />

        <DividerLine />

        <SectionTitle>Shop our collections</SectionTitle>
        <NavItemButton>
          <CollectionBanner
            source={{
              uri: "https://alsallum.s3.eu-north-1.amazonaws.com/FF77B118-D858-4F67-872B-DAA9AF324B25.png",
            }}
            resizeMode="cover"
          />
        </NavItemButton>

        <EssentialsTitle>Wedding Registry Essentials</EssentialsTitle>
        <EssentialsSubtitle>
          Guests love buying them, you love receiving them. These
          frequently-purchased gifts are popular for a reason.
        </EssentialsSubtitle>

        <CardContainer>
          <NavItemButton>
            <Card>
              <CardImage
                source={{
                  uri: "https://alsallum.s3.eu-north-1.amazonaws.com/7A4FB89B-0B67-4D87-A0CA-96CE93520164.png",
                }}
              />
              <CardTitle>The Knot Registry Awards 2025</CardTitle>
            </Card>
          </NavItemButton>
          <NavItemButton>
            <Card>
              <CardImage
                source={{
                  uri: "https://alsallum.s3.eu-north-1.amazonaws.com/7A4FB89B-0B67-4D87-A0CA-96CE93520164.png",
                }}
              />
              <CardTitle>Most-Wanted Gifts</CardTitle>
            </Card>
          </NavItemButton>
        </CardContainer>

        <DividerLine />
        {renderCashFunds()}

        <SectionTitle>Couples are loving</SectionTitle>
        <HorizontalItems
          items={slides}
          renderItem={(item, index) => (
            <SlideItem key={`slide-${index}`}>
              <NavItemButton>
                <CategoryImage source={{ uri: item.image }} />
                <CategoryText>{item.name}</CategoryText>
              </NavItemButton>
            </SlideItem>
          )}
        />

        <DividerLine />

        {/* Price Section */}
        <PriceSection>
          <PriceSectionTitle>Popular gifts by price</PriceSectionTitle>
          <PriceText>
            You've added 0 gifts in the{" "}
            <PriceHighlight>{activeRange} price range</PriceHighlight>. We
            recommend adding <PriceHighlight>26 more gifts</PriceHighlight>.
          </PriceText>
        </PriceSection>

        <PriceRangeContainer2>
          {priceRanges.map((range) => (
            <PriceRangeButton
              key={range}
              active={activeRange === range}
              onPress={() => handlePriceRangeClick(range)}
            >
              <PriceRangeText active={activeRange === range}>
                {range}
              </PriceRangeText>
            </PriceRangeButton>
          ))}
        </PriceRangeContainer2>

        {/* Random products for the chosen price range */}
        <HorizontalScroll
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {products.map((product) => {
            const isShowingCheck = !!feedbackIcons[product._id];

            return (
              <ProductCard key={product._id}>
                <ProductImageContainer>
                  <ProductImage source={{ uri: product.img || placeholder }} />
                  <AddButton onPress={() => handleAddProduct(product)}>
                    <Feather
                      name={isShowingCheck ? "check" : "plus"}
                      size={24}
                      color="white"
                    />
                  </AddButton>
                </ProductImageContainer>
                <BrandText>{product.generic || "Brand"}</BrandText>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductPrice>SAR {product.price.toFixed(2)}</ProductPrice>
              </ProductCard>
            );
          })}
        </HorizontalScroll>
        <SeeMoreButton onPress={fetchProducts}>
          <SeeMoreText>See more</SeeMoreText>
        </SeeMoreButton>

        <SectionDivider />

        {/* Cash Funds Box */}
        <CashFundContainer>
          <CashFundTitle>Add Cash Funds to Your Registry</CashFundTitle>
          <CashFundDescription>
            Let your guests contribute to your dreams! Create cash funds for
            your honeymoon, home down payment, or anything else that matters to
            you.
          </CashFundDescription>

          <CashFundRow>
            {[
              { name: "Honeymoon", icon: "umbrella" },
              { name: "Home Down Payment", icon: "home" },
              { name: "Experiences", icon: "map" },
              { name: "Charity", icon: "heart" },
            ].map((type) => (
              <CashFundCard
                key={type.name}
                onPress={() => handleFundTypeSelect(type.name)}
              >
                <CashFundCardIcon>
                  <Feather name={type.icon} size={30} color="#ec4899" />
                </CashFundCardIcon>
                <CashFundCardText>{type.name}</CashFundCardText>
              </CashFundCard>
            ))}
          </CashFundRow>

          <CreateButton onPress={() => setModalVisible(true)}>
            <Feather name="plus-circle" size={24} color="white" />
            <CreateButtonText>Create Custom Cash Fund</CreateButtonText>
          </CreateButton>
        </CashFundContainer>

        <FooterContainer>
          <FooterText>
            Your wedding registry helps guests find the perfect gift. Add items
            you'll love and use for years to come.
          </FooterText>
          <FooterLinks>
            <FooterLink>
              <FooterLinkText>FAQ</FooterLinkText>
            </FooterLink>
            <FooterLink>
              <FooterLinkText>Registry Tips</FooterLinkText>
            </FooterLink>
            <FooterLink>
              <FooterLinkText>Support</FooterLinkText>
            </FooterLink>
          </FooterLinks>
        </FooterContainer>
      </>
    );
  };

  const renderCategoryView = () => {
    return (
      <>
        <SectionTitle style={{ marginLeft: 20 }}>
          {selectedCategory} Products
        </SectionTitle>

        <TouchableOpacity
          onPress={handleCategoryBack}
          style={{ marginLeft: 20, marginBottom: 10, flexDirection: "row" }}
        >
          <Feather name="arrow-left" size={24} color="black" />
          <Text style={{ marginLeft: 5, fontSize: 16 }}>Back to Overview</Text>
        </TouchableOpacity>

        {categoryProducts.length === 0 && !catLoading && !catError && (
          <Text style={{ marginLeft: 20, color: "#666" }}>
            No products found for {selectedCategory}.
          </Text>
        )}

        <HorizontalScroll
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {catLoading ? (
            <LoadingContainer>
              <ActivityIndicator size="large" color="#ec4899" />
            </LoadingContainer>
          ) : catError ? (
            <ErrorContainer>
              <ErrorText>{catError}</ErrorText>
            </ErrorContainer>
          ) : (
            categoryProducts.map((product) => {
              const isCheck = !!feedbackIcons[product._id];
              return (
                <ProductCard key={product._id}>
                  <NavItemButton>
                    <ProductImageContainer>
                      <ProductImage
                        source={{
                          uri:
                            product.img ||
                            "https://via.placeholder.com/400x350/f5f5f5/000000",
                        }}
                      />
                      <AddButton onPress={() => handleAddProduct(product)}>
                        <Feather
                          name={isCheck ? "check" : "plus"}
                          size={24}
                          color="white"
                        />
                      </AddButton>
                    </ProductImageContainer>
                  </NavItemButton>
                  <BrandText>{product.generic || "Brand"}</BrandText>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                </ProductCard>
              );
            })
          )}
        </HorizontalScroll>
      </>
    );
  };

  const renderTrackGiftsContent = () => {
    return (
      <>
        <TrackGiftsMessage>
          Track guests' gift purchases and cash fund contributions here.
        </TrackGiftsMessage>
        <ShareButton>
          <ShareButtonText>Share Your Registry</ShareButtonText>
        </ShareButton>
      </>
    );
  };

  const renderManageRegistryContent = () => {
    const lowPriceProgress = addedProducts.filter((p) => p.price < 50).length;
    const lowPriceProgressPercent = `${Math.min(
      (lowPriceProgress / 26) * 100,
      100
    )}%`;

    const midPriceProgress = addedProducts.filter(
      (p) => p.price >= 50 && p.price < 100
    ).length;
    const midPriceProgressPercent = `${Math.min(
      (midPriceProgress / 31) * 100,
      100
    )}%`;

    return (
      <>
        <GiftAdvisorContainer>
          <GiftAdvisorTitle>Gift Advisor</GiftAdvisorTitle>
          <GiftAdvisorText>
            Based on your gift count of <GuestCount>51-100 guests</GuestCount>,
            we've suggested a gift total for each price range.
          </GiftAdvisorText>

          <PriceRangeContainer
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 5 }}
          >
            <PriceRangeCard>
              <PriceRangeHeader>
                <PriceRangeTitle>$0 - $49 gifts</PriceRangeTitle>
                <ShopButton>
                  <ShopButtonText>Shop</ShopButtonText>
                </ShopButton>
              </PriceRangeHeader>
              <ProgressInfo>{lowPriceProgress} of 26 added</ProgressInfo>
              <ProgressBarContainer>
                <Progress style={{ width: lowPriceProgressPercent }} />
              </ProgressBarContainer>
            </PriceRangeCard>

            <PriceRangeCard>
              <PriceRangeHeader>
                <PriceRangeTitle>$50 - $99 gifts</PriceRangeTitle>
                <ShopButton>
                  <ShopButtonText>Shop</ShopButtonText>
                </ShopButton>
              </PriceRangeHeader>
              <ProgressInfo>{midPriceProgress} of 31 added</ProgressInfo>
              <ProgressBarContainer>
                <Progress style={{ width: midPriceProgressPercent }} />
              </ProgressBarContainer>
            </PriceRangeCard>

            <PriceRangeCard>
              <PriceRangeHeader>
                <PriceRangeTitle>$100 - $149 gifts</PriceRangeTitle>
                <ShopButton>
                  <ShopButtonText>Shop</ShopButtonText>
                </ShopButton>
              </PriceRangeHeader>
              <ProgressInfo>0 of 18 added</ProgressInfo>
              <ProgressBarContainer>
                <Progress style={{ width: "0%" }} />
              </ProgressBarContainer>
            </PriceRangeCard>
          </PriceRangeContainer>
        </GiftAdvisorContainer>

        <DividerLine />

        <GiftListContainer>
          <GiftListHeader>
            <GiftListTitle>Gifts</GiftListTitle>
            <GiftItemCount>
              {addedProducts.length} item
              {addedProducts.length !== 1 ? "s" : ""}
            </GiftItemCount>
          </GiftListHeader>

          {addedProducts.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
                marginTop: 30,
                fontSize: 16,
                color: "#666",
              }}
            >
              No products added.
            </Text>
          ) : (
            <ProductGridWrapper>
              {addedProducts.map((product) => (
                <ProductGridItem key={product._id}>
                  <ProductImageContainer>
                    <ProductManageImage
                      source={{
                        uri: product.img || placeholder,
                      }}
                    />
                    <RemoveButton
                      onPress={() => handleRemoveProduct(product._id)}
                    >
                      <Feather name="minus" size={24} color="#fff" />
                    </RemoveButton>
                  </ProductImageContainer>
                  <BrandText>{product.generic || "Brand"}</BrandText>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductPrice>SAR {product.price.toFixed(2)}</ProductPrice>
                  <GiftItemStatus>0 of 1 Purchased</GiftItemStatus>
                </ProductGridItem>
              ))}
            </ProductGridWrapper>
          )}
        </GiftListContainer>
      </>
    );
  };

  const renderSettingsContent = () => {
    return (
      <SettingsContentContainer>
        <SettingsSection>
          <SettingsSectionTitle>Your Registry Page</SettingsSectionTitle>
          <LinkBox>
            <LinkText>https://registry.theknot.com/saud-alsallum...</LinkText>
          </LinkBox>
          <ShareLinkButton>
            <ShareLinkText>Share Link</ShareLinkText>
          </ShareLinkButton>
        </SettingsSection>

        <SettingsSection>
          <SettingsSectionTitle>Note to Guests</SettingsSectionTitle>
          <SettingsSectionSubtitle>
            Share extra details, or say a quick "thanks!" in advance.
          </SettingsSectionSubtitle>
          <EditLink>
            <EditLinkText>Edit</EditLinkText>
          </EditLink>
        </SettingsSection>

        <SettingsSection>
          <SettingsSectionTitle>Your Shipping Address</SettingsSectionTitle>
          <SettingsSectionSubtitle>
            Where should we ship gifts that you’ve added from The Knot?
          </SettingsSectionSubtitle>
          <EditLink>
            <EditLinkText>Edit</EditLinkText>
          </EditLink>
        </SettingsSection>

        <SettingsSection>
          <SettingsSectionTitle>Your Cash Funds</SettingsSectionTitle>
          <SettingsSectionSubtitle>
            Tell us where to send your cash gifts so guests can easily
            contribute.
          </SettingsSectionSubtitle>
          <EditLink>
            <EditLinkText>Edit</EditLinkText>
          </EditLink>
        </SettingsSection>
      </SettingsContentContainer>
    );
  };

  // Master function to pick which content to render
  const renderContent = () => {
    // If we're specifically in "CategoryView"
    if (activeTab === "CategoryView" && selectedCategory) {
      return renderCategoryView();
    }
    switch (activeTab) {
      case "Overview":
        return renderShopContent();
      case "Manage Registry":
        return renderManageRegistryContent();
      case "Track Gifts":
        return renderTrackGiftsContent();
      case "Settings":
        return renderSettingsContent();
      default:
        return renderShopContent();
    }
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />

      {/* Search Icon */}
      <SearchIcon>
        <Feather name="search" size={24} color="black" />
      </SearchIcon>

      {/* Main Title */}
      <RegistryTitle>Registry</RegistryTitle>

      {/* Tabs */}
      <TabsContainer>
        <TabsScroll horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <Tab
              key={tab}
              onPress={() => handleTabPress(tab)}
              active={activeTab === tab}
            >
              <TabText active={activeTab === tab}>{tab}</TabText>
              {activeTab === tab && <TabIndicator active />}
            </Tab>
          ))}
        </TabsScroll>
      </TabsContainer>

      {/* Content */}
      <ContentContainer>{renderContent()}</ContentContainer>

      {/* Cash Fund Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <ModalTitle>Create Cash Fund</ModalTitle>

            <InputLabel>Title</InputLabel>
            <StyledInput
              placeholder="Fund title (e.g. Dream Honeymoon)"
              value={newFund.title}
              onChangeText={(text) => setNewFund({ ...newFund, title: text })}
            />

            <InputLabel>Goal Amount ($)</InputLabel>
            <StyledInput
              placeholder="Enter amount (e.g. 2000)"
              keyboardType="numeric"
              value={newFund.goal}
              onChangeText={(text) => setNewFund({ ...newFund, goal: text })}
            />

            <InputLabel>Description (Optional)</InputLabel>
            <StyledInput
              placeholder="Describe what this fund is for..."
              multiline
              numberOfLines={3}
              value={newFund.description}
              onChangeText={(text) =>
                setNewFund({ ...newFund, description: text })
              }
            />

            <ModalButtonsContainer>
              <CancelButton onPress={() => setModalVisible(false)}>
                <ButtonText>Cancel</ButtonText>
              </CancelButton>
              <SaveButton onPress={handleCreateFund}>
                <ButtonText light>Create Fund</ButtonText>
              </SaveButton>
            </ModalButtonsContainer>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default RegistryApp;
