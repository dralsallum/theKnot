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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  addProduct,
  removeProduct,
  clearFeedbackIcon,
} from "../redux/registrySlice";
const Cart = require("../../assets/icons/cart.png");
const House = require("../../assets/images/house.png");
const Lifestyle = require("../../assets/images/lifestyle.jpeg");
const Bathroom = require("../../assets/images/bathroomRoom.png");
const Bedroom = require("../../assets/images/bedRoom.jpeg");
const FoodTable = require("../../assets/images/foodTable.png");
const kitchen = require("../../assets/images/kitchenMain.jpeg"); // keep lowercase if you need it that way
const Popular = require("../../assets/images/popularGift.png");
const Essential = require("../../assets/images/essential.png");

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
  direction: rtl;
`;

// Search icon at top-right
const CartIcon = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 10;
`;

const ImagePro = styled.Image`
  width: 40px;
  height: 40px;
`;

// Registry Title
const RegistryTitle = styled.Text`
  font-size: 38px;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  text-align: left;
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
  margin-top: 15px;
  margin-bottom: 20px;
  text-align: left;
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
  text-align: left;
`;
const EssentialsSubtitle = styled.Text`
  font-size: 18px;
  margin-horizontal: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  line-height: 24px;
  text-align: left;
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
  text-align: left;
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
  text-align: left;
`;
const PriceText = styled.Text`
  font-size: 18px;
  line-height: 28px;
  text-align: left;
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
  text-align: left;
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
  text-align: left;
`;
const ProductTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  line-height: 22px;
  margin-bottom: 6px;
  text-align: left;
`;
const ProductPrice = styled.Text`
  font-size: 20px;
  font-weight: bold;
  text-align: left;
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
  text-align: left;
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
  text-align: left;
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
  text-align: left;
`;
const InputLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  align-self: flex-start;
  margin-bottom: 5px;
  color: #333;
  text-align: left;
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
  text-align: left;
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
  text-align: left;
`;
const FundGoal = styled.Text`
  font-size: 16px;
  color: #ec4899;
  font-weight: bold;
  margin-bottom: 6px;
  text-align: left;
`;
const FundDescription = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
  text-align: left;
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
  text-align: left;
`;
const GiftAdvisorText = styled.Text`
  font-size: 18px;
  line-height: 26px;
  margin-bottom: 15px;
  text-align: left;
`;
const GuestCount = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-decoration: underline;
  text-align: left;
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
  text-align: left;
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
  text-align: left;
`;
const ProgressInfo = styled.Text`
  font-size: 16px;
  margin-vertical: 10px;
  text-align: left;
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
  text-align: left;
`;
const GiftItemCount = styled.Text`
  font-size: 18px;
  color: #666;
  text-align: left;
`;
const GiftItemStatus = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: left;
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
  text-align: left;
