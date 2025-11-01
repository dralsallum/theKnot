import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";
import { publicRequest, createUserRequest } from "../../requestMethods";
import { useSelector } from "react-redux"; // Import Redux selector
import axios from "axios";

const { width } = Dimensions.get("window");
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 44 : StatusBar.currentHeight;
const BASE_URL = "https://theknot-30278e2ff419.herokuapp.com/api";

// ---------- STYLED COMPONENTS ----------
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  direction: rtl;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: ${STATUSBAR_HEIGHT + 30}px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  z-index: 10;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`;

const HeaderButtonsContainer = styled.View`
  position: absolute;
  top: ${STATUSBAR_HEIGHT + 30}px;
  right: 20px;
  flex-direction: row;
  z-index: 10;
`;

const ShareButton = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`;

const FavoriteButton = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 5;
`;

const CarouselContainer = styled.View`
  width: 100%;
  height: 380px;
`;

const CarouselImage = styled.Image`
  width: ${width}px;
  height: 380px;
`;

const OfferBadge = styled.View`
  position: absolute;
  top: ${STATUSBAR_HEIGHT + 80}px;
  left: 20px;
  background-color: rgba(255, 105, 180, 0.9);
  border-radius: 12px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
  z-index: 6;
`;

const OfferText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const PageDotsContainer = styled.View`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 6;
`;

const PageDots = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PageDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.active ? "#ffffff" : "rgba(255,255,255,0.5)"};
  margin-horizontal: 4px;
`;

const PageIndicator = styled.View`
  position: absolute;
  bottom: 30px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  padding-horizontal: 10px;
  padding-vertical: 4px;
  z-index: 6;
`;

const PageIndicatorText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-align: left;
`;

const ContentContainer = styled.View`
  padding-horizontal: 24px;
  padding-vertical: 24px;
  flex: 1;
  padding-bottom: 100px;
  margin-top: -24px;
  background-color: white;
  z-index: 4;
`;

const VenueTitle = styled.Text`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: left;
`;

const VenueSubtitle = styled.Text`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
  text-align: left;
`;

const LocationRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  padding: 12px 16px;
  border-radius: 12px;
`;

const LocationText = styled.Text`
  font-size: 16px;
  margin-left: 10px;
  color: #333;
  text-align: left;
`;

const InfoCard = styled.View`
  background-color: #f9f9f9;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
`;

const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const RatingLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RatingText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-left: 8px;
  text-align: left;
`;

const ReviewLink = styled.TouchableOpacity`
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
`;

const ReviewLinkText = styled.Text`
  font-size: 14px;
  color: #555;
  font-weight: 500;
  text-align: left;
`;

const VenueRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

const VenueType = styled.View`
  background-color: #ff69b4;
  padding: 6px 12px;
  border-radius: 20px;
`;

const VenueTypeText = styled.Text`
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  color: white;
  font-weight: bold;
  text-align: left;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #eee;
  margin-vertical: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: left;
`;

const PriceRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
  margin-top: 8px;
`;

const PriceInfo = styled.View`
  margin-left: 12px;
`;

const PriceText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: left;
`;

const PriceDetails = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
  text-align: left;
`;

const FeatureRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
  justify-content: space-between;
`;

const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  padding: 10px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
  width: 48%;
`;

const FeatureText = styled.Text`
  font-size: 14px;
  margin-left: 8px;
  color: #555;
  text-align: left;
`;

const ResponseTime = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  padding: 12px 16px;
  border-radius: 24px;
`;

const ResponseTimeText = styled.Text`
  font-size: 14px;
  margin-left: 8px;
  color: #666;
  text-align: left;
`;

const ButtonsRowWrapper = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding-horizontal: 24px;
  padding-vertical: 25px;
  border-top-width: 1px;
  border-top-color: #eee;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 8;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const CallButton = styled.TouchableOpacity`
  flex: 1;
  background-color: white;
  border-radius: 16px;
  border-width: 2px;
  border-color: #ff69b4;
  padding-vertical: 16px;
  align-items: center;
  margin-right: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 2;
`;

const CallButtonText = styled.Text`
  color: #ff69b4;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
`;

const QuoteButton = styled.TouchableOpacity`
  flex: 1.5;
  background-color: #ff69b4;
  border-radius: 16px;
  padding-vertical: 16px;
  align-items: center;
  margin-left: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  elevation: 4;
`;

const QuoteButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// ---------- MODAL STYLES ----------
const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

const ModalCard = styled.View`
  width: 90%;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
  text-align: left;
`;

const StepIndicator = styled.Text`
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
  text-align: center;
  text-align: left;
