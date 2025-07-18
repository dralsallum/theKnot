import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { uploadUserProfileImage } from "../redux/authSlice";
import {
  Image,
  TouchableOpacity,
  Alert,
  View,
  Button,
  Modal,
  Text,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { publicRequest, createUserRequest } from "../../requestMethods";
import ArrowCirce from "../../assets/icons/arrowCircle.png";
const Popular = require("../../assets/images/popularGift.png");

/* Example icons/images – replace with your own */
const gearIcon = require("../../assets/icons/gear.png");
const bellIcon = require("../../assets/icons/notification.png");
const cameraIcon = require("../../assets/icons/camera.png");
const couplePhoto = require("../../assets/icons/couple.png");
const budgetChart = require("../../assets/icons/budget.png");
const Essential = require("../../assets/images/essential.png");
/* Venues */
const venue1 = require("../../assets/images/venue.jpg");
const venue2 = require("../../assets/images/venue.jpg");
const venue3 = require("../../assets/images/venue.jpg");
const weddingCakeImg = require("../../assets/images/cake.png");
const saveTheDateSticker = require("../../assets/images/announcement.jpg");
const registryIconsImg = require("../../assets/images/registry.png");
const invitationsImg = require("../../assets/images/orange.png");
const detailsImg = require("../../assets/images/detail.png");
const heartIcon = require("../../assets/icons/heart.png");
const heartFilledIcon = require("../../assets/icons/empty-heart.png");

/* --------------------------------
 * CollapsibleCard Component
 * -------------------------------- */
const CollapsibleCard = ({
  title,
  description,
  subDes,
  subTitle,
  mainExtra,
  extra,
  backgroundColor,
  imageSource,
  expanded,
  setExpanded,
  items = [],
  handleClicked,
  handleSecond,
  handleGuest,
  handleLast,
}) => {
  // Collapsed view
  if (!expanded) {
    return (
      <CollapsedSection style={{ backgroundColor }}>
        <TouchableOpacity onPress={() => setExpanded(true)}>
          <CollapsedRow>
            <CollapsedTextContainer>
              <ExtraView>
                <CollapsedTitle>{title} </CollapsedTitle>
                <ArrowDown source={ArrowCirce} />
              </ExtraView>
              <CollapsedDesc>{description}</CollapsedDesc>
            </CollapsedTextContainer>
            <CollapsedImage source={imageSource} resizeMode="contain" />
          </CollapsedRow>
        </TouchableOpacity>
      </CollapsedSection>
    );
  }

  // Expanded layout example
  if (["الإعلانات", "التفاصيل", "الدعوات", "قائمة الهدايا"].includes(title)) {
    return (
      <ExpandedAnnouncementsContainer style={{ backgroundColor }}>
        <AnnouncementHeading>{title}</AnnouncementHeading>
        <AnnouncementSubtitle>{description}</AnnouncementSubtitle>

        <MatchingDesignsTitle>
          مطابقة التصاميم لتناسب أسلوبك
        </MatchingDesignsTitle>
        <TwoItemRow>
          <DesignCard onPress={handleClicked}>
            <DesignImage source={items[0]?.image} resizeMode="cover" />
            <DesignLabel>{items[0]?.title}</DesignLabel>
          </DesignCard>
          <DesignCard onPress={handleSecond}>
            <DesignImage source={items[1]?.image} resizeMode="cover" />
            <DesignLabel>{items[1]?.title}</DesignLabel>
          </DesignCard>
        </TwoItemRow>

        <PinkButton onPress={() => setExpanded(false)}>
          <PinkButtonText>اخفاء التفاصيل</PinkButtonText>
        </PinkButton>

        <BeforeTitle>قبل إرسال بطاقات حفظ التاريخ</BeforeTitle>
        <BulletItemContainer>
          <BulletIcon />
          <BulletText>
            <TouchableOpacity onPress={handleGuest}>
              <BulletTitle>{subTitle} </BulletTitle>
              <BulletDescription>{subDes}</BulletDescription>
            </TouchableOpacity>
          </BulletText>
        </BulletItemContainer>

        <BulletItemContainer>
          <BulletIcon />
          <BulletText>
            <TouchableOpacity onPress={handleLast}>
              <BulletTitle>{mainExtra}</BulletTitle>
              <BulletDescription>{extra}</BulletDescription>
            </TouchableOpacity>
          </BulletText>
        </BulletItemContainer>
      </ExpandedAnnouncementsContainer>
    );
  }

  // Fallback (optional)
  return <ActivityIndicator />;
};

/* --------------------------------
 * Service provider
 * -------------------------------- */

/* --------------------------------
 * ChecklistCardComponent
 * -------------------------------- */
const ChecklistCardComponent = ({ navigateToChecklist }) => {
  const userId = useSelector((s) => s.user.currentUser?._id);
  const [tasks, setTasks] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });

  // مثل الدالة الموجودة في شاشة Checklist
  const handleToggleCompleted = async (task) => {
    try {
      const newStatus = !task.isCompleted;

      // تحديث تفاؤلي
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, isCompleted: newStatus } : t
        )
      );

      // طلب PATCH
      await createUserRequest().patch(
        `/users/${userId}/checklist/${task._id}`,
        { isCompleted: newStatus }
      );
    } catch (err) {
      console.error("toggle error", err);
      // التراجع عند الفشل
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
      Alert.alert("خطأ", "فشل تحديث المهمة");
    }
  };

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const { data } = await createUserRequest().get(
          `/users/${userId}/checklist`
        );
        /* ننتقى أقرب 4 مهام غير مكتملة لها تاريخ استحقاق */
        const upcoming = (data.checklist || [])
          .filter((t) => t.due && !t.isCompleted)
          .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
          .slice(0, 4);

        setTasks(upcoming);
        setState({ loading: false, error: null });
      } catch (err) {
        console.error("ChecklistCard fetch error:", err);
        setState({ loading: false, error: "فشل تحميل المهام" });
      }
    })();
  }, [userId]);

  /* ---------------- RENDER -------------- */
  if (state.loading)
    return (
      <ChecklistCard>
        <ActivityIndicator size="large" color="#ec4899" />
      </ChecklistCard>
    );

  if (state.error)
    return (
      <ChecklistCard>
        <Text style={{ color: "red", textAlign: "center" }}>{state.error}</Text>
      </ChecklistCard>
    );

  return (
    <ChecklistCard>
      <ChecklistHeaderRow>
        <ChecklistTitleRow>
          <ChecklistIcon source={require("../../assets/icons/gear.png")} />
          <ChecklistTitle>المهمة التالية لك</ChecklistTitle>
        </ChecklistTitleRow>

        <TouchableOpacity onPress={navigateToChecklist}>
          <SeeAllTasksText>رؤية كل المهام</SeeAllTasksText>
        </TouchableOpacity>
      </ChecklistHeaderRow>

      {tasks.length === 0 ? (
        <Text
          style={{ paddingVertical: 8, textAlign: "center", color: "#666" }}
        >
          لا توجد مهام قادمة
        </Text>
      ) : (
        tasks.map((t) => (
          <TaskItem key={t._id} onPress={() => handleToggleCompleted(t)}>
            <TaskBullet completed={t.isCompleted} />
            <TaskLabel completed={t.isCompleted}>{t.title}</TaskLabel>
          </TaskItem>
        ))
      )}
    </ChecklistCard>
  );
};

