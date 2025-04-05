import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Text,
  FlatList,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { publicRequest } from "../../requestMethods";

// 1) Import from Redux
import { useDispatch } from "react-redux";
import { addProduct, clearFeedbackIcon } from "../redux/registrySlice";

const windowWidth = Dimensions.get("window").width;

// ---------- STYLED COMPONENTS ----------
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fefefe;
`;

const HeaderBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 16px;
  padding-vertical: 10px;
  background-color: #fceee3;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

const ScreenTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const TopIcons = styled.View`
  flex-direction: row;
`;

const ProductCount = styled.Text`
  margin-left: 16px;
  margin-bottom: 10px;
  font-size: 16px;
  color: #666;
`;

const ProductCard = styled.View`
  width: ${(windowWidth - 48) / 2}px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  margin-right: 16px;
  overflow: hidden;
  elevation: 2;
`;

const AwardBadge = styled.View`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #000;
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 6px;
  z-index: 5;
`;

const AwardBadgeText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 12px;
`;

const ProductImageContainer = styled.View`
  width: 100%;
  height: 160px;
`;

const ProductImageStyled = styled.Image`
  width: 100%;
  height: 100%;
`;

const AddButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: #ec4899;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const InfoContainer = styled.View`
  padding: 10px;
`;

const BrandText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 2px;
`;

const RatingText = styled.Text`
  font-size: 14px;
  color: #666;
`;

const ProductTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-vertical: 4px;
`;

const PriceRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const ProductPrice = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const OldPrice = styled.Text`
  font-size: 14px;
  color: #999;
  text-decoration-line: line-through;
  margin-left: 8px;
`;

const CenteredContainer = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

// ---------- MAIN COMPONENT ----------
const ProductPage = () => {
  const { category } = useLocalSearchParams(); // e.g. "Tabletop"
  const router = useRouter();
  const dispatch = useDispatch(); // 2) Setup dispatch

  const screenTitle = category || "Category";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local ephemeral feedback state for plus/check icons
  const [feedbackIcons, setFeedbackIcons] = useState({});
  const [totalCount, setTotalCount] = useState(0);

  // Fetch products based on the category param
  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicRequest.get(
        `/products?category=${category}`
      );
      const data = response.data;
      setProducts(data);
      setTotalCount(data.length);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Failed to load products.");
    }
  };

  useEffect(() => {
    if (category) {
      fetchProductsByCategory();
    }
  }, [category]);

  // 3) Dispatch to Redux plus ephemeral icon feedback
  const handleAdd = (product) => {
    // Turn on the check icon locally
    setFeedbackIcons((prev) => ({ ...prev, [product._id]: true }));

    // Dispatch Redux action to add product
    dispatch(addProduct(product));

    // Turn icon back to plus after 1 second & clear Redux “feedbackIcon”
    setTimeout(() => {
      setFeedbackIcons((prev) => {
        const updated = { ...prev };
        delete updated[product._id];
        return updated;
      });
      dispatch(clearFeedbackIcon(product._id));
    }, 1000);
  };

  // Navigate to detail page
  const handleProductPress = (productId) => {
    router.push(`/(screens)/item?productId=${productId}`);
  };

  // Render a single product
  const renderItem = ({ item }) => {
    const {
      _id,
      name,
      brand = "Brand",
      price,
      oldPrice,
      ratingCount,
      awardWinner,
      img,
    } = item;

    // If feedbackIcons[productId] is true => show check icon
    const isCheckIcon = !!feedbackIcons[_id];

    return (
      <TouchableOpacity onPress={() => handleProductPress(_id)}>
        <ProductCard>
          {awardWinner && (
            <AwardBadge>
              <AwardBadgeText>Award Winner</AwardBadgeText>
            </AwardBadge>
          )}

          <ProductImageContainer>
            <ProductImageStyled
              source={{
                uri: img || "https://via.placeholder.com/400x350/f5f5f5/000000",
              }}
              resizeMode="cover"
            />
            <AddButton onPress={() => handleAdd(item)}>
              <Feather
                name={isCheckIcon ? "check" : "plus"}
                size={24}
                color="#fff"
              />
            </AddButton>
          </ProductImageContainer>

          <InfoContainer>
            <BrandText>{brand}</BrandText>
            {!!ratingCount && <RatingText>★ ({ratingCount})</RatingText>}
            <ProductTitle>{name}</ProductTitle>
            <PriceRow>
              <ProductPrice>${price.toFixed(2)}</ProductPrice>
              {oldPrice && <OldPrice>${oldPrice.toFixed(2)}</OldPrice>}
            </PriceRow>
          </InfoContainer>
        </ProductCard>
      </TouchableOpacity>
    );
  };

  // Header bar
  const renderHeaderBar = () => (
    <HeaderBar>
      <BackButton onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="black" />
      </BackButton>
      <ScreenTitle>{screenTitle}</ScreenTitle>
      <TopIcons>
        <TouchableOpacity style={{ marginRight: 16 }}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="sliders" size={24} color="black" />
        </TouchableOpacity>
      </TopIcons>
    </HeaderBar>
  );

  return (
    <Container>
      {renderHeaderBar()}

      <ProductCount>{totalCount} items</ProductCount>

      {loading && (
        <CenteredContainer>
          <ActivityIndicator size="large" color="#ec4899" />
        </CenteredContainer>
      )}
      {error && (
        <CenteredContainer>
          <Text style={{ color: "red" }}>{error}</Text>
        </CenteredContainer>
      )}

      {!loading && !error && (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={{ marginLeft: 16 }}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </Container>
  );
};

export default ProductPage;