`;

const FormField = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding-horizontal: 12px;
  padding-vertical: 10px;
  margin-bottom: 12px;
  text-align: left;
`;

const ModalButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
`;

const ModalButton = styled.TouchableOpacity`
  flex: 1;
  margin-horizontal: 8px;
  background-color: ${(props) => (props.primary ? "#ff69b4" : "#f0f0f0")};
  padding-vertical: 12px;
  border-radius: 8px;
  align-items: center;
`;

const ModalButtonText = styled.Text`
  color: ${(props) => (props.primary ? "#fff" : "#333")};
  font-weight: bold;
  text-align: left;
`;

const CallModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
  align-items: center;
`;

const CallModalCard = styled.View`
  width: 100%;
  background-color: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px;
`;

const CallModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
`;
const ErrorText = styled.Text`
  font-size: 14px;
  text-align: left;
  color: #ff1e1e;
`;

const CallOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const CallOptionText = styled.Text`
  font-size: 18px;
  margin-left: 16px;
  text-align: left;
`;

const CancelButton = styled.TouchableOpacity`
  margin-top: 16px;
  background-color: #f0f0f0;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
`;

const CancelButtonText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  text-align: left;
`;

const PriceCon = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const SuccessContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #fff;
`;

const SuccessIcon = styled.View`
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
`;

const SuccessTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #ff69b4;
  text-align: center;
  margin-bottom: 15px;
  font-family: ${Platform.OS === "ios" ? "System" : "Roboto"};
`;

const SuccessMessage = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  line-height: 24px;
  margin-bottom: 30px;
  padding: 0 10px;
  font-family: ${Platform.OS === "ios" ? "System" : "Roboto"};
