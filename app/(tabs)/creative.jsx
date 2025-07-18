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
import { publicRequest, createUserRequest } from "../../requestMethods";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

// أيقونات/صور
const EditIcon = require("../../assets/icons/edit.png");
const HeartIcon = require("../../assets/icons/heart.png");
const CheckIcon = require("../../assets/icons/check.png");
const SearchIcon = require("../../assets/icons/search.png");

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

const GuitarIcon = require("../../assets/icons/guitar.png");
const PaperGoodsIcon = GuitarIcon;
const OfficiantsIcon = GuitarIcon;
const PhotoBoothIcon = GuitarIcon;
const PhotographerIcon = GuitarIcon;
const ReceptionIcon = GuitarIcon;
const RentalsIcon = GuitarIcon;
const BalloonsIcon = GuitarIcon;
const TransportationIcon = GuitarIcon;
const TravelIcon = GuitarIcon;
const VideoIcon = GuitarIcon;
const PlannerIcon = GuitarIcon;

/* -------- بيانات ثابتة مترجَمة -------- */
const popularVenueTypes = [
  { id: 1, name: "حظيرة", image: BarnImg },
  { id: 2, name: "حديقة", image: GardenImg },
  { id: 3, name: "شاطئ", image: BeachImg },
];

const guestCountSizes = [
  "0-50 ضيف",
  "51-100 ضيف",
  "101-150 ضيف",
  "151-200 ضيف",
  "201-250 ضيف",
  "251-300 ضيف",
  "أكثر من 300 ضيف",
];

const vendorCategories = [
  { id: 1, name: "منسقو أغاني", image: DJImg, category: "djs" },
  { id: 2, name: "فرق موسيقية", image: BandsImg, category: "bands" },
  { id: 3, name: "الجمال", image: BeautyImg, category: "beauty" },
  { id: 4, name: "منسقو الزهور", image: FloristsImg, category: "florists" },
  {
    id: 5,
    name: "منظّمو حفلات الزفاف",
    image: PlannersImg,
    category: "planners",
  },
  {
    id: 6,
    name: "مصوّرو الفيديو",
    image: VideographersImg,
    category: "videographers",
  },
];

const allCategories = [
  {
    id: 1,
    name: "الدعوات والقرطاسية",
    icon: PaperGoodsIcon,
    category: "paper-goods",
  },
  {
    id: 2,
    name: "المأذونون والإرشاد قبل الزواج",
    icon: OfficiantsIcon,
    category: "officiants",
  },
  {
    id: 3,
    name: "أكشاك التصوير",
    icon: PhotoBoothIcon,
    category: "photo-booths",
  },
  {
    id: 4,
    name: "المصورون",
    icon: PhotographerIcon,
    category: "photographers",
  },
  { id: 5, name: "أماكن الاستقبال", icon: ReceptionIcon, category: "venues" },
  { id: 6, name: "التأجير", icon: RentalsIcon, category: "rentals" },
  {
    id: 7,
    name: "أماكن الحفلات",
    icon: BalloonsIcon,
    category: "party-venues",
  },
  {
    id: 8,
    name: "المواصلات",
    icon: TransportationIcon,
    category: "transportation",
  },
  { id: 9, name: "متخصصو السفر", icon: TravelIcon, category: "travel" },
  {
    id: 10,
    name: "مصوّرو الفيديو",
    icon: VideoIcon,
    category: "videographers",
  },
  {
    id: 11,
    name: "منظّمو حفلات الزفاف",
    icon: PlannerIcon,
    category: "planners",
  },
];

