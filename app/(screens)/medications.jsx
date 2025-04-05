// app/(screens)/lesson/medications.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Modal,
  Switch,
  Alert,
  View,
  Animated,
} from "react-native";
import styled from "styled-components/native";
import { useRouter, useLocalSearchParams } from "expo-router"; // <-- Updated import
import { publicRequest, createUserRequest } from "../../requestMethods";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/authSlice";

const RECENTLY_SEARCHED_KEY = "recentlySearched";

const Medications = () => {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);

  // 1) Grab the `query` param (if present) from route params
  const { query } = useLocalSearchParams();

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlySearched, setRecentlySearched] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);

  // 2) If `query` is passed, update our search on mount or param change
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  // Load products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true); // Start loading
        const res = await publicRequest.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false); // End loading
      }
    };
    fetchProducts();
  }, []);

  // Load recently searched items from device storage on mount
  useEffect(() => {
    const loadRecentlySearched = async () => {
      try {
        const storedData = await AsyncStorage.getItem(RECENTLY_SEARCHED_KEY);
        if (storedData) {
          setRecentlySearched(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error loading recently searched items:", error);
      }
    };
    loadRecentlySearched();
  }, []);

  // Save the updated recently searched list to AsyncStorage
  const saveRecentlySearched = async (list) => {
    try {
      await AsyncStorage.setItem(RECENTLY_SEARCHED_KEY, JSON.stringify(list));
    } catch (error) {
      console.error("Error saving recently searched items:", error);
    }
  };

  // When a product is tapped, add it to the recently searched list and show the modal
  const handleProductPress = async (product) => {
    const filteredList = recentlySearched.filter(
      (item) => item._id !== product._id
    );
    const updatedList = [product, ...filteredList];
    setRecentlySearched(updatedList);
    await saveRecentlySearched(updatedList);

    setSelectedMedication(product);
    setIsModalVisible(true);
  };

  const handleCapinatePress = async () => {
    if (!selectedMedication) return;

    const filteredList = recentlySearched.filter(
      (item) => item._id !== selectedMedication._id
    );
    const updatedList = [selectedMedication, ...filteredList];
    setRecentlySearched(updatedList);
    await saveRecentlySearched(updatedList);

    if (!currentUser) {
      Alert.alert(
        "Not logged in",
        "Please log in to save to your medicine cabinet."
      );
      return;
    }

    try {
      const userId = currentUser._id;
      const userRequest = createUserRequest();
      await userRequest.put(`/users/${userId}/prescriptions`, {
        prescriptionId: selectedMedication._id,
      });
      Alert.alert("Success", "Medication saved to your medicine cabinet!");
    } catch (err) {
      console.error("Error saving medication to cabinet:", err);
      Alert.alert("Error", "Unable to save medication to your cabinet.");
      return;
    }

    const medicationId = selectedMedication._id;
    setIsModalVisible(false);
    setSelectedMedication(null);
    setTimeout(() => {
      router.push({
        pathname: "/(screens)/prescription",
        params: { productId: medicationId },
      });
    }, 300);
  };

  // Filter products based on search query (case-insensitive)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Example: assume the most popular products are the first three items
  const mostPopular = products.slice(0, 3);

  // Closes the medication screen and goes back to home
  const handleClose = () => {
    router.push("home");
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMedication(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f7f2" }}>
      {/* CLOSE BUTTON */}
      <CloseButton onPress={handleClose}>
        <CloseText>✕</CloseText>
      </CloseButton>

      {/* SEARCH BAR */}
      <HeaderContainer>
        <SearchBarContainer>
          <SearchIcon source={require("../../assets/icons/search.png")} />
          <SearchInput
            placeholder="Search for a drug or condition"
            placeholderTextColor="#888"
            // 3) Our local search state
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </SearchBarContainer>
      </HeaderContainer>

      {/** MAIN CONTENT -- Show skeleton if loading, else show real content */}
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <MainContent>
          {searchQuery === "" ? (
            <>
              <SectionRow>
                <SectionTitle>Recently Searched</SectionTitle>
              </SectionRow>
              <Divider />
              {recentlySearched.length > 0 ? (
                recentlySearched.map((item) => (
                  <ItemRow
                    key={item._id}
                    onPress={() => handleProductPress(item)}
                  >
                    <LeftWrapper>
                      <Circle>
                        <DiagonalLine />
                      </Circle>
                      <TextGroup>
                        <ItemName>{item.name}</ItemName>
                        {item.generic && (
                          <ItemDescription>{item.generic}</ItemDescription>
                        )}
                      </TextGroup>
                    </LeftWrapper>
                    <RightArrow>{">"}</RightArrow>
                  </ItemRow>
                ))
              ) : (
                <PlaceholderText>No recent searches</PlaceholderText>
              )}

              <SectionRow>
                <SectionTitle>Most Popular</SectionTitle>
              </SectionRow>
              <Divider />
              {mostPopular.length > 0 ? (
                mostPopular.map((item) => (
                  <ItemRow
                    key={item._id}
                    onPress={() => handleProductPress(item)}
                  >
                    <LeftWrapper>
                      <Circle>
                        <DiagonalLine />
                      </Circle>
                      <TextGroup>
                        <ItemName>{item.name}</ItemName>
                        {item.generic && (
                          <ItemDescription>{item.generic}</ItemDescription>
                        )}
                      </TextGroup>
                    </LeftWrapper>
                    <RightArrow>{">"}</RightArrow>
                  </ItemRow>
                ))
              ) : (
                <PlaceholderText>No popular products</PlaceholderText>
              )}
            </>
          ) : (
            <>
              <SectionRow>
                <SectionTitle>Search Results</SectionTitle>
              </SectionRow>
              <Divider />
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <ItemRow
                    key={item._id}
                    onPress={() => handleProductPress(item)}
                  >
                    <LeftWrapper>
                      <Circle>
                        <DiagonalLine />
                      </Circle>
                      <TextGroup>
                        <ItemName>{item.name}</ItemName>
                        {item.generic && (
                          <ItemDescription>{item.generic}</ItemDescription>
                        )}
                      </TextGroup>
                    </LeftWrapper>
                    <RightArrow>{">"}</RightArrow>
                  </ItemRow>
                ))
              ) : (
                <PlaceholderText>No results found</PlaceholderText>
              )}
            </>
          )}
        </MainContent>
      )}

      {/* MODAL */}
      <StyledModal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <ModalContainer>
          <ModalContent>
            <Header>
              <CloseButton onPress={handleCloseModal}>
                <CloseIcon>✕</CloseIcon>
              </CloseButton>
            </Header>

            <Title>Review prescription details</Title>

            {/* Medication Name Section */}
            <Section>
              <SectionHeader>
                <SectionContent>
                  <MedicationName>{selectedMedication?.name}</MedicationName>
                  <GenericName>
                    Generic {selectedMedication?.generic}
                  </GenericName>
                </SectionContent>
                <DropdownIcon>▼</DropdownIcon>
              </SectionHeader>
            </Section>

            {/* Form Section */}
            <Section>
              <SectionHeader>
                <Label>Form</Label>
                <Value>Tablet</Value>
                <DropdownIcon>▼</DropdownIcon>
              </SectionHeader>
            </Section>

            {/* Dosage Section */}
            <Section>
              <SectionHeader>
                <Label>Dosage</Label>
                <Value>10mg/10mg</Value>
                <DropdownIcon>▼</DropdownIcon>
              </SectionHeader>
            </Section>

            {/* Quantity Section */}
            <Section>
              <SectionHeader>
                <Label>Quantity</Label>
                <Value>30 tablets</Value>
                <DropdownIcon>▼</DropdownIcon>
              </SectionHeader>
            </Section>

            {/* Refill Reminder Section */}
            <ReminderSection>
              <ReminderLeft>
                <ReminderIcon>📦</ReminderIcon>
                <ReminderText>Get refill reminders</ReminderText>
              </ReminderLeft>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
              />
            </ReminderSection>

            <SaveButton onPress={handleCapinatePress}>
              <SaveButtonText>Save to my medicine cabinet</SaveButtonText>
            </SaveButton>
          </ModalContent>
        </ModalContainer>
      </StyledModal>
    </SafeAreaView>
  );
};