/* --------------------------------
 * MAIN COMPONENT: Home
 * -------------------------------- */
const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const isAuthenticated = !!currentUser; // for favorites check
  const userId = currentUser?._id;
  const [favoriteVendors, setFavoriteVendors] = useState([]);
  const [favoriteVendorData, setFavoriteVendorData] = useState([]);
  const [attendingShow, setAttendingShow] = useState(false);
  const [venues, setVenues] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState(false);
  const [partnerName, setPartnerName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showVenues, setShowVenues] = useState(false);
  const [showVendors, setShowVendors] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showRegistry, setShowRegistry] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("photographers");
  const [modalVisible, setModalVisible] = useState(false);
  const [inputDate, setInputDate] = useState("");
  const [customPhoto, setCustomPhoto] = useState(
    currentUser?.profileImage || null
  );
  const [weddingInfo, setWeddingInfo] = useState({
    weddingDate: null,
    weddingLocation: null,
    weddingCountry: null,
    weddingCity: null,
    partnerName: null,
  });

  // fetch wedding date info
  useEffect(() => {
    if (userId) {
      const fetchWeddingInfo = async () => {
        try {
          const res = await createUserRequest().get(
            `/users/wedding-date/${userId}`
          );
          setWeddingInfo(res.data);
          if (res.data.weddingDate) {
            setInputDate(new Date(res.data.weddingDate).toLocaleDateString());
          }
        } catch (err) {
          setError("Failed to fetch checklist tasks.");
        }
      };
      fetchWeddingInfo();
    }
  }, [userId]);

  // vendor categories
  const vendorCategories = [
    { id: "photographer", name: "Photographers" },
    { id: "videographer", name: "Videographers" },
    { id: "bridal", name: "Bridal Salons" },
    { id: "djs", name: "DJs" },
    { id: "florist", name: "Florists" },
    { id: "caterer", name: "Caterers" },
    { id: "cake", name: "Bakeries" },
    { id: "venues", name: "Venues" },
  ];

  useEffect(() => {
    const fetchName = async () => {
      if (!isAuthenticated || !userId) return;
      try {
        const userReq = createUserRequest();
        const response = await userReq.get(`/users/find/${userId}`);
        setName(response.data.firstName);
        setPartnerName(response.data.partnerName);
      } catch {
        setError("Failed to fetch checklist tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchName();
  }, [isAuthenticated, userId]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || !userId) return;
      try {
        setLoading(true);
        const userReq = createUserRequest();
        const response = await userReq.get(`/users/${userId}/favorites`);

        setFavoriteVendorData(response.data);

        // Also store just the IDs if you need them for heart toggling
        const favoriteIds = response.data.map((vendor) => vendor._id);
        setFavoriteVendors(favoriteIds);
      } catch (err) {
        setError("Failed to fetch checklist tasks.");
      }
    };
    fetchFavorites();
  }, [isAuthenticated, userId]);

  // fetch vendors by category
  useEffect(() => {
    const fetchVendorsByCategory = async (category) => {
      try {
        setLoading(true);
        const res = await publicRequest.get(`/vendors/category/${category}`);
        setVendors(res.data);
      } catch (err) {
        setError(`Failed to fetch ${category} vendors.`);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorsByCategory(selectedCategory);
  }, [selectedCategory]);

  // fetch venues if user expands
  useEffect(() => {
    if (showVenues) {
      const fetchVenues = async () => {
        try {
          setLoading(true);
          const res = await publicRequest.get("/vendors/category/venues");
          setVenues(res.data);
        } catch (err) {
          setError("Failed to fetch venues.");
        } finally {
          setLoading(false);
        }
      };
      fetchVenues();
    }
  }, [showVenues]);

  /* -------------------
   * FAVORITES LOGIC
   * -------------------*/
  const toggleFavoriteVendor = async (vendorId) => {
    if (!isAuthenticated) {
      Alert.alert("Sign in required", "Please sign in to save favorites.");
      return;
    }
    const isFavorited = favoriteVendors.includes(vendorId);

    // Optimistic UI update
    if (isFavorited) {
      setFavoriteVendors(favoriteVendors.filter((id) => id !== vendorId));
      setFavoriteVendorData(
        favoriteVendorData.filter((vObj) => vObj._id !== vendorId)
      );
    } else {
      setFavoriteVendors([...favoriteVendors, vendorId]);
      // Optional: if you want the vendor object too, you can push it from 'vendors' array
      const newlyFavoritedVendor = vendors.find((v) => v._id === vendorId);
      if (newlyFavoritedVendor) {
        setFavoriteVendorData([...favoriteVendorData, newlyFavoritedVendor]);
      }
    }

    try {
      const userReq = createUserRequest();
      if (isFavorited) {
        await userReq.delete(`/users/${userId}/favorites/${vendorId}`);
      } else {
        await userReq.post(`/users/${userId}/favorites`, { vendorId });
      }
    } catch (err) {
      // Revert local state on error
      if (isFavorited) {
        setFavoriteVendors([...favoriteVendors, vendorId]);
        // We can't simply know which vendor object to push back, so might re-fetch
      } else {
        setFavoriteVendors(favoriteVendors.filter((id) => id !== vendorId));
        setFavoriteVendorData(
          favoriteVendorData.filter((vObj) => vObj._id !== vendorId)
        );
      }
    }
  };

  const toggleFavoriteVenue = async (venueId) => {
    if (!isAuthenticated) {
      Alert.alert("Sign in required", "Please sign in to save favorites.");
      return;
    }
    const isFavorited = favoriteVendors.includes(venueId);

    // Optimistic UI update
    if (isFavorited) {
      setFavoriteVendors(favoriteVendors.filter((id) => id !== venueId));
      setFavoriteVendorData(
        favoriteVendorData.filter((vObj) => vObj._id !== venueId)
      );
    } else {
      setFavoriteVendors([...favoriteVendors, venueId]);
      const newlyFavorited = venues.find((v) => v._id === venueId);
      if (newlyFavorited) {
        setFavoriteVendorData([...favoriteVendorData, newlyFavorited]);
      }
    }

    try {
      const userReq = createUserRequest();
      if (isFavorited) {
        await userReq.delete(`/users/${userId}/favorites/${venueId}`);
      } else {
        await userReq.post(`/users/${userId}/favorites`, { vendorId: venueId });
      }
    } catch (err) {
      if (isFavorited) {
        setFavoriteVendors([...favoriteVendors, venueId]);
      } else {
        setFavoriteVendors(favoriteVendors.filter((id) => id !== venueId));
        setFavoriteVendorData(
          favoriteVendorData.filter((vObj) => vObj._id !== venueId)
        );
      }
    }
  };

  /* -------------------------
   * NAVIGATION & HELPERS
   * -------------------------*/
  const navigateToCategory = (category) => {
    setSelectedCategory(category);
  };

  const navigateToVendorDetails = (vendorId) => {
    router.push({
      pathname: "/booking",
      params: { id: vendorId },
    });
  };

  const navigateBasic = (destination) => {
    router.push(destination);
  };

  // open image library
  const handleCameraIconPress = () => {
    launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets?.length
      ) {
        const selected = response.assets[0];
        setCustomPhoto(selected.uri);
        if (userId) {
          try {
            await dispatch(
              uploadUserProfileImage({ userId, imageAsset: selected })
            ).unwrap();
            Alert.alert("Success", "Profile image uploaded successfully!");
          } catch (err) {
            Alert.alert("Upload error", err.toString());
          }
        }
      }
    });
  };

  const calculateDaysLeft = (weddingDate) => {
    const today = new Date();
    const eventDate = new Date(weddingDate);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getVendorImage = (vendor) => {
    if (vendor.images && vendor.images.length > 0) {
      return { uri: vendor.images[0] };
    } else {
      switch (vendor.category?.toLowerCase()) {
        case "photographer":
          return venue1;
        case "videographer":
          return venue2;
        case "djs":
          return venue3;
        default:
          return weddingCakeImg;
      }
    }
  };

  const handleAddWeddingDate = () => {
    setModalVisible(true);
  };

  const handleConfirmDate = async () => {
    const dateParts = inputDate.split("/");
    if (dateParts.length !== 3) {
      Alert.alert("Invalid date format", "Use MM/DD/YYYY format.");
      return;
    }
    const [month, day, year] = dateParts;
    const parsedDate = new Date(year, month - 1, day);
    if (isNaN(parsedDate.getTime())) {
      Alert.alert("Invalid date", "Please enter a valid date.");
      return;
    }
    try {
      const res = await createUserRequest().put(
        `/users/wedding-date/${userId}`,
        {
          weddingDate: parsedDate,
        }
      );
      if (res.data && res.data.data) {
        setWeddingInfo(res.data.data);
        setInputDate(new Date(res.data.data.weddingDate).toLocaleDateString());
      } else {
        setWeddingInfo({ ...weddingInfo, weddingDate: parsedDate });
        setInputDate(parsedDate.toLocaleDateString());
      }
    } catch (err) {
      Alert.alert("Update error", "Error updating the wedding date.");
    }
    setModalVisible(false);
  };

  const handleProductPress = (productId) => {
    router.push(`/(screens)/item?productId=${productId}`);
  };
  const handleRoutePress = (productId) => {
    router.push(productId);
  };

  const VendorCategory = ({ title, subTitle, subCategory }) => {
    // normalize to lowercase once
    const key = subCategory.toLowerCase();

    const savedCount = favoriteVendorData.filter(
      (vendor) => vendor.category && vendor.category.toLowerCase() === key
    ).length;

    return (
      <VendorCategoryWrapper>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/category",
              params: { category: subCategory },
            });
          }}
        >
          <CategoryCircle>
            <Text
              style={{
                fontSize: 32,
                color: "#ff69b4",
                fontWeight: "300",
              }}
            >
              +
            </Text>
          </CategoryCircle>

          <CategoryTitle>{title}</CategoryTitle>
          <CategorySaved>
            {savedCount} {subTitle}
          </CategorySaved>
          <CategoryMessages>0 رسائل</CategoryMessages>
        </TouchableOpacity>
      </VendorCategoryWrapper>
    );
  };

  /* -------------------------
   * RENDER
   * -------------------------*/
  return (
    <Container>
      <Content>
        {/* Top Row */}
        <TopRow>
          <IconButton
            onPress={() => {
              navigateBasic("/setting");
            }}
          >
            <Image source={gearIcon} style={{ width: 24, height: 24 }} />
          </IconButton>

          <AddWeddingDate onPress={handleAddWeddingDate}>
            {weddingInfo.weddingDate
              ? `${calculateDaysLeft(weddingInfo.weddingDate)} يوم متبقي`
              : "+ إضافة تاريخ الزفاف"}
          </AddWeddingDate>

          <IconButton
            onPress={() => {
              navigateBasic("/notification");
            }}
          >
            <Image source={bellIcon} style={{ width: 24, height: 24 }} />
          </IconButton>
        </TopRow>

        {/* Couple Section */}
        <CoupleSection>
          <LeftCol>
            <CoupleNames>
              {name} و {partnerName}
            </CoupleNames>

            <WeddingInfoRow>
              <WeddingInfoIcon
                source={require("../../assets/icons/calendar.png")}
              />
              <WeddingInfoText>
                {weddingInfo.weddingDate
                  ? new Date(weddingInfo.weddingDate).toLocaleDateString()
                  : "+ إضافة تاريخ الزفاف"}
              </WeddingInfoText>
            </WeddingInfoRow>

            <LocationRow>
              <LocationIcon
                source={require("../../assets/icons/location.png")}
              />
              <LocationText>
                {weddingInfo.weddingCountry}, {weddingInfo.weddingLocation}
              </LocationText>
            </LocationRow>
          </LeftCol>

          <RightCol>
            <PhotoCardContainer>
              <PhotoImage
                source={customPhoto ? { uri: customPhoto } : couplePhoto}
                resizeMode="cover"
              />
              <CameraButtonContainer onPress={handleCameraIconPress}>
                <CameraIcon source={cameraIcon} />
              </CameraButtonContainer>
            </PhotoCardContainer>
          </RightCol>
        </CoupleSection>

        {/* Budget Advisor Card */}
        <BudgetCard
          onPress={() => {
            navigateBasic("/budget");
          }}
        >
          <BudgetTextContainer>
            <BudgetTitle>مستشار الميزانية</BudgetTitle>
            <BudgetSubtitle>
              استكشف تكاليف الزفاف الحقيقية في منطقتك.
            </BudgetSubtitle>
          </BudgetTextContainer>
          <BudgetChartImg source={budgetChart} />
        </BudgetCard>

        {/* Venues Section (Toggle) */}
        {!showVenues && (
          <VenuesSectionCollapsed>
            <TouchableOpacity onPress={() => setShowVenues(true)}>
              <VenuesRowCollapsed>
                <VenuesTextContainer>
                  <ExtraView>
                    <VenuesTitle>أماكن الزفاف</VenuesTitle>
                    <ArrowDown source={ArrowCirce} />
                  </ExtraView>

                  <VenuesDesc>
                    ابحث عن المكان المناسب لإقامة حفل الزفاف.
                  </VenuesDesc>
                </VenuesTextContainer>
                <VenuesImg source={venue1} resizeMode="cover" />
              </VenuesRowCollapsed>
            </TouchableOpacity>
          </VenuesSectionCollapsed>
        )}

        {/* Venues Expanded */}
        {showVenues && (
          <>
            <VenuesHeader>استكشاف أماكن الزفاف</VenuesHeader>
            <VenuesWrapper>
              <VenuesRow>
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
                    venues
                      .slice(-5)
                      .reverse()
                      .map((venue) => (
                        <TouchableVenueCard
                          key={venue._id}
                          onPress={() => navigateToVendorDetails(venue._id)}
                        >
                          <VenueImage
                            source={venue.image ? { uri: venue.image } : venue1}
                            resizeMode="cover"
                          />
                          {/* Heart button for venues */}
                          <HeartButton
                            onPress={() => {
                              toggleFavoriteVenue(venue._id);
                            }}
                          >
                            <Image
                              source={
                                favoriteVendors.includes(venue._id)
                                  ? heartFilledIcon
                                  : heartIcon
                              }
                              style={{
                                width: 20,
                                height: 20,
                                tintColor: favoriteVendors.includes(venue._id)
                                  ? "#ec4899"
                                  : "#000",
                              }}
                            />
                          </HeartButton>

                          <VenueCardContent>
                            <VenueTitle>{venue.name}</VenueTitle>

                            <VenueRating>
                              ⭐ {venue.rating} ({venue.numReviews || 0})
                            </VenueRating>
                            <VenueLocation>{venue.location}</VenueLocation>
                            <VenueExtra>
                              {venue.guestRange || "غير متاح"} •{" "}
                              {venue.priceRange}
                            </VenueExtra>
                            {venue.badges?.map((badge) => (
                              <Badge key={badge}>{badge}</Badge>
                            ))}
                          </VenueCardContent>
                        </TouchableVenueCard>
                      ))}
                </CardScroll>
              </VenuesRow>
            </VenuesWrapper>

            <ExploreButton onPress={() => setShowVenues(false)}>
              <ExploreButtonText>إخفاء أماكن الزفاف</ExploreButtonText>
            </ExploreButton>

            <HelpSectionTitle>للمساعدة في البحث</HelpSectionTitle>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/category",
                  params: { category: selectedCategory },
                })
              }
            >
              <LinkText>هل حجزت مكان الزفاف؟ أضف معلومات المكان</LinkText>
            </TouchableOpacity>
          </>
        )}

        {/* Vendors Section - Collapsed/Expanded */}
        {!showVendors ? (
          <VendorsSection>
            <TouchableOpacity onPress={() => setShowVendors(true)}>
              <VendorsRow>
                <VendorsTextContainer>
                  <ExtraView>
                    <VendorsTitle>مزودي الخدمات </VendorsTitle>
                    <ArrowDown source={ArrowCirce} />
                  </ExtraView>
                  <VendorsDesc>
                    تواصل مع المصورين، منسقي الموسيقى، منسقي الزهور والمزيد.
                  </VendorsDesc>
                </VendorsTextContainer>
                <VendorsImg source={weddingCakeImg} />
              </VendorsRow>
            </TouchableOpacity>
          </VendorsSection>
        ) : (
          <>
            <VenuesHeader>استكشاف مزودي الخدمات</VenuesHeader>

            {/* Vendor Category horizontal scroll */}
            <CategoryList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {vendorCategories.map((category) => (
                <CategoryButton
                  key={category.id}
                  selected={selectedCategory === category.id}
                  onPress={() => navigateToCategory(category.id)}
                >
                  <CategoryText selected={selectedCategory === category.id}>
                    {category.name}
                  </CategoryText>
                </CategoryButton>
              ))}
            </CategoryList>

            <VenuesWrapper>
              <VenuesRow>
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

                        {/* Heart button for vendors */}
                        <HeartButton
                          onPress={() => {
                            toggleFavoriteVendor(vendor._id);
                          }}
                        >
                          <Image
                            source={
                              favoriteVendors.includes(vendor._id)
                                ? heartFilledIcon
                                : heartIcon
                            }
                            style={{
                              width: 20,
                              height: 20,
                              tintColor: favoriteVendors.includes(vendor._id)
                                ? "#ec4899"
                                : "#000",
                            }}
                          />
                        </HeartButton>

                        <VenueCardContent>
                          <VenueTitle>{vendor.name}</VenueTitle>
                          <VenueRating>
                            ⭐ {vendor.rating} ({vendor.numReviews || 0})
                          </VenueRating>
                          <VenueLocation>{vendor.location}</VenueLocation>
                          <VenueExtra>
                            {vendor.guestRange || "غير متاح"} •{" "}
                            {vendor.priceRange}
                          </VenueExtra>
                          {vendor.badges?.map((badge) => (
                            <Badge key={badge}>{badge}</Badge>
                          ))}
                        </VenueCardContent>
                      </TouchableVenueCard>
                    ))}
                </CardScroll>
              </VenuesRow>

              <SeeAllButton
                onPress={() =>
                  router.push({
                    pathname: "/category",
                    params: { category: selectedCategory },
                  })
                }
              >
                <SeeAllText>
                  شاهد الكل
                  {vendorCategories
                    .find((c) => c.id === selectedCategory)
                    ?.name.toLowerCase()}
                </SeeAllText>
              </SeeAllButton>

              <VenuesSubHeader>أثناء بحثك عن مزودي الخدمات</VenuesSubHeader>

              <BudgetEstimatesCard
                onPress={() => {
                  navigateBasic("/budget");
                }}
              >
                <SeeText>شاهد تقديرات الميزانية</SeeText>
                <SeeSubText>
                  احصل على تفصيل لما ينفقه الأزواج على كل مزود خدمة.
                </SeeSubText>
              </BudgetEstimatesCard>

              <VendorsManagementRow>
                <Text style={{ fontSize: 24, fontWeight: "700" }}>
                  مزودي الخدمات بك
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/creative");
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#0066cc" }}>
                    إدارتهم
                  </Text>
                </TouchableOpacity>
              </VendorsManagementRow>

              {/* ------------------------------------------
                  VendorCategoriesContainer section
                  ------------------------------------------ */}

              <VendorCategoriesContainer
                onPress={() => {
                  router.push({
                    pathname: "/category",
                    params: { category: "photographers" },
                  });
                }}
              >
                {/* Bridal Salons */}
                <VendorCategory
                  title="المصورون"
                  subTitle="محفوظ"
                  subCategory="photographers"
                />
                <VendorCategory
                  title="صالونات العرائس"
                  subTitle="محفوظ"
                  subCategory="bridal"
                />
                <VendorCategory
                  title="متعهدي الطعام"
                  subTitle="محفوظ"
                  subCategory="caterer"
                />
              </VendorCategoriesContainer>

              <ExploreButton onPress={() => setShowVendors(false)}>
                <ExploreButtonText>إخفاء مزودي الخدمات</ExploreButtonText>
              </ExploreButton>
            </VenuesWrapper>
          </>
        )}

        {/* Announcements Section */}
        <CollapsibleCard
          title="الإعلانات"
          subTitle="أنشئ قائمة ضيوفك "
          mainExtra="الرد على الدعوة"
          subDes="ابدأ في نشر الخبر مع حفظ التواريخ وموقع مجاني."
          description="اعرف بالضبط من سيحضر زواجك قبل ان تبدا التحضير له"
          extra="احتفظ بعناوين ضيوفك وخطط لدعواتك خلال دقائق"
          backgroundColor="#fff"
          imageSource={saveTheDateSticker}
          expanded={showAnnouncements}
          setExpanded={setShowAnnouncements}
          handleClicked={() => handleProductPress("6846ee45c6d5edc83794caad")}
          handleSecond={() => handleProductPress("6846ee45c6d5edc83794caad")}
          handleGuest={() => {
            navigateBasic("/guest");
          }}
          handleLast={() => {
            navigateBasic("/guest");
          }}
          items={[
            {
              image: saveTheDateSticker,
              title: "احفظ التاريخ",
            },
            {
              image: weddingCakeImg,
              title: "مستلزمات المنزل",
            },
          ]}
        />

        {/* Registry */}
        <CollapsibleCard
          title="قائمة الهدايا"
          subTitle="اغراض المنزل"
          subDes="هدايا الضيوف ليس من الضروري ان تكون عشواية حددها لهم"
          mainExtra="مساهمة الناس"
          description="اجعل من السهل على الضيوف العثور على كل هدية تريدها في مكان واحد."
          extra="اجعل من السهل على الضيوف المساهمة في زواجك والعثور على جميع تفاصيل
               في مكان واحد"
          backgroundColor="#a0d9ff"
          imageSource={registryIconsImg}
          expanded={showRegistry}
          setExpanded={setShowRegistry}
          handleClicked={() => handleRoutePress("stories")}
          handleSecond={() => handleRoutePress("stories")}
          handleGuest={() => {
            navigateBasic("/stories");
          }}
          handleLast={() => {
            navigateBasic("/guest");
          }}
          items={[
            {
              image: Popular,
              title: "اكثر الهدايا المرغوبة",
            },
            {
              image: Essential,
              title: "الاغراض الاساسية",
            },
          ]}
        />

        {/* Invitations */}
        <CollapsibleCard
          title="الدعوات"
          description="أنشئ دعوات جميلة تناسب ميزانيتك وتشعر وكأنها أنت."
          subTitle="أنشئ قائمة ضيوفك "
          mainExtra="الرد على الدعوة"
          subDes="ابدأ في نشر الخبر مع حفظ التواريخ وموقع مجاني."
          extra="احتفظ بعناوين ضيوفك وخطط لدعواتك خلال دقائق"
          backgroundColor="#ff9000"
          imageSource={invitationsImg}
          expanded={showInvitations}
          setExpanded={setShowInvitations}
          handleClicked={() => handleProductPress("6846ee45c6d5edc83794caad")}
          handleSecond={() => handleRoutePress("stories")}
          handleGuest={() => {
            navigateBasic("/guest");
          }}
          handleLast={() => {
            navigateBasic("/guest");
          }}
          items={[
            {
              image: saveTheDateSticker,
              title: "بطاقة الزواج",
            },
            {
              image: weddingCakeImg,
              title: "موقع الزفاف",
            },
          ]}
        />

        {/* Details */}
        <CollapsibleCard
          title="التفاصيل"
          description="من بطاقات الأماكن إلى كتب الضيوف، التفاصيل تضيف تميزاً ليومك."
          subTitle="أنشئ قائمة ضيوفك "
          mainExtra="الرد على الدعوة"
          subDes="ابدأ في نشر الخبر مع حفظ التواريخ وموقع مجاني."
          extra="احتفظ بعناوين ضيوفك وخطط لدعواتك خلال دقائق"
          backgroundColor="#fff"
          imageSource={detailsImg}
          expanded={showDetails}
          setExpanded={setShowDetails}
          handleClicked={() => handleProductPress("6846ee45c6d5edc83794caad")}
          handleSecond={() => handleRoutePress("stories")}
          handleGuest={() => {
            navigateBasic("/guest");
          }}
          handleLast={() => {
            navigateBasic("/guest");
          }}
          items={[
            {
              image: saveTheDateSticker,
              title: "اختار الورد",
            },
            {
              image: weddingCakeImg,
              title: "اختار المغنية",
            },
          ]}
        />

        {/* YOUR WEDDING */}
        <YourWeddingTitle>زفافك</YourWeddingTitle>

        {/* Next on your checklist */}
        <ChecklistCardComponent
          navigateToChecklist={() => {
            navigateBasic("/checklist");
          }}
        />

        {/* Guests & RSVPs */}
        <GuestsCard>
          <GuestsHeaderRow>
            <GuestsTitleRow>
              <GuestsIcon source={gearIcon} />
              <GuestsTitle>الضيوف والردود</GuestsTitle>
            </GuestsTitleRow>
            <TouchableOpacity
              onPress={() => {
                navigateBasic("/guest");
              }}
            >
              <AddGuestsLink>إضافة ضيوف</AddGuestsLink>
            </TouchableOpacity>
          </GuestsHeaderRow>

          <GuestsCountRow>
            <GuestsCountNumber>0</GuestsCountNumber>
            <GuestsCountLabel>ضيف</GuestsCountLabel>
          </GuestsCountRow>
          {attendingShow ? (
            <AcceptCountRow>
              <DetailCountRow>
                <Text>0</Text>
                <Text>رفض</Text>
              </DetailCountRow>
              <DetailCountRow>
                <Text>0</Text>
                <Text>وافق</Text>
              </DetailCountRow>
            </AcceptCountRow>
          ) : null}
          <GuestsDesc>
            احتفظ بجميع معلومات ضيوفك وردودهم منظمة لكل حدث.
          </GuestsDesc>
        </GuestsCard>

        {/* Quote Section */}
        <QuoteSection>
          <QuoteText>
            "أحبك لكل ما أنت عليه، وكل ما كنت عليه وكل ما ستكون عليه."
          </QuoteText>
          <QuoteDecorRow>
            <DecorIcon source={heartIcon} />
            <DecorIcon source={heartIcon} />
          </QuoteDecorRow>
        </QuoteSection>

        {/* Wedding Date Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <View
              style={{
                width: 300,
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                أدخل تاريخ الزفاف
              </Text>
              <TextInput
                style={{
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginBottom: 10,
                  paddingHorizontal: 10,
                }}
                placeholder="شهر/يوم/سنة"
                value={inputDate}
                onChangeText={setInputDate}
              />
              <Button title="تأكيد" onPress={handleConfirmDate} />
              <View style={{ marginTop: 10 }}>
                <Button title="إلغاء" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      </Content>
    </Container>
  );
};

export default Home;

/* --------------------------------
 * STYLED COMPONENTS
 * -------------------------------- */

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #fdf8f2;
  direction: rtl;
`;

const Content = styled.ScrollView.attrs(() => ({}))``;

const TopRow = styled.View`
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #ffffff;
`;

const IconButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

const AddWeddingDate = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

/* Couple Section */
const CoupleSection = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 20px;
  background-color: #ffffff;
`;

const LeftCol = styled.View`
  flex: 1;
  padding-right: 16px;
  justify-content: center;
`;

const RightCol = styled.View`
  width: 160px;
  height: 160px;
  transform: rotate(-5deg);
`;

const CoupleNames = styled.Text`
  font-size: 30px;
  font-weight: 800;
  color: #000;
  margin-bottom: 8px;
`;

const WeddingInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

const WeddingInfoIcon = styled.Image`
  width: 16px;
  height: 16px;
  tint-color: #222;
  margin-right: 6px;
`;

const WeddingInfoText = styled.Text`
  font-size: 14px;
  color: #0066cc;
  text-decoration-line: underline;
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
`;

const LocationIcon = styled.Image`
  width: 16px;
  height: 16px;
  tint-color: #222;
  margin-right: 6px;
`;

const LocationText = styled.Text`
  font-size: 14px;
  color: #333;
`;

/* Photo container (polaroid style) */
const PhotoCardContainer = styled.View`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fdf8f2;
  border-radius: 8px;
  padding: 4px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 3;
  border: 2px #636363;
`;

const PhotoImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 4px;
`;

const CameraButtonContainer = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ff69b4aa;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
`;

const CameraIcon = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: #fff;
`;

/* Budget Advisor Card */
const BudgetCard = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 12px;
  padding: 12px;
  margin: 10px 20px 20px 20px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
  flex-direction: row;
  align-items: center;
`;

const BudgetTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const BudgetTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 3px;
  text-align: left;
`;

const BudgetSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: left;
`;

const SeeText = styled.Text`
  font-size: 18px;
  color: #000;
  text-align: left;
  font-weight: 700;
  margin: 0 0 8px 0;
`;
const SeeSubText = styled.Text`
  font-size: 16px;
  color: #333;
  text-align: left;
`;

const BudgetChartImg = styled.Image`
  width: 50px;
  height: 50px;
`;

/* Venues (Collapsed) */
const VenuesSectionCollapsed = styled.View`
  background-color: #fff;
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 16px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const VenuesRowCollapsed = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const VenuesTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const VenuesTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
  text-align: left;
`;

const VenuesDesc = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: left;
`;

const VenuesImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

/* Venues (Expanded) */
const VenuesHeader = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin: 0 20px 5px;
  text-align: left;
`;

const VenuesWrapper = styled.View`
  margin-bottom: 20px;
`;

const VenuesRow = styled.ScrollView.attrs(() => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
}))`
  padding-right: 20px;
`;