/* ---------- المكوّن ---------- */
const Vendors = () => {
  const router = useRouter();
  const currentUser = useSelector((state) => state.user.currentUser);
  const isAuthenticated = !!currentUser;
  const userId = currentUser?._id || null;

  const [vendors, setVendors] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weddingInfo, setWeddingInfo] = useState({
    weddingDate: null,
    weddingLocation: null,
    weddingCountry: null,
    weddingCity: null,
    partnerName: null,
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const res = await publicRequest.get("/vendors/category/venues");
        setVendors(res.data);
      } catch {
        setError("فشل جلب الأماكن.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    const fetchUserFavorites = async () => {
      try {
        const userReq = createUserRequest();
        const res = await userReq.get(`/users/${userId}/favorites`);
        if (Array.isArray(res.data)) {
          setUserFavorites(res.data.map((v) => (v._id ? v._id : v)));
        }
      } catch (_) {}
    };
    fetchUserFavorites();
  }, [isAuthenticated, userId]);

  const isVendorFavorite = (id) => userFavorites.includes(id);

  const toggleFavorite = async (id) => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    try {
      const userReq = createUserRequest();
      const fav = isVendorFavorite(id);

      fav
        ? setUserFavorites((p) => p.filter((x) => x !== id))
        : setUserFavorites((p) => [...p, id]);

      fav
        ? await userReq.delete(`/users/${userId}/favorites/${id}`)
        : await userReq.post(`/users/${userId}/favorites`, { vendorId: id });
    } catch (_) {
      // تراجع في حال الخطأ
      isVendorFavorite(id)
        ? setUserFavorites((p) => p.filter((x) => x !== id))
        : setUserFavorites((p) => [...p, id]);
    }
  };

  const navigateToVendorDetails = (id) =>
    router.push({ pathname: "/booking", params: { id } });

  const navigateToSaved = () => router.push("/favorite");

  const navigateToCategory = (category, id = "default") =>
    router.push({
      pathname: "/category",
      params: { category: category.toLowerCase(), id },
    });

  const getVendorImage = (v) =>
    v.images?.length ? { uri: v.images[0] } : ExampleVenueImg1;

  useEffect(() => {
    if (userId) {
      const fetchWeddingInfo = async () => {
        try {
          const res = await createUserRequest().get(
            `/users/wedding-date/${userId}`
          );
          setWeddingInfo(res.data);
        } catch (err) {
          console.error("Failed to fetch wedding information:", err);
          setError("فشل في جلب معلومات الزفاف");
        }
      };
      fetchWeddingInfo();
    }
  }, [userId]);

  return (
    <Container>
      <ScrollContainer>
        <HeaderContainer>
          <Title>الموردون</Title>
          <SubTitleContainer>
            <SubTitle>تصفّح الموردين بالقرب من </SubTitle>
            <LocationLink>
              <LocationText>
                {weddingInfo.weddingCountry}, {weddingInfo.weddingLocation}
              </LocationText>
            </LocationLink>
            <EditButton>
              <EditIconImg source={EditIcon} />
            </EditButton>
          </SubTitleContainer>
        </HeaderContainer>

        {/* البحث + الملخّص */}
        <SearchAndSummaryWrapper>
          <SummaryBoxesContainer>
            <SummaryBox onPress={navigateToSaved}>
              <SummaryBoxTitle>المحفوظة</SummaryBoxTitle>
              <SummaryBoxDescRow>
                <HeartIconImg source={HeartIcon} />
                <SummaryBoxDesc>
                  {`${userFavorites.length} من الموردين`}
                </SummaryBoxDesc>
              </SummaryBoxDescRow>
            </SummaryBox>

            <SummaryBox>
              <SummaryBoxTitle>المحجوزة</SummaryBoxTitle>
              <SummaryBoxDescRow>
                <CheckIconImg source={CheckIcon} />
                <SummaryBoxDesc>0 / 8 من الموردين</SummaryBoxDesc>
              </SummaryBoxDescRow>
            </SummaryBox>
          </SummaryBoxesContainer>
        </SearchAndSummaryWrapper>

        <WhiteSection>
          {/* بطاقة المعلومات الزرقاء */}
          <InfoBlock>
            <InfoBlockTitle>ابدأ بالأماكن</InfoBlockTitle>
            <InfoBlockSubtitle>
              ٪82 من الأزواج يحجزون المكان أولاً!
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
                vendors.slice(0, 5).map((v) => (
                  <TouchableVenueCard
                    key={v._id}
                    onPress={() => navigateToVendorDetails(v._id)}
                  >
                    <HeartIconOverlay
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(v._id);
                      }}
                    >
                      <VendorHeartIcon
                        source={HeartIcon}
                        resizeMode="contain"
                        isFavorite={isVendorFavorite(v._id)}
                      />
                    </HeartIconOverlay>

                    <VenueImage source={getVendorImage(v)} resizeMode="cover" />
                    <VenueCardContent>
                      <VenueTitle>{v.name}</VenueTitle>
                      <VenueRating>
                        ⭐ {v.rating} ({v.numReviews || 0})
                      </VenueRating>
                      <VenueLocation>{v.location}</VenueLocation>
                      <VenueExtra>
                        {v.guestRange || "N/A"} • {v.priceRange}
                      </VenueExtra>
                      {v.badges?.map((b) => (
                        <Badge key={b}>{b}</Badge>
                      ))}
                    </VenueCardContent>
                  </TouchableVenueCard>
                ))}
            </CardScroll>
          </InfoBlock>

          <ExploreButton onPress={() => navigateToCategory("venues")}>
            <ExploreButtonText>استكشف الأماكن</ExploreButtonText>
          </ExploreButton>

          <LinkText>حجزت مكانك؟ أضف معلومات المكان</LinkText>

          {/* أنواع الأماكن الشائعة */}
          <PopularSection>
            <PopularTitle>أنواع الأماكن الشائعة</PopularTitle>
            <PopularSubtitle>استكشف الأماكن حسب التصنيف</PopularSubtitle>

            <PopularScroll horizontal showsHorizontalScrollIndicator={false}>
              {popularVenueTypes.map((v) => (
                <TypeCard key={v.id}>
                  <TypeImage source={v.image} resizeMode="cover" />
                  <BlackOverlay>
                    <TypeName>{v.name}</TypeName>
                    <SeeAllButton onPress={() => navigateToCategory(v.name)}>
                      <SeeAllText>عرض الكل</SeeAllText>
                    </SeeAllButton>
                  </BlackOverlay>
                </TypeCard>
              ))}
            </PopularScroll>
          </PopularSection>

          {/* عدد الضيوف */}
          <GuestCountBlock>
            <GuestCountTitle>كم عدد الضيوف لديك؟</GuestCountTitle>
            <GuestCountSubtitle>استكشف الأماكن حسب الحجم</GuestCountSubtitle>

            <SizeBoxesContainer>
              {guestCountSizes.map((s, i) => (
                <SizeBox
                  key={i}
                  onPress={() => navigateToCategory("venues", `size-${i}`)}
                >
                  <SizeBoxText>{s}</SizeBoxText>
                </SizeBox>
              ))}
            </SizeBoxesContainer>
          </GuestCountBlock>

          {/* الموردون لحفل زفافك */}
          <VendorCategoriesSection>
            <VendorCategoriesTitle>موردو حفل زفافك</VendorCategoriesTitle>
            <VendorCategoriesSubtitle>
              استكشف أنواع الموردين
            </VendorCategoriesSubtitle>

            <TwoColumnList>
              {vendorCategories.map((v) => (
                <TwoColumnItem
                  key={v.id}
                  onPress={() => navigateToCategory(v.category)}
                >
                  <TwoColumnIcon source={v.image} resizeMode="cover" />
                  <TwoColumnLabel>{v.name}</TwoColumnLabel>
                </TwoColumnItem>
              ))}
            </TwoColumnList>
          </VendorCategoriesSection>

          <ExploreAllCategoriesTitle>
            استكشف جميع الفئات
          </ExploreAllCategoriesTitle>
          <AllCategoriesList>
            {allCategories.map((c) => (
              <CategoryRow
                key={c.id}
                onPress={() => navigateToCategory(c.category)}
              >
                <CategoryRowIcon source={c.icon} />
                <CategoryRowLabel>{c.name}</CategoryRowLabel>
              </CategoryRow>
            ))}
          </AllCategoriesList>

          <ImageCreditsLink>عرض نسب الصور ▾</ImageCreditsLink>
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
  direction: rtl;
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
  text-align: left;
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
  text-align: left;