`;

const SuccessButton = styled.TouchableOpacity`
  background-color: #ff69b4;
  padding: 15px 30px;
  border-radius: 8px;
  min-width: 200px;
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const SuccessButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  font-family: ${Platform.OS === "ios" ? "System" : "Roboto"};
`;

const Booking = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const isAuthenticated = !!currentUser;
  const userId = currentUser?._id || null;
  const userTag = useSelector((state) => state.user?.currentUser?.userTag);
  const [userFavorites, setUserFavorites] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [weddingDetails, setWeddingDetails] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Validation state
  const [emailError, setEmailError] = useState("");
  const [dateError, setDateError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const accessToken = useSelector(
    (state) => state.user?.currentUser?.accessToken
  );

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDate = (dateString) => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(dateRegex);

    if (!match) return false;

    const [, day, month, year] = match;
    const date = new Date(year, month - 1, day);

    // Check if the date is valid and not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      date.getDate() == day &&
      date.getMonth() == month - 1 &&
      date.getFullYear() == year &&
      date >= today
    );
  };

  // Handle email input change
  const handleEmailChange = (text) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError("يرجى إدخال بريد إلكتروني صحيح");
    } else {
      setEmailError("");
    }
  };

  // Handle date input change
  const handleDateChange = (text) => {
    setWeddingDate(text);

    if (text.length === 10) {
      if (!validateDate(text)) {
        setDateError("يرجى إدخال تاريخ صحيح (يوم/شهر/سنة) في المستقبل");
      } else {
        setDateError("");
      }
    } else if (text.length > 0) {
      setDateError("يرجى إدخال التاريخ بصيغة يوم/شهر/سنة");
    } else {
      setDateError("");
    }
  };

  // Validate form step 1
  const validateStep1 = () => {
    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = "الاسم الأول مطلوب";
    }

    if (!lastName.trim()) {
      errors.lastName = "اسم العائلة مطلوب";
    }

    if (!email.trim()) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!validateEmail(email)) {
      errors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!weddingDate.trim()) {
      errors.weddingDate = "تاريخ الزفاف مطلوب";
    } else if (!validateDate(weddingDate)) {
      errors.weddingDate = "يرجى إدخال تاريخ صحيح في المستقبل";
    }

    if (!guestCount.trim()) {
      errors.guestCount = "عدد الضيوف مطلوب";
    } else if (isNaN(guestCount) || parseInt(guestCount) <= 0) {
      errors.guestCount = "يرجى إدخال رقم صحيح لعدد الضيوف";
    }

    return errors;
  };

  // Fetch venue details
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const res = await publicRequest.get(`/vendors/${id}`);
        setVenue(res.data);
      } catch (err) {
        setError("فشل في جلب تفاصيل القاعة.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVenue();
    }
  }, [id]);

  // Fetch user favorites (if logged in)
  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (!isAuthenticated || !userId) return;

      try {
        const userReq = createUserRequest();
        const response = await userReq.get(`/users/${userId}/favorites`);
        if (Array.isArray(response.data)) {
          const favoriteIds = response.data.map((fav) =>
            fav._id ? fav._id : fav
          );
          setUserFavorites(favoriteIds);

          if (id && favoriteIds.includes(id)) {
            setIsFavorite(true);
          }
        }
      } catch (err) {
        console.log("خطأ في جلب المفضلات:", err);
      }
    };

    fetchUserFavorites();
  }, [isAuthenticated, userId, id]);

  // Toggle favorite functionality
  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    if (!id) return;

    try {
      const userReq = createUserRequest();
      setIsFavorite(!isFavorite);

      if (isFavorite) {
        setUserFavorites((prev) => prev.filter((item) => item !== id));
        await userReq.delete(`/users/${userId}/favorites/${id}`);
      } else {
        setUserFavorites((prev) => [...prev, id]);
        await userReq.post(`/users/${userId}/favorites`, { vendorId: id });
      }
    } catch (err) {
      console.log("خطأ في تبديل المفضلة:", err);
      setIsFavorite(!isFavorite);
    }
  };

  const onScrollEnd = (e) => {
    let contentOffset = e.nativeEvent.contentOffset.x;
    let index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const handleOpenQuoteModal = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setWeddingDate("");
    setGuestCount("");
    setPhoneNumber("");
    setWeddingDetails("");
    setFormStep(1);
    setEmailError("");
    setDateError("");
    setFormErrors({});
    setSuccess(false);
    setSubmitting(false);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setFormErrors({});
    setEmailError("");
    setDateError("");
    setSuccess(false);
    setSubmitting(false);
    setFormStep(1);
  };

  const handleNextStep = () => {
    if (formStep === 1) {
      const errors = validateStep1();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
      setFormStep(2);
    }
  };

  const handlePreviousStep = () => {
    if (formStep === 2) {
      setFormStep(1);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const step1Errors = validateStep1();
    if (Object.keys(step1Errors).length > 0) {
      setFormErrors(step1Errors);
      setFormStep(1);
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/quota/vendor`,
        {
          firstName: firstName,
          lastName: lastName,
          vendor: id,
          email: email,
          phoneNumber: phoneNumber,
          weddingDate: weddingDate,
          weddingDetails: weddingDetails,
          userTag,
          guestCount: parseInt(guestCount),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuccess(true);
      setFormStep(3);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "An error occurred"
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setModalVisible(false);
    setSuccess(false);
    setFormStep(1);
    // Navigate to home
    router.push("/");
  };

  // Call logic functions
  const handleOpenCallModal = () => {
    setCallModalVisible(true);
  };

  const handleCloseCallModal = () => {
    setCallModalVisible(false);
  };

  const handleMakeCall = async (phoneNum) => {
    const numberToCall = phoneNum || venue?.phone || "1234567890";
    const phoneUrl = `tel:${numberToCall}`;

    try {
      const supported = await Linking.canOpenURL(phoneUrl);

      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          "لا يمكن إجراء المكالمة",
          "جهازك لا يدعم إجراء المكالمات الهاتفية أو لا يوجد تطبيق هاتف متاح.",
          [{ text: "موافق" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء محاولة إجراء المكالمة. يرجى المحاولة مرة أخرى.",
        [{ text: "موافق" }]
      );
      console.error("خطأ في إجراء المكالمة:", error);
    } finally {
      handleCloseCallModal();
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#ff69b4" />
      </LoadingContainer>
    );
  }

  if (error || !venue) {
    return (
      <LoadingContainer>
        <Text>{error || "حدث خطأ ما."}</Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#ff69b4",
            borderRadius: 8,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: "white" }}>العودة</Text>
        </TouchableOpacity>
      </LoadingContainer>
    );
  }

  const images =
    venue.images && venue.images.length > 0
      ? venue.images.map((img) => ({ uri: img }))
      : [
          { uri: venue.imgUrl || "https://via.placeholder.com/400x600/cccccc" },
          { uri: "https://via.placeholder.com/400x600/dddddd" },
          { uri: "https://via.placeholder.com/400x600/eeeeee" },
        ];

  const features = [
    { icon: "users", text: "حتى 300 ضيف" },
    { icon: "calendar", text: "متاح في نهاية الأسبوع" },
    { icon: "coffee", text: "يشمل الطعام" },
    { icon: "music", text: "الموسيقى الحية مسموحة" },
  ];

  const venuePhoneNumbers = [
    { type: "المكتب الرئيسي", number: venue.phone || "555-123-4567" },
    { type: "فريق المبيعات", number: venue.salesPhone || "555-987-6543" },
  ];

  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <BackButton onPress={() => router.back()}>
        <Feather name="arrow-right" size={22} color="#000" />
      </BackButton>

      <HeaderButtonsContainer>
        <ShareButton>
          <Feather name="share" size={20} color="#000" />
        </ShareButton>
        <FavoriteButton onPress={toggleFavorite}>
          <Feather
            name="heart"
            size={20}
            color={isFavorite ? "#ff69b4" : "#000"}
          />
        </FavoriteButton>
      </HeaderButtonsContainer>

      <ScrollView>
        <CarouselContainer>
          <ScrollView
            horizontal
            pagingEnabled
            onMomentumScrollEnd={onScrollEnd}
            showsHorizontalScrollIndicator={false}
          >
            {images.map((img, idx) => (
              <CarouselImage key={idx} source={img} resizeMode="cover" />
            ))}
          </ScrollView>

          {venue.hasOffers && (
            <OfferBadge>
              <OfferText>عروض زفاف 2026</OfferText>
            </OfferBadge>
          )}

          <PageIndicator>
            <PageIndicatorText>
              {`${currentIndex + 1}/${images.length}`}
            </PageIndicatorText>
          </PageIndicator>

          <PageDotsContainer>
            <PageDots>
              {images.map((_, i) => (
                <PageDot key={i} active={i === currentIndex} />
              ))}
            </PageDots>
          </PageDotsContainer>
        </CarouselContainer>

        <ContentContainer>
          <VenueTitle>{venue.name}</VenueTitle>
          <VenueSubtitle>
            {venue.tagline || "قاعة زفافك المثالية"}
          </VenueSubtitle>

          <LocationRow>
            <Feather name="map-pin" size={20} color="#ff69b4" />
            <LocationText>{venue.location || "الموقع غير متاح"}</LocationText>
          </LocationRow>

          <InfoCard>
            <RatingRow>
              <RatingLeft>
                <Feather name="star" size={22} color="#FFD700" />
                <RatingText>{venue.rating}</RatingText>
              </RatingLeft>
              <ReviewLink>
                <ReviewLinkText>{venue.numReviews || 0} تقييم</ReviewLinkText>
              </ReviewLink>
            </RatingRow>

            <VenueRow>
              <VenueType>
                <VenueTypeText>{venue.category || "قاعة أفراح"}</VenueTypeText>
              </VenueType>
              {venue.logoUrl && (
                <Image
                  source={{ uri: venue.logoUrl }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
              )}
            </VenueRow>
          </InfoCard>

          <SectionTitle>الأسعار</SectionTitle>
          <PriceRow>
            <Feather name="dollar-sign" size={24} color="#ff69b4" />
            <PriceInfo>
              <PriceCon>
                <PriceText>{venue.prePrice} ريال</PriceText>
                <Text>-</Text>
                <PriceText>{venue.postPrice} ريال</PriceText>
              </PriceCon>
              <PriceDetails>اضغط لتفاصيل الأسعار كاملة</PriceDetails>
            </PriceInfo>
          </PriceRow>

          <Divider />

          <SectionTitle>مميزات القاعة</SectionTitle>
          <FeatureRow>
            {features.map((feature, index) => (
              <FeatureItem key={index}>
                <Feather name={feature.icon} size={16} color="#ff69b4" />
                <FeatureText>{feature.text}</FeatureText>
              </FeatureItem>
            ))}
          </FeatureRow>

          <ResponseTime>
            <Feather name="clock" size={16} color="#ff69b4" />
            <ResponseTimeText>
              {venue.responseTime || "عادة ما يرد خلال 24 ساعة"}
            </ResponseTimeText>
          </ResponseTime>
        </ContentContainer>
      </ScrollView>

      <ButtonsRowWrapper>
        <ButtonsRow>
          <CallButton onPress={handleOpenCallModal}>
            <CallButtonText>اتصال</CallButtonText>
          </CallButton>
          <QuoteButton onPress={handleOpenQuoteModal}>
            <QuoteButtonText>طلب عرض سعر</QuoteButtonText>
          </QuoteButton>
        </ButtonsRow>
      </ButtonsRowWrapper>

      {/* Enhanced 3-STEP MODAL with Validation and Success */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <ModalContainer>
          <ModalCard>
            {formStep === 1 ? (
              <>
                <ModalTitle>معلومات التواصل</ModalTitle>
                <StepIndicator>الخطوة 1 من 2</StepIndicator>
                {formErrors.firstName && (
                  <ErrorText>{formErrors.firstName}</ErrorText>
                )}
                {formErrors.lastName && (
                  <ErrorText>{formErrors.lastName}</ErrorText>
                )}

                {(formErrors.email || emailError) && (
                  <ErrorText>{formErrors.email || emailError}</ErrorText>
                )}
                {(formErrors.weddingDate || dateError) && (
                  <ErrorText>{formErrors.weddingDate || dateError}</ErrorText>
                )}
                {formErrors.guestCount && (
                  <ErrorText>{formErrors.guestCount}</ErrorText>
                )}
                <FormField
                  placeholder="الاسم الأول"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={{
                    borderColor: formErrors.firstName ? "#ff6b6b" : "#ddd",
                  }}
                />

                <FormField
                  placeholder="اسم العائلة"
                  value={lastName}
                  onChangeText={setLastName}
                  style={{
                    borderColor: formErrors.lastName ? "#ff6b6b" : "#ddd",
                  }}
                />

                <FormField
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    borderColor:
                      formErrors.email || emailError ? "#ff6b6b" : "#ddd",
                  }}
                />

                <FormField
                  placeholder="تاريخ الزفاف المتوقع (17/02/2027)"
                  value={weddingDate}
                  onChangeText={handleDateChange}
                  keyboardType="numeric"
                  maxLength={10}
                  style={{
                    borderColor:
                      formErrors.weddingDate || dateError ? "#ff6b6b" : "#ddd",
                  }}
                />

                <FormField
                  placeholder="عدد الضيوف المتوقع"
                  value={guestCount}
                  onChangeText={setGuestCount}
                  keyboardType="numeric"
                  style={{
                    borderColor: formErrors.guestCount ? "#ff6b6b" : "#ddd",
                  }}
                />

                <FormField
                  placeholder="رقم الهاتف (اختياري)"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />

                <ModalButtonRow>
                  <ModalButton onPress={handleCloseModal}>
                    <ModalButtonText>إلغاء</ModalButtonText>
                  </ModalButton>
                  <ModalButton onPress={handleNextStep} primary>
                    <ModalButtonText primary>التالي</ModalButtonText>
                  </ModalButton>
                </ModalButtonRow>
              </>
            ) : formStep === 2 ? (
              <>
                <ModalTitle>حول زفافك</ModalTitle>
                <StepIndicator>الخطوة 2 من 2</StepIndicator>

                <FormField
                  placeholder="صف ما هو مهم لزفافك..."
                  value={weddingDetails}
                  onChangeText={setWeddingDetails}
                  multiline
                  style={{ height: 100, textAlignVertical: "top" }}
                />

                <ModalButtonRow>
                  <ModalButton onPress={handlePreviousStep}>
                    <ModalButtonText>السابق</ModalButtonText>
                  </ModalButton>
                  <ModalButton
                    onPress={handleSubmitForm}
                    primary
                    disabled={submitting}
                  >
                    <ModalButtonText primary>
                      {submitting ? "جاري الإرسال..." : "إرسال"}
                    </ModalButtonText>
                  </ModalButton>
                </ModalButtonRow>
              </>
            ) : (
              <>
                <SuccessContainer>
                  <SuccessIcon>
                    <Feather name="check-circle" size={60} color="#ff69b4" />
                  </SuccessIcon>
                  <SuccessTitle>تم إرسال طلبك بنجاح!</SuccessTitle>
                  <SuccessMessage>
                    شكراً لك! تم إرسال طلب عرض السعر بنجاح. سيتم التواصل معك
                    قريباً من قبل فريق {venue.name}.
                  </SuccessMessage>
                  <SuccessButton onPress={handleCloseSuccessModal}>
                    <SuccessButtonText>العودة للرئيسية</SuccessButtonText>
                  </SuccessButton>
                </SuccessContainer>
              </>
            )}
          </ModalCard>
        </ModalContainer>
      </Modal>

      {/* CALL MODAL */}
      <Modal
        visible={callModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseCallModal}
      >
        <CallModalContainer>
          <CallModalCard>
            <CallModalTitle>الاتصال بـ {venue.name}</CallModalTitle>

            {venuePhoneNumbers.map((phoneInfo, index) => (
              <CallOption
                key={index}
                onPress={() => handleMakeCall(phoneInfo.number)}
              >
                <Feather name="phone" size={24} color="#ff69b4" />
                <CallOptionText>
                  {phoneInfo.type}: {phoneInfo.number}
                </CallOptionText>
              </CallOption>
            ))}

            <CancelButton onPress={handleCloseCallModal}>
              <CancelButtonText>إلغاء</CancelButtonText>
            </CancelButton>
          </CallModalCard>
        </CallModalContainer>
      </Modal>
    </Container>
  );
};

export default Booking;