const CardScroll = styled.ScrollView``;

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

const TouchableVenueCard = styled.TouchableOpacity`
  width: 220px;
  background-color: #fff;
  border-radius: 8px;
  margin-left: 16px;
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
const ExtraView = styled.View`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const ArrowDown = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 17.5px; /* or whatever fixed size you need */
  height: 17.5px;
  /* tint-color is how styled-components passes tintColor under the hood */
  tint-color: #000;
`;

const VenueCardContent = styled.View`
  padding: 8px;
`;

const VenueTitle = styled.Text`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

const VenueRating = styled.Text`
  font-size: 12px;
  margin-bottom: 2px;
  color: #333;
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
  margin-top: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #000;
  background-color: #e0e0e0;
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
`;

const HeartButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ExploreButton = styled.TouchableOpacity`
  background-color: #ff69b4;
  padding: 14px 20px;
  margin: 10px 20px 20px;
  border-radius: 28px;
  align-items: center;
  justify-content: center;
`;

const ExploreButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const HelpSectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 20px 10px;
  text-align: left;
`;

const LinkText = styled.Text`
  color: #0066cc;
  font-size: 14px;
  margin: 0 20px 20px;
  text-align: left;
`;

/* Vendors (Collapsed) */
const VendorsSection = styled.View`
  background-color: #ffcb05;
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 16px;
`;

const VendorsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const VendorsTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const VendorsTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
  text-align: left;
`;

