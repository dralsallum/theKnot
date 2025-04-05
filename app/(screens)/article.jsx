import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  Animated,
  View,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import styled from "styled-components/native";
import { useLocalSearchParams, router } from "expo-router";
import { publicRequest } from "../../requestMethods";

import arrowLeft from "../../assets/icons/arrowLeft.png";

/* -----------------------------------
   ARTICLE SKELETON LOADER
----------------------------------- */
const ArticleSkeletonLoader = () => {
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

  const backgroundColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ECECEC", "#F3F3F3"],
  });

  return (
    <View style={{ padding: 15 }}>
      {/* Image placeholder */}
      <Animated.View
        style={[
          styles.skeletonItem,
          { width: "100%", height: 200, backgroundColor },
        ]}
      />
      {/* Title placeholder */}
      <Animated.View
        style={[
          styles.skeletonItem,
          { width: "60%", height: 20, marginTop: 20, backgroundColor },
        ]}
      />
      {/* Paragraph placeholders (3 lines) */}
      <Animated.View
        style={[
          styles.skeletonItem,
          { width: "90%", height: 15, marginTop: 15, backgroundColor },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonItem,
          { width: "85%", height: 15, marginTop: 10, backgroundColor },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonItem,
          { width: "80%", height: 15, marginTop: 10, backgroundColor },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonItem: {
    borderRadius: 6,
  },
});

/* -----------------------------------
   ARTICLE SCREEN
----------------------------------- */
const Article = () => {
  const { id } = useLocalSearchParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await publicRequest.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  return (
    <Container>
      {/* Always show the BackContainer at the top */}
      <BackContainer>
        <BackButton onPress={() => router.back()}>
          <BackButtonText>رجوع</BackButtonText>
          <ArrowIcon
            source={arrowLeft}
            style={{ transform: [{ scaleX: -1 }] }}
          />
        </BackButton>
      </BackContainer>

      {/* Conditional rendering below the BackContainer */}
      {loading ? (
        // Show skeleton loader if still loading
        <ArticleSkeletonLoader />
      ) : !article ? (
        // If article is not found, show error
        <ErrorContainer>
          <ErrorText>لم يتم العثور على المقال</ErrorText>
        </ErrorContainer>
      ) : (
        // Otherwise, show the actual article content
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <WhiteContentWrapper>
            <ArticleImage
              source={{ uri: article.imageUrl }}
              resizeMode="cover"
            />
            <TextContent>
              <ArticleTitle>{article.title}</ArticleTitle>

              <SectionTitle>المقدمة</SectionTitle>
              <ArticleContent>{article.content}</ArticleContent>

              <SectionTitle>الأسباب</SectionTitle>
              <ArticleContent>{article.cause}</ArticleContent>

              <SectionTitle>الأعراض</SectionTitle>
              <ArticleContent>{article.symptoms}</ArticleContent>

              <SectionTitle>العلاج</SectionTitle>
              <ArticleContent>{article.treatment}</ArticleContent>

              <SectionTitle>معلومات إضافية</SectionTitle>
              <ArticleContent>{article.extra}</ArticleContent>
            </TextContent>
          </WhiteContentWrapper>
        </ScrollView>
      )}
    </Container>
  );
};

export default Article;

/* ------------------- STYLED COMPONENTS ------------------- */
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const BackContainer = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  justify-content: flex-start;
  padding: 15px;
  background-color: #fff;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;
`;

const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const ArrowIcon = styled.Image`
  width: 24px;
  height: 24px;
  margin-left: 6px;
  tint-color: #000;
`;

const BackButtonText = styled.Text`
  font-size: 18px;
  color: #000;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  font-size: 18px;
  color: #fcdb00;
  text-align: center;
  writing-direction: rtl;
`;

const WhiteContentWrapper = styled.View`
  background-color: #fff;
  margin: 10px;
  border-radius: 15px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  elevation: 2;
  overflow: hidden;
`;

const ArticleImage = styled.Image`
  width: 100%;
  height: 250px;
`;

const TextContent = styled.View`
  padding: 15px;
  writing-direction: rtl;
`;

const ArticleTitle = styled.Text`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  text-align: right;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
  color: #fcdb00;
  text-align: right;
`;

const ArticleContent = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: #444;
  writing-direction: rtl;
  text-align: justify;
`;