export default Medications;

/* ---------------------------------------------------------------------------
   SKELETON LOADER: displays placeholders that shimmer while loading
--------------------------------------------------------------------------- */
const SkeletonLoader = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  // Interpolate background color between two grays
  const backgroundColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ECECEC", "#F3F3F3"],
  });

  // Example: show a few “item rows” that look like your search results
  return (
    <View style={{ padding: 20 }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View
          key={item}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          {/* Circle placeholder */}
          <Animated.View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor,
              marginRight: 12,
            }}
          />
          {/* Two lines for text placeholders */}
          <View style={{ flex: 1 }}>
            <Animated.View
              style={{
                height: 10,
                width: "60%",
                backgroundColor,
                marginBottom: 6,
                borderRadius: 4,
              }}
            />
            <Animated.View
              style={{
                height: 10,
                width: "40%",
                backgroundColor,
                borderRadius: 4,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

/* --------------------------
   STYLED COMPONENTS
--------------------------- */

const StyledModal = styled(Modal)``;

const Section = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
  padding: 16px 0;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SectionContent = styled.View`
  margin-top: ${(props) => (props.hasTopMargin ? "4px" : "0")};
`;

const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: #f6f7f2;
  margin-top: auto;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  height: 90%;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 10px;
`;

const CloseIcon = styled.Text`
  font-size: 24px;
  color: #000;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #000;
  margin-bottom: 30px;
`;

const MedicationName = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #000;
`;

const GenericName = styled.Text`
  font-size: 16px;
  color: #666;
  margin-top: 4px;
`;

const Label = styled.Text`
  font-size: 16px;
  color: #666;
`;

const Value = styled.Text`
  font-size: 18px;
  color: #000;
  font-weight: 500;
`;

const DropdownIcon = styled.Text`
  font-size: 16px;
  color: #666;
`;

const ReminderSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 20px;
  margin-top: 20px;
`;

const ReminderLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ReminderIcon = styled.Text`
  font-size: 20px;
  margin-right: 10px;
`;

const ReminderText = styled.Text`
  font-size: 16px;
  color: #000;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #0066cc;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: auto;
  margin-bottom: 20px;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const CloseText = styled.Text`
  font-size: 26px;
  color: #000;
`;

const HeaderContainer = styled.View`
  padding: 10px 15px 15px 10px;
  background-color: #f6f7f2;
`;

const SearchBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #e1e1e1;
`;

const SearchIcon = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: #666;
  margin-right: 8px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #333;
`;

const MainContent = styled.View`
  flex: 1;
  background-color: #fff;
`;

const SectionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 8px 15px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #111;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #f0f0f0;
`;

const ItemRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const LeftWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Circle = styled.View`
  width: 40px;
  height: 40px;
  background-color: #ffde3b;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  position: relative;
`;

const DiagonalLine = styled.View`
  position: absolute;
  width: 18px;
  height: 2px;
  background-color: #000;
  transform: rotate(45deg);
`;

const TextGroup = styled.View`
  flex-direction: column;
`;

const ItemName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111;
`;

const ItemDescription = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 2px;
`;

const RightArrow = styled.Text`
  font-size: 18px;
  color: #999;
`;

const PlaceholderText = styled.Text`
  font-size: 14px;
  color: #888;
  padding: 15px;
  text-align: center;
`;