`;
const SettingsSectionSubtitle = styled.Text`
  font-size: 16px;
  color: #666;
  margin-right: 50px;
  text-align: left;
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
  text-align: left;
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
  text-align: left;
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
  text-align: left;
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
                <CategoryImage source={category.image} />
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
  const { productId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("نظرة عامة");
  const tabs = ["نظرة عامة", "إدارة السجل", "تتبع الهدايا", "الإعدادات"];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { addedProducts, feedbackIcons } = useSelector(
    (state) => state.registry
  );
  const [activeRange, setActiveRange] = useState("٠-٤٩ ريال");
  const [modalVisible, setModalVisible] = useState(false);
  const [cashFunds, setCashFunds] = useState([]);
  const [newFund, setNewFund] = useState({
    title: "",
    description: "",
    goal: "",
    type: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState(null);

  // Categories (sample data) - الفئات
  const categories = [
    {
      name: "المنزل",
      image: House,
    },
    {
      name: "نمط الحياة",
      image: Lifestyle,
    },
    {
      name: "السرير والغرف",
      image: Bedroom,
    },
    {
      name: "المطبخ",
      image: kitchen,
    },
    {
      name: "أدوات المائدة",
      image: FoodTable,
    },
    {
      name: "الحمام",
      image: Bathroom,
    },
  ];

  const slides = [
    {
      name: "أطباق التقديم",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/20FD9A0A-48E5-4668-AA76-51897022A4A8.png",
    },
    {
      name: "أدوات الخبز",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/5052598F-9111-4AB1-80DC-67234A9E8861.png",
    },
    {
      name: "المنزل الذكي",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/DF6991CE-4597-46DE-AC27-3480AE7A774F.png",
    },
    {
      name: "أنشطة المغامرة",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/D5C98280-9E38-48BF-9C8D-58059C277B84.png",
    },
    {
      name: "الديكور",
      image:
        "https://alsallum.s3.eu-north-1.amazonaws.com/90F0336F-E445-4944-B521-294AC3AD9A13.png",
    },
  ];

  const priceRanges = ["٠-٤٩ ريال", "٥٠-٩٩ ريال", "١٠٠-١٤٩ ريال", "١٥٠+ ريال"];

  const handleCart = () => {
    router.push("pay");
  };

  // Fetch random products for "Overview" - جلب منتجات عشوائية للنظرة العامة
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
      setError("فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Tab switching - تبديل التبويبات
  const handleTabPress = (tab) => {
    setSelectedCategory(null);
    setActiveTab(tab);
  };

  // Price range - نطاق الأسعار
  const handlePriceRangeClick = (range) => {
    setActiveRange(range);
  };

  // Add product - إضافة منتج
  const handleAddProduct = (product) => {
    dispatch(addProduct(product));
    // Remove feedback icon after 1 second
    setTimeout(() => {
      dispatch(clearFeedbackIcon(product._id));
    }, 1000);
  };

  // Remove product - إزالة منتج
  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct(productId));
  };

  // Category press - الضغط على الفئة
  const handleCategoryPress = (catName) => {
    router.push({
      pathname: "/products",
      params: { category: catName },
    });
  };

  // Category back - العودة من الفئة
  const handleCategoryBack = () => {
    setActiveTab("نظرة عامة");
    setSelectedCategory(null);
    setCategoryProducts([]);
  };

  // Cash Fund - الصندوق النقدي
  const handleFundTypeSelect = (type) => {
    setNewFund({ ...newFund, type });
    setModalVisible(true);
  };

  const handleCreateFund = () => {
    if (!newFund.title || !newFund.goal) {
      alert("يرجى إدخال العنوان ومبلغ الهدف.");
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

  // Render user's existing cash funds - عرض الصناديق النقدية الموجودة للمستخدم
  const renderCashFunds = () => {
    if (cashFunds.length === 0) return null;
    return (
      <>
        <SectionTitle>صناديقك النقدية</SectionTitle>
        {cashFunds.map((fund) => (
          <CreatedFundItem key={fund.id}>
            <FundImageContainer>
              <Feather
                name={
                  {
                    "شهر العسل": "umbrella",
                    "دفعة أولى للمنزل": "home",
                    التجارب: "map",
                    الخيرية: "heart",
                  }[fund.type] || "dollar-sign"
                }
                size={36}
                color="#ec4899"
              />
            </FundImageContainer>
            <FundDetailsContainer>
              <FundTitle>{fund.title}</FundTitle>
              <FundGoal>{parseFloat(fund.goal).toLocaleString()} ريال</FundGoal>
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

  /* =========== أقسام العرض =========== */
  const renderShopContent = () => {
    return (
      <>
        <SectionTitle>تصفح حسب الفئة</SectionTitle>
        <CategoryGrid
          categories={categories}
          columnsPerRow={3}
          onCategoryPress={handleCategoryPress}
        />

        <DividerLine />

        <SectionTitle>تسوق من مجموعاتنا</SectionTitle>
        <NavItemButton>
          <CollectionBanner source={Popular} resizeMode="cover" />
        </NavItemButton>

        <EssentialsTitle>أساسيات سجل الزواج</EssentialsTitle>
        <EssentialsSubtitle>
          الضيوف يحبون شراءها، وأنتم تحبون استلامها. هذه الهدايا كثيرة الشراء
          محبوبة لسبب وجيه.
        </EssentialsSubtitle>

        <CardContainer>
          <NavItemButton>
            <Card>
              <CardImage source={Essential} />
              <CardTitle>جوائز سجل العقدة ٢٠٢٥</CardTitle>
            </Card>
          </NavItemButton>
          <NavItemButton>
            <Card>
              <CardImage source={Essential} />
              <CardTitle>الهدايا الأكثر طلباً</CardTitle>
            </Card>
          </NavItemButton>
        </CardContainer>

        <DividerLine />
        {renderCashFunds()}

        <SectionTitle>الأزواج يحبون</SectionTitle>
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

        {/* قسم الأسعار */}
        <PriceSection>
          <PriceSectionTitle>الهدايا الشائعة حسب السعر</PriceSectionTitle>
          <PriceText>
            لقد أضفت ٠ هدايا في فئة
            <PriceHighlight>{activeRange}</PriceHighlight>. نوصي بإضافة
            <PriceHighlight>٢٦ هدية إضافية</PriceHighlight>.
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

        {/* منتجات عشوائية للفئة السعرية المختارة */}
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
                <BrandText>{product.generic || "العلامة التجارية"}</BrandText>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductPrice>{product.price.toFixed(2)} ريال</ProductPrice>
              </ProductCard>
            );
          })}
        </HorizontalScroll>
        <SeeMoreButton onPress={fetchProducts}>
          <SeeMoreText>عرض المزيد</SeeMoreText>
        </SeeMoreButton>

        <SectionDivider />

        {/* صندوق الصناديق النقدية */}
        <CashFundContainer>
          <CashFundTitle>أضف الصناديق النقدية إلى سجلك</CashFundTitle>
          <CashFundDescription>
            دع ضيوفك يساهمون في أحلامك! أنشئ صناديق نقدية لشهر العسل، الدفعة
            الأولى للمنزل، أو أي شيء آخر مهم بالنسبة لك.
          </CashFundDescription>

          <CashFundRow>
            {[
              { name: "شهر العسل", icon: "umbrella" },
              { name: "دفعة أولى للمنزل", icon: "home" },
              { name: "التجارب", icon: "map" },
              { name: "الخيرية", icon: "heart" },
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
            <CreateButtonText>إنشاء صندوق نقدي مخصص</CreateButtonText>
          </CreateButton>
        </CashFundContainer>

        <FooterContainer>
          <FooterText>
            سجل الزواج الخاص بك يساعد الضيوف في العثور على الهدية المثالية. أضف
            الأشياء التي ستحبها وتستخدمها لسنوات قادمة.
          </FooterText>
          <FooterLinks>
            <FooterLink>
              <FooterLinkText>الأسئلة الشائعة</FooterLinkText>
            </FooterLink>
            <FooterLink>
              <FooterLinkText>نصائح السجل</FooterLinkText>
            </FooterLink>
            <FooterLink>
              <FooterLinkText>الدعم</FooterLinkText>
            </FooterLink>
          </FooterLinks>
        </FooterContainer>
      </>
    );
  };

  const renderCategoryView = () => {
    return (
      <>
        <SectionTitle style={{ marginRight: 20 }}>
          منتجات {selectedCategory}
        </SectionTitle>

        <TouchableOpacity
          onPress={handleCategoryBack}
          style={{ marginRight: 20, marginBottom: 10, flexDirection: "row" }}
        >
          <Feather name="arrow-right" size={24} color="black" />
          <Text style={{ marginRight: 5, fontSize: 16 }}>
            العودة إلى النظرة العامة
          </Text>
        </TouchableOpacity>

        {categoryProducts.length === 0 && !catLoading && !catError && (
          <Text style={{ marginRight: 20, color: "#666" }}>
            لا توجد منتجات لفئة {selectedCategory}.
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
                  <BrandText>{product.generic || "العلامة التجارية"}</BrandText>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductPrice>{product.price.toFixed(2)} ريال</ProductPrice>
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
          تتبع مشتريات الضيوف من الهدايا ومساهمات الصناديق النقدية هنا.
        </TrackGiftsMessage>
        <ShareButton>
          <ShareButtonText>شارك سجلك</ShareButtonText>
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
          <GiftAdvisorTitle>مستشار الهدايا</GiftAdvisorTitle>
          <GiftAdvisorText>
            بناءً على عدد الضيوف <GuestCount>٥١-١٠٠ ضيف</GuestCount>، اقترحنا
            إجمالي الهدايا لكل فئة سعرية.
          </GiftAdvisorText>

          <PriceRangeContainer
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 5 }}
          >
            <PriceRangeCard>
              <PriceRangeHeader>
                <PriceRangeTitle>هدايا ٠ - ٤٩ ريال</PriceRangeTitle>
                <ShopButton>
                  <ShopButtonText>تسوق</ShopButtonText>
                </ShopButton>
              </PriceRangeHeader>
              <ProgressInfo>تم إضافة {lowPriceProgress} من ٢٦</ProgressInfo>
              <ProgressBarContainer>
                <Progress style={{ width: lowPriceProgressPercent }} />
              </ProgressBarContainer>
            </PriceRangeCard>

            <PriceRangeCard>
              <PriceRangeHeader>
                <PriceRangeTitle>هدايا ٥٠ - ٩٩ ريال</PriceRangeTitle>
                <ShopButton>
                  <ShopButtonText>تسوق</ShopButtonText>
                </ShopButton>
              </PriceRangeHeader>
              <ProgressInfo>تم إضافة {midPriceProgress} من ٣١</ProgressInfo>
              <ProgressBarContainer>
                <Progress style={{ width: midPriceProgressPercent }} />
              </ProgressBarContainer>
            </PriceRangeCard>

            <PriceRangeCard>
              <PriceRangeHeader>
                <PriceRangeTitle>هدايا ١٠٠ - ١٤٩ ريال</PriceRangeTitle>
                <ShopButton>
                  <ShopButtonText>تسوق</ShopButtonText>
                </ShopButton>
              </PriceRangeHeader>
              <ProgressInfo>تم إضافة ٠ من ١٨</ProgressInfo>
              <ProgressBarContainer>
                <Progress style={{ width: "0%" }} />
              </ProgressBarContainer>
            </PriceRangeCard>
          </PriceRangeContainer>
        </GiftAdvisorContainer>

        <DividerLine />

        <GiftListContainer>
          <GiftListHeader>
            <GiftListTitle>الهدايا</GiftListTitle>
            <GiftItemCount>
              {addedProducts.length} عنصر
              {addedProducts.length !== 1 ? "" : ""}
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
              لم يتم إضافة أي منتجات.
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
                  <BrandText>{product.generic || "العلامة التجارية"}</BrandText>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductPrice>{product.price.toFixed(2)} ريال</ProductPrice>
                  <GiftItemStatus>تم شراء ٠ من ١</GiftItemStatus>
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
          <SettingsSectionTitle>صفحة سجلك</SettingsSectionTitle>
          <LinkBox>
            <LinkText>https://registry.theknot.com/saud-alsallum...</LinkText>
          </LinkBox>
          <ShareLinkButton>
            <ShareLinkText>شارك الرابط</ShareLinkText>
          </ShareLinkButton>
        </SettingsSection>

        <SettingsSection>
          <SettingsSectionTitle>ملاحظة للضيوف</SettingsSectionTitle>
          <SettingsSectionSubtitle>
            شارك تفاصيل إضافية، أو قل "شكراً!" سريعة مقدماً.
          </SettingsSectionSubtitle>
          <EditLink>
            <EditLinkText>تعديل</EditLinkText>
          </EditLink>
        </SettingsSection>

        <SettingsSection>
          <SettingsSectionTitle>عنوان الشحن الخاص بك</SettingsSectionTitle>
          <SettingsSectionSubtitle>
            أين يجب أن نشحن الهدايا التي أضفتها من العقدة؟
          </SettingsSectionSubtitle>
          <EditLink>
            <EditLinkText>تعديل</EditLinkText>
          </EditLink>
        </SettingsSection>

        <SettingsSection>
          <SettingsSectionTitle>صناديقك النقدية</SettingsSectionTitle>
          <SettingsSectionSubtitle>
            أخبرنا أين نرسل هداياك النقدية حتى يتمكن الضيوف من المساهمة بسهولة.
          </SettingsSectionSubtitle>
          <EditLink>
            <EditLinkText>تعديل</EditLinkText>
          </EditLink>
        </SettingsSection>
      </SettingsContentContainer>
    );
  };

  // الوظيفة الرئيسية لاختيار المحتوى المراد عرضه
  const renderContent = () => {
    // إذا كنا في "عرض الفئة" تحديداً
    if (activeTab === "عرض الفئة" && selectedCategory) {
      return renderCategoryView();
    }
    switch (activeTab) {
      case "نظرة عامة":
        return renderShopContent();
      case "إدارة السجل":
        return renderManageRegistryContent();
      case "تتبع الهدايا":
        return renderTrackGiftsContent();
      case "الإعدادات":
        return renderSettingsContent();
      default:
        return renderShopContent();
    }
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />

      {/* أيقونة البحث */}
      <CartIcon onPress={handleCart}>
        <ImagePro source={Cart} />
      </CartIcon>

      {/* العنوان الرئيسي */}
      <RegistryTitle>السجل</RegistryTitle>

      {/* التبويبات */}
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

      {/* المحتوى */}
      <ContentContainer>{renderContent()}</ContentContainer>

      {/* نافذة الصندوق النقدي المنبثقة */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <ModalTitle>إنشاء صندوق نقدي</ModalTitle>

            <InputLabel>العنوان</InputLabel>
            <StyledInput
              placeholder="عنوان الصندوق (مثل: شهر عسل الأحلام)"
              value={newFund.title}
              onChangeText={(text) => setNewFund({ ...newFund, title: text })}
            />

            <InputLabel>مبلغ الهدف (ريال)</InputLabel>
            <StyledInput
              placeholder="أدخل المبلغ (مثل: ٢٠٠٠)"
              keyboardType="numeric"
              value={newFund.goal}
              onChangeText={(text) => setNewFund({ ...newFund, goal: text })}
            />

            <InputLabel>الوصف (اختياري)</InputLabel>
            <StyledInput
              placeholder="صف الغرض من هذا الصندوق..."
              multiline
              numberOfLines={3}
              value={newFund.description}
              onChangeText={(text) =>
                setNewFund({ ...newFund, description: text })
              }
            />

            <ModalButtonsContainer>
              <CancelButton onPress={() => setModalVisible(false)}>
                <ButtonText>إلغاء</ButtonText>
              </CancelButton>
              <SaveButton onPress={handleCreateFund}>
                <ButtonText light>إنشاء الصندوق</ButtonText>
              </SaveButton>
            </ModalButtonsContainer>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default RegistryApp;