const VendorsDesc = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: left;
`;

const VendorsImg = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

/* 2-Col Vendors / Category */
const CategoryList = styled.ScrollView`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const CategoryButton = styled.TouchableOpacity`
  padding: 12px 20px;
  border-radius: 50px;
  margin-right: 10px;
  background-color: ${(props) => (props.selected ? "#ec4899" : "#f0f0f0")};
`;

const CategoryText = styled.Text`
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
  color: ${(props) => (props.selected ? "#ffffff" : "#000000")};
  font-size: 16px;
`;

const SeeAllButton = styled.TouchableOpacity`
  background-color: #ff69b4;
  padding: 15px;
  border-radius: 50px;
  margin: 15px 20px;
  align-items: center;
`;

const SeeAllText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const VenuesSubHeader = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #000;
  margin: 20px 0px 0px 20px;
  text-align: left;
`;

const BudgetEstimatesCard = styled.TouchableOpacity`
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const VendorsManagementRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
`;

const VendorCategoriesContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 0 10px;
  margin-bottom: 10px;
`;

const VendorCategoryWrapper = styled.View`
  align-items: center;
`;

const CategoryCircle = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #f2f2f2;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const CategoryTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

const CategorySaved = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-top: 5px;
`;

const CategoryMessages = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: center;
`;

