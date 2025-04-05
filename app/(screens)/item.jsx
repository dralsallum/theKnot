import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import { addProduct, clearFeedbackIcon } from "../redux/registrySlice";
import { publicRequest } from "../../requestMethods";
import { useSelector, useDispatch } from "react-redux";

const { width } = Dimensions.get("window");

// ---------- STYLED COMPONENTS ----------
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const BackOverlay = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 18px;
  padding: 6px;
  z-index: 10;
`;

const PageIndicatorOverlay = styled.View`
  position: absolute;
  top: 50px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 18px;
  padding-horizontal: 10px;
  padding-vertical: 4px;
  z-index: 10;
`;

const PageIndicatorText = styled.Text`
  color: white;
  font-size: 14px;
`;

const CarouselContainer = styled.View`
  width: 100%;
  height: 300px;
  background-color: #f5f5f5;
`;

const CarouselImage = styled.Image`
  width: ${width}px;
  height: 300px;
`;

const ContentContainer = styled.View`
  padding-horizontal: 16px;
  padding-vertical: 12px;
`;

const BrandText = styled.Text`
  font-size: 16px;
  color: #007aff;
  margin-bottom: 4px;
`;

const ProductTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 6px;
`;

const PriceRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const ProductPrice = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const ShippingBadge = styled.View`
  background-color: #f3f3f3;
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 6px;
  margin-left: 8px;
`;

const ShippingBadgeText = styled.Text`
  font-size: 12px;
  color: #333;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #eee;
  margin-vertical: 12px;
`;

const ColorLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
`;

const ColorOptionRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const ColorCircle = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  margin-right: 8px;
  border-width: ${(props) => (props.selected ? "3px" : "1px")};
  border-color: ${(props) => (props.selected ? "#ec4899" : "#ccc")};
  justify-content: center;
  align-items: center;
`;

const BottomBar = styled.View`
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 16px;
  background-color: #fff;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

const AddToRegistryButton = styled.TouchableOpacity`
  padding-vertical: 16px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
`;

const AddToRegistryText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

// Overlay that appears briefly upon adding
const FeedbackOverlay = styled.View`
  position: absolute;
  top: 120px;
  left: 0;
  right: 0;
  align-items: center;
  z-index: 999;
`;

const FeedbackBox = styled.View`
  background-color: rgba(0, 0, 0, 0.8);
  padding-horizontal: 14px;
  padding-vertical: 8px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
`;

const FeedbackText = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-left: 8px;
`;

// ---------- MAIN COMPONENT ----------
const Item = () => {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const dispatch = useDispatch();

  // Comes from your Redux store
  const { feedbackIcons } = useSelector((state) => state.registry);

  // If `feedbackIcons[product._id]` is truthy, we know we just dispatched addProduct
  const isCheck = product?._id ? feedbackIcons[product._id] : false;

  // 1) Fetch product data from your API
  const fetchProduct = async () => {
    try {
      setLoading(true);

      if (!productId) {
        throw new Error("No productId provided!");
      }

      const res = await publicRequest.get(`/products/find/${productId}`);
      setProduct(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Could not load product data.");
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Horizontal scroll callback
  const onScrollEnd = (e) => {
    let contentOffset = e.nativeEvent.contentOffset.x;
    let index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  function handleAddProduct(product) {
    dispatch(addProduct(product));

    // Clear “added” feedback after 1 second
    setTimeout(() => {
      dispatch(clearFeedbackIcon(product._id));
    }, 3000);
  }

  if (loading) {
    return (
      <Container>
        <CenteredContainer>
          <ActivityIndicator size="large" color="#ec4899" />
        </CenteredContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <CenteredContainer>
          <Text style={{ color: "red" }}>{error}</Text>
        </CenteredContainer>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <CenteredContainer>
          <Text>No product found.</Text>
        </CenteredContainer>
      </Container>
    );
  }

  // Destructure fields from the product
  const {
    name,
    brand = "Unknown Brand",
    price,
    img,
    shippingLabel = "Free Shipping & Returns",
    colors = ["White", "Beige", "Pink", "Blue", "Gray"],
  } = product;

  let productImages = [];
  if (typeof img === "string") {
    productImages = [img];
  } else if (Array.isArray(img)) {
    productImages = img;
  }

  // Default color
  const defaultColor = colors[0] || "N/A";
  const displayedColor = selectedColor || defaultColor;

  return (
    <Container>
      {/* --- FEEDBACK OVERLAY if isCheck --- */}
      {isCheck && (
        <FeedbackOverlay>
          <FeedbackBox>
            <Feather name="check-circle" size={24} color="#fff" />
            <FeedbackText>Added to Registry!</FeedbackText>
          </FeedbackBox>
        </FeedbackOverlay>
      )}

      {/* --- IMAGE CAROUSEL --- */}
      <View>
        {/* Back button in top-left corner */}
        <BackOverlay onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </BackOverlay>

        {/* “x/y” style page indicator in top-right corner */}
        {productImages.length > 0 && (
          <PageIndicatorOverlay>
            <PageIndicatorText>
              {currentIndex + 1}/{productImages.length}
            </PageIndicatorText>
          </PageIndicatorOverlay>
        )}

        <CarouselContainer>
          {productImages.length > 0 ? (
            <ScrollView
              horizontal
              pagingEnabled
              onMomentumScrollEnd={onScrollEnd}
              ref={scrollRef}
              showsHorizontalScrollIndicator={false}
            >
              {productImages.map((uri, idx) => (
                <CarouselImage key={idx} source={{ uri }} resizeMode="cover" />
              ))}
            </ScrollView>
          ) : (
            <CarouselImage
              source={{ uri: "https://via.placeholder.com/400x300/cccccc" }}
              resizeMode="cover"
            />
          )}
        </CarouselContainer>
      </View>

      {/* --- CONTENT SCROLL --- */}
      <ScrollView style={{ flex: 1 }}>
        <ContentContainer>
          <BrandText>By {brand}</BrandText>
          <ProductTitle>{name}</ProductTitle>
          <PriceRow>
            <ProductPrice>${price?.toFixed(2)}</ProductPrice>
            {shippingLabel ? (
              <ShippingBadge>
                <ShippingBadgeText>{shippingLabel}</ShippingBadgeText>
              </ShippingBadge>
            ) : null}
          </PriceRow>

          <Divider />

          {/* Color selection */}
          <ColorLabel>Color: {displayedColor}</ColorLabel>
          <ColorOptionRow>
            {colors.map((c) => {
              const isSelected = displayedColor === c;
              return (
                <ColorCircle
                  key={c}
                  selected={isSelected}
                  onPress={() => setSelectedColor(c)}
                >
                  <Text style={{ textTransform: "capitalize" }}>{c[0]}</Text>
                </ColorCircle>
              );
            })}
          </ColorOptionRow>
        </ContentContainer>
      </ScrollView>

      {/* --- FIXED BOTTOM BUTTON --- */}
      <BottomBar>
        <AddToRegistryButton
          onPress={() => handleAddProduct(product)}
          style={{
            backgroundColor: isCheck ? "#333" : "#ec4899", // if added => grey
          }}
          disabled={isCheck} // disable button if just added
        >
          <AddToRegistryText>
            {isCheck ? "Added!" : "Add to Registry"}
          </AddToRegistryText>
        </AddToRegistryButton>
      </BottomBar>
    </Container>
  );
};

export default Item;
