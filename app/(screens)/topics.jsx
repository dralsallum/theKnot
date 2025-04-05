import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
// Remove static data import
// import data from "../utils/data.json";
import { publicRequest } from "../../requestMethods";

/* -------------------------
    SCREEN LAYOUT CONSTANTS
-------------------------- */
const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

// Example filters (customize as needed)
const FILTERS = ["All", "metformin", "atorvastatin", "perindopril"];

const Topics = () => {
  const router = useRouter();

  // Track which filter is selected
  const [selectedFilter, setSelectedFilter] = useState("All");

  // NEW: State for topics fetched from backend
  const [topicsData, setTopicsData] = useState([]);

  // Fetch topics (articles) from the backend
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await publicRequest.get("/articles");
        const mappedTopics = res.data.map((article) => ({
          key: article._id,
          imageUri: article.imageUrl,
          label: article.title,
          navigateTo: `article?id=${article._id}`,
        }));
        setTopicsData(mappedTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopics();
  }, []);

  // Filter logic using the fetched topics
  const filteredTopics =
    selectedFilter === "All"
      ? topicsData
      : topicsData.filter((item) =>
          item.label.toLowerCase().includes(selectedFilter.toLowerCase())
        );

  // On press of a card, navigate to the specified route
  const handleCardPress = (navigateTo) => {
    if (navigateTo) {
      router.push(navigateTo);
    }
  };

  // Render each card in the FlatList
  const renderItem = ({ item }) => {
    return (
      <CardTouchable onPress={() => handleCardPress(item.navigateTo)}>
        <CardContainer>
          <CardImage source={{ uri: item.imageUri }} resizeMode="cover" />
          <CardLabelContainer>
            <CardLabel>{item.label}</CardLabel>
          </CardLabelContainer>
        </CardContainer>
      </CardTouchable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header with a title and a back button */}
      <HeaderRow>
        <TitleText>All Topics</TitleText>
        <TouchableOpacity onPress={() => router.back()}>
          <BackText>Back</BackText>
        </TouchableOpacity>
      </HeaderRow>

      {/* Horizontal scroll of filter pills */}
      <FilterScroll
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: CARD_MARGIN }}
      >
        {FILTERS.map((filter) => (
          <FilterPill
            key={filter}
            isSelected={selectedFilter === filter}
            onPress={() => setSelectedFilter(filter)}
          >
            <FilterText isSelected={selectedFilter === filter}>
              {filter}
            </FilterText>
          </FilterPill>
        ))}
      </FilterScroll>

      {/* 2-column grid of topics */}
      <FlatList
        data={filteredTopics}
        keyExtractor={(item) => item.key}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: CARD_MARGIN,
        }}
        contentContainerStyle={{ padding: CARD_MARGIN }}
        renderItem={renderItem}
        ListEmptyComponent={() => <NoItemsText>No topics found.</NoItemsText>}
      />
    </SafeAreaView>
  );
};

export default Topics;

/* ----------------------------------
   STYLED COMPONENTS
------------------------------------ */

// -- HEADER --
const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
`;

const TitleText = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

const BackText = styled.Text`
  color: blue;
  font-size: 16px;
`;

// -- FILTER SCROLLVIEW --
const FilterScroll = styled.ScrollView``;

const FilterPill = styled.TouchableOpacity`
  min-width: 80px;
  height: 36px;
  border-radius: 18px;
  margin-right: 8px;
  margin-bottom: 15px;
  background-color: ${({ isSelected }) => (isSelected ? "#fdcd56" : "#f0f0f0")};
  align-items: center;
  justify-content: center;
`;

const FilterText = styled.Text`
  color: ${({ isSelected }) => (isSelected ? "#fff" : "#333")};
  font-size: 14px;
  font-weight: 500;
  padding-horizontal: 10px;
`;

// -- EMPTY STATE TEXT --
const NoItemsText = styled.Text`
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
  color: #999;
`;

// -- CARD GRID --
const CardTouchable = styled.TouchableOpacity`
  width: ${CARD_WIDTH}px;
`;

const CardContainer = styled.View`
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  height: 180px;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 65%;
`;

const CardLabelContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 5px;
`;

const CardLabel = styled.Text`
  color: #333;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
`;