const CollapsedSection = styled.View`
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 16px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const CollapsedRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CollapsedTextContainer = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const CollapsedTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
  text-align: left;
`;

const CollapsedDesc = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  text-align: left;
`;

const CollapsedImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

const ExpandedAnnouncementsContainer = styled.View`
  background-color: #fff;
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 16px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const AnnouncementHeading = styled.Text`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #000;
  text-align: left;
`;

const AnnouncementSubtitle = styled.Text`
  font-size: 14px;
  color: #333;
  margin-bottom: 16px;
  text-align: left;
`;

const MatchingDesignsTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #000;
  text-align: left;
`;

const TwoItemRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const DesignCard = styled.TouchableOpacity`
  width: 48%;
  border-radius: 8px;
  background-color: #fff;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
  overflow: hidden;
`;

const DesignImage = styled.Image`
  width: 100%;
  height: 100px;
  border-radius: 8px;
`;

const DesignLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  margin: 8px;
  color: #000;
  text-align: left;
`;

const PinkButton = styled.TouchableOpacity`
  background-color: #ec4899;
  border-radius: 28px;
  padding: 14px 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const PinkButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const BeforeTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #000;
  text-align: left;
`;

const BulletIcon = styled.View`
  width: 6px;
  height: 6px;
  background-color: #333;
  border-radius: 3px;
  margin-right: 8px;
  margin-top: 8px;
`;