`;

const SubTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const SubTitle = styled.Text`
  font-size: 14px;
  color: #444;
  text-align: left;
`;

const LocationLink = styled.TouchableOpacity`
  margin: 0 2px;
`;

const LocationText = styled.Text`
  font-size: 14px;
  color: #0066cc;
  text-decoration-line: underline;
  text-align: left;
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
  padding: 0 20px 20px;
  text-align: left;
`;

/* Search Bar */
const SearchBarContainer = styled.View`
  background-color: #fff;
  border-radius: 8px;
  flex-direction: row-reverse;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 16px;
  text-align: left;
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
  text-align: left;
`;

/* Summary Boxes Row */
const SummaryBoxesContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const SummaryBox = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 8px;
  flex: 1;
  margin-right: 10px;
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
  text-align: left;
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
  text-align: left;
`;

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
  text-align: left;
`;

const InfoBlockSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  text-align: left;
`;

const CardScroll = styled.ScrollView``;

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
  text-align: left;
`;

const VenueRating = styled.Text`
  font-size: 12px;
  color: #333;
  margin-bottom: 2px;
  text-align: left;
`;

const VenueLocation = styled.Text`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
  text-align: left;
`;

const VenueExtra = styled.Text`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
  text-align: left;
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
  text-align: left;
`;

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
  text-align: left;
`;

const LinkText = styled.Text`
  color: #0066cc;
  font-size: 14px;
  margin-left: 20px;
  margin-bottom: 20px;
  text-align: left;
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
  text-align: left;
`;

const PopularSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  text-align: left;
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
  text-align: left;
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
  text-align: left;
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
  text-align: left;
`;

const GuestCountSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  text-align: left;
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
  text-align: left;
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
  text-align: left;
`;

const VendorCategoriesSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  text-align: left;
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
  text-align: left;
`;

const ExploreAllCategoriesTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 20px 10px;
  text-align: left;
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
  text-align: left;
`;

const ImageCreditsLink = styled.Text`
  font-size: 14px;
  color: #0066cc;
  text-align: center;
  margin-bottom: 20px;
  text-align: left;
`;

const TouchableVenueCard = styled.TouchableOpacity`
  width: 220px;
  background-color: #fff;
  border-radius: 8px;
  margin-right: 16px;
  shadow-color: #000;
  shadow-opacity: 0.03;
  shadow-radius: 3px;
  elevation: 3;
  position: relative;
`;

const HeartIconOverlay = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
`;

const VendorHeartIcon = styled.Image`
  width: 24px;
  height: 24px;
  tint-color: ${(props) => (props.isFavorite ? "#e066a6" : "#000")};
`;
