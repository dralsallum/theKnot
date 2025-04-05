// app/(screens)/lesson/prescription.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  ScrollView,
  Text,
} from "react-native";
import styled from "styled-components/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/authSlice"; // Adjust path as needed

// Import publicRequest and createUserRequest from your requestMethods
import { publicRequest, createUserRequest } from "../../requestMethods";
import arrowIcon from "../../assets/icons/arrowRight.png";

const Prescription = () => {
  // Grab productId from the query parameters
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!productId) return; // Avoid running if no productId exists

    const fetchSingleProduct = async () => {
      try {
        setLoading(true);
        const response = await publicRequest.get(`/products/find/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching single product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProduct();
  }, [productId]);

  // Animate scale when modal opens
  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: modalVisible ? 0.95 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [modalVisible]);

  const handleToggleModal = () => setModalVisible((prev) => !prev);
  const handleBackPress = () => router.push("medications");

  // Bookmark handler – adds the current product to the user's prescriptions
  const handleBookmark = async () => {
    if (!currentUser) {
      Alert.alert("Not logged in", "Please log in to bookmark prescriptions.");
      return;
    }
    try {
      const userId = currentUser._id;
      // Get the authenticated axios instance by calling createUserRequest()
      const userRequest = createUserRequest();
      // Now call the PUT endpoint without needing to manually add headers
      await userRequest.put(`/users/${userId}/prescriptions`, {
        prescriptionId: product._id,
      });
      Alert.alert("Success", "Prescription bookmarked!");
      router.push("home");
    } catch (err) {
      console.error("Error bookmarking prescription", err);
      Alert.alert("Error", "Unable to bookmark prescription.");
    }
  };

  // Helper functions for rendering lists
  const renderPharmacyItem = ({ item }) => (
    <PharmacyRow onPress={handleToggleModal}>
      <LeftRow>
        <PharmacyLogo source={{ uri: item.logo }} />
        <View>
          <PharmacyName>{item.name}</PharmacyName>
          {item.welcomeOffer && <OfferBadge>Welcome offer</OfferBadge>}
        </View>
      </LeftRow>
      <RightRow>
        <PriceStack>
          <PriceText>{item.newPrice ? `$${item.newPrice}` : "$0"}</PriceText>
          {item.oldPrice && (
            <OldPriceText>${item.oldPrice.toFixed(2)}</OldPriceText>
          )}
        </PriceStack>
        <ArrowIconImg source={arrowIcon} />
      </RightRow>
    </PharmacyRow>
  );

  const renderDeliveryItem = ({ item }) => (
    <DeliveryRow>
      <LeftRow>
        <PharmacyLogo source={{ uri: item.logo }} />
        <View>
          <PharmacyName>{item.name}</PharmacyName>
          {item.subText && <DeliverySub>{item.subText}</DeliverySub>}
        </View>
      </LeftRow>
      <RightRow>
        <PriceStack>
          <PriceText>{item.newPrice ? `$${item.newPrice}` : "$0"}</PriceText>
        </PriceStack>
        <ArrowIconImg source={arrowIcon} />
      </RightRow>
    </DeliveryRow>
  );

  // Derived fields for display
  const productName = product?.name || "Loading...";
  const productGeneric = product?.generic || "";
  const productDescription = product?.description || "";
  const doseString = product
    ? `${product.dose}mg ${product.tablet} tablets`
    : "Loading dose...";

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7f2" }}>
        <Text style={{ marginTop: 50, textAlign: "center" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7f2" }}>
        <Text style={{ marginTop: 50, textAlign: "center" }}>
          No product found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7f2" }}>
      <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
        <Container>
          <HeaderRow>
            <IconButton onPress={handleBackPress}>
              <Image
                source={require("../../assets/icons/arrowLeft.png")}
                style={{ width: 24, height: 24 }}
              />
            </IconButton>

            <TitleContainer>
              <PillImagesRow>
                <PillImage
                  source={require("../../assets/images/perscription.png")}
                />
                <PillImage
                  source={require("../../assets/images/perscriptions.png")}
                />
              </PillImagesRow>
              <DrugName>{productName}</DrugName>
              <DrugSubtitle>{productGeneric}</DrugSubtitle>
            </TitleContainer>

            <RightIcons>
              {/* Bookmark button */}
              <IconButton onPress={handleBookmark}>
                <BookmarkIcon>🔖</BookmarkIcon>
              </IconButton>
              <View style={{ width: 8 }} />
              <IconButton onPress={() => console.log("Share pressed")}>
                <ShareIcon>🔗</ShareIcon>
              </IconButton>
            </RightIcons>
          </HeaderRow>

          {/* Dosage Row */}
          <DosageRow>
            <DosageBox>
              <DosageText>{doseString}</DosageText>
            </DosageBox>
            <EditButton onPress={() => console.log("Edit pressed")}>
              <EditText>Edit</EditText>
            </EditButton>
          </DosageRow>

          {/* Optional product description */}
          {productDescription ? (
            <Text style={{ color: "#444", marginBottom: 8 }}>
              {productDescription}
            </Text>
          ) : null}

          {/* Section Title */}
          <SectionTitle>Pharmacy prices with GoodRx</SectionTitle>

          {/* Pharmacy List */}
          {product.pharmacy?.length ? (
            <FlatList
              data={product.pharmacy}
              keyExtractor={(pharm, idx) => pharm.name + idx}
              renderItem={renderPharmacyItem}
              contentContainerStyle={{ paddingBottom: 10 }}
              ListFooterComponent={() => (
                <>
                  {product.delivery?.length ? (
                    <>
                      <SectionTitle style={{ marginTop: 15 }}>
                        Home delivery
                      </SectionTitle>
                      <SectionSubtitle>
                        Buy online and have it delivered to your home
                      </SectionSubtitle>
                      <FlatList
                        data={product.delivery}
                        keyExtractor={(del, idx) => del.name + idx}
                        renderItem={renderDeliveryItem}
                        scrollEnabled={false}
                      />
                    </>
                  ) : null}
                </>
              )}
            />
          ) : (
            <Text style={{ color: "#444" }}>No pharmacy data available.</Text>
          )}
        </Container>
      </Animated.View>

      {/* BOTTOM-SHEET MODAL */}
      <StyledModal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleToggleModal}
      >
        <ModalBackdrop style={{ backgroundColor: "#f7f7f4" }}>
          <ModalSheet>
            <CloseButtonContainer>
              <TouchableOpacity onPress={handleToggleModal}>
                <CloseIconText>✕</CloseIconText>
              </TouchableOpacity>
            </CloseButtonContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
              <SheetLocationContainer>
                <LocationDot>📍</LocationDot>
                <PharmacistText>SHOW THIS TO THE PHARMACIST AT</PharmacistText>
                <ModalPharmacyName>Example Pharmacy</ModalPharmacyName>
              </SheetLocationContainer>
              <CouponCard>
                <ModalDrugName>{productName}</ModalDrugName>
                <ModalDosage>{doseString}</ModalDosage>
                <BannerRow>
                  <BannerText>Exclusive welcome offer</BannerText>
                </BannerRow>
                <ModalPrice>$2.00</ModalPrice>
                <ExtraDiscount>Extra $7 applied</ExtraDiscount>
                <RefillInfo>First fill, then $9.41 on refills*</RefillInfo>
                <RewardRow>
                  <RewardIcon>💰</RewardIcon>
                  <RewardText>Earns 1,000 points in rewards</RewardText>
                </RewardRow>
                <InfoRow>
                  <Label>BIN</Label>
                  <Value>015995</Value>
                </InfoRow>
                <InfoRow>
                  <Label>PCN</Label>
                  <Value>GDC</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Group</Label>
                  <Value>DR33</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Member ID</Label>
                  <Value>JKH590830</Value>
                </InfoRow>
                <ButtonRow>
                  <ActionButton>
                    <ActionButtonText>Save</ActionButtonText>
                  </ActionButton>
                  <ActionButton>
                    <ActionButtonText>Share</ActionButtonText>
                  </ActionButton>
                </ButtonRow>
                <FullWidthBar>
                  <BarText>GoodRx coupon • This is NOT insurance</BarText>
                </FullWidthBar>
              </CouponCard>
              <FooterNote>
                *Prices subject to change without notice. Coupon price expires
                on 02/12/2025
              </FooterNote>
            </ScrollView>
          </ModalSheet>
        </ModalBackdrop>
      </StyledModal>
    </SafeAreaView>
  );
};

export default Prescription;

/* ---------------------------
   STYLED COMPONENTS
---------------------------- */
const Container = styled.View`
  flex: 1;
  padding: 15px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const IconButton = styled.TouchableOpacity`
  padding: 5px;
`;

const TitleContainer = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  margin-left: 10px;
`;

const PillImagesRow = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`;

const PillImage = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 18px;
  margin-right: 5px;
  resize-mode: cover;
`;

const DrugName = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #000;
`;

const DrugSubtitle = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 2px;
`;

const RightIcons = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BookmarkIcon = styled.Text`
  font-size: 18px;
`;

const ShareIcon = styled.Text`
  font-size: 18px;
`;

const DosageRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const DosageBox = styled.View`
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 12px;
`;

const DosageText = styled.Text`
  font-size: 16px;
  color: #000;
`;

const EditButton = styled.TouchableOpacity`
  margin-left: 10px;
`;

const EditText = styled.Text`
  font-size: 16px;
  color: #2574db;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
`;

const SectionSubtitle = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const PharmacyRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const LeftRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PharmacyLogo = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
  resize-mode: cover;
`;

const PharmacyName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 3px;
`;

const OfferBadge = styled.Text`
  font-size: 14px;
  color: #066b37;
  background-color: #dff2ea;
  padding: 2px 6px;
  border-radius: 4px;
`;

const RightRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PriceStack = styled.View`
  flex-direction: column;
  align-items: flex-end;
`;

const PriceText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #000;
`;

const OldPriceText = styled.Text`
  font-size: 14px;
  text-decoration: line-through;
  color: #888;
  margin-top: 2px;
`;

const ArrowIconImg = styled.Image`
  width: 14px;
  height: 14px;
  tint-color: #000;
  margin-left: 10px;
`;

const DeliveryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const DeliverySub = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 2px;
`;

export const StyledModal = styled.Modal``;

export const ModalBackdrop = styled.View`
  flex: 1;
  background-color: #f7f7f4;
`;

export const ModalSheet = styled.View`
  flex: 1;
  margin-top: 40px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 20px;
  padding-top: 60px;
  background-color: #f7f7f4;
`;

export const CloseButtonContainer = styled.View`
  position: absolute;
  right: 20px;
  top: 20px;
`;

export const CloseIconText = styled.Text`
  font-size: 20px;
  color: #000;
`;

export const SheetLocationContainer = styled.View`
  align-items: center;
  margin-bottom: 14px;
`;

export const LocationDot = styled.Text`
  font-size: 22px;
  margin-bottom: 5px;
`;

export const PharmacistText = styled.Text`
  font-size: 16px;
  color: #666;
  margin-bottom: 4px;
`;

export const ModalPharmacyName = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #000;
`;

export const CouponCard = styled.View`
  position: relative;
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 20px;
  padding: 16px;
  elevation: 2;
  padding-bottom: 70px;
`;

export const FullWidthBar = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffe047;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 10px 0;
  align-items: center;
  justify-content: center;
`;

export const BarText = styled.Text`
  font-weight: 600;
  color: #000;
`;

export const ModalDrugName = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin-bottom: 2px;
`;

export const ModalDosage = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

export const BannerRow = styled.View`
  background-color: #e7f1ff;
  padding: 6px 10px;
  border-radius: 6px;
  align-items: center;
  margin-bottom: 10px;
`;

export const BannerText = styled.Text`
  font-size: 14px;
  color: #111;
`;

export const ModalPrice = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
`;

export const ExtraDiscount = styled.Text`
  font-size: 16px;
  color: #0b8457;
  margin-bottom: 8px;
`;

export const RefillInfo = styled.Text`
  font-size: 14px;
  color: #444;
  margin-bottom: 12px;
`;

export const RewardRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

export const RewardIcon = styled.Text`
  font-size: 20px;
  margin-right: 6px;
`;

export const RewardText = styled.Text`
  font-size: 15px;
  color: #333;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const Label = styled.Text`
  font-size: 15px;
  color: #666;
`;

export const Value = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 12px;
`;

export const ActionButton = styled.TouchableOpacity`
  flex: 1;
  border: 1px solid #333;
  border-radius: 20px;
  padding: 8px 0;
  margin: 0 4px;
  background-color: #fff;
  align-items: center;
`;

export const ActionButtonText = styled.Text`
  font-size: 16px;
  color: #000;
`;

export const FooterNote = styled.Text`
  font-size: 12px;
  color: #777;
  text-align: center;
  margin-bottom: 10px;
`;