const BulletText = styled.View`
  flex: 1;
`;

const BulletTitle = styled.Text`
  font-weight: bold;
  font-size: 14px;
  text-align: left;
`;

const BulletDescription = styled.Text`
  font-size: 14px;
  color: #333;
  margin-top: 4px;
  text-align: left;
`;

const BulletItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  margin-bottom: 8px;
  padding: 8px;
  border-width: 1px;
  border-color: #000;
  border-radius: 4px;
`;

const SeeAllTasksText = styled.Text`
  font-size: 14px;
  color: #0066cc;
`;

const QuoteSection = styled.View`
  background-color: #fdf8f2;
  padding: 40px 20px;
  align-items: center;
  justify-content: center;
`;

const QuoteText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #000;
  text-align: center;
  line-height: 28px;
  margin-bottom: 20px;
`;

const QuoteDecorRow = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;

const DecorIcon = styled.Image`
  width: 24px;
  height: 24px;
  margin: 0 4px;
`;

/* YOUR WEDDING */
const YourWeddingTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin: 20px;
  text-align: left;
`;

const ChecklistCard = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin: 0 20px 20px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const ChecklistHeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ChecklistTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ChecklistIcon = styled.Image`
  width: 18px;
  height: 18px;
  margin-right: 6px;
`;

const ChecklistTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const TaskItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const TaskBullet = styled.View`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  margin-right: 8px;
  border: 2px solid #c9c9c9;
  background-color: ${({ completed }) =>
    completed ? "#c9c9c9" : "transparent"};
`;

const TaskLabel = styled.Text`
  flex: 1;
  color: ${({ completed }) => (completed ? "#999" : "#000")};
  text-decoration-line: ${({ completed }) =>
    completed ? "line-through" : "none"};
  text-align: left;
`;

const GuestsCard = styled.View`
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin: 0 20px 20px;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 3;
`;

const GuestsHeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const GuestsTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const GuestsIcon = styled.Image`
  width: 18px;
  height: 18px;
  margin-right: 6px;
`;

const GuestsTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const AddGuestsLink = styled.Text`
  font-size: 14px;
  color: #0066cc;
`;

const GuestsCountRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 4px;
`;
const AcceptCountRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 4px;
  gap: 12px;
`;
const DetailCountRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 4px;
  gap: 4px;
`;

const GuestsCountNumber = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: #000;
  margin-right: 4px;
`;

const GuestsCountLabel = styled.Text`
  font-size: 14px;
  color: #333;
`;

const GuestsDesc = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: left;
`;
