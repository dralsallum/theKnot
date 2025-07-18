import { StatusBar, View, Text, Alert, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { clearCart, removeFromCart } from "../redux/cartSlice";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { publicRequest, createUserRequest } from "../../requestMethods";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const Box = require("../../assets/images/box.png");
const Product = require("../../assets/images/product.jpg");
const Trash = require("../../assets/icons/trash.png");
const Plus = require("../../assets/icons/plus.png");

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #faf0e6;
  padding: 10px;
`;

const Content = styled.ScrollView.attrs(() => ({}))`
  padding: 15px;
`;

const ImagePro = styled.Image`
  width: 120px;
  height: 120px;
`;

const RemoveBtn = styled.TouchableOpacity`
  background-color: #fff;
  color: #000;
  margin: 5px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #000;
`;
const ToggleCon = styled.View`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
`;
const ToggleBtn = styled.TouchableOpacity``;
const ToggleText = styled.Text`
  color: rgb(120, 120, 120);
  text-align: right;
`;

const ShareBtn = styled.TouchableOpacity`
  background-color: #fff;
  color: #000;
  margin: 5px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #000;
  flex: 1;
`;

const ConFlex = styled.View`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  margin: 0 0 5px 0;
`;

const Top = styled.View`
  display: flex;
  flex-direction: column;
  justify-contents: center;
  gap: 8px;
  margin: 0 0 5px 0;
`;

const SubtotalCon = styled.View`
  display: flex;
  padding: 10px;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const BackButtonBtn = styled.TouchableOpacity``;

const Subtotal = styled.View`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const MainText = styled.Text`
  color: #000;
  font-size: 22px;
  text-align: right;
`;

const ProceedBut = styled.TouchableOpacity`
  display: flex;
  flex-direction: row-reverse;
  gap: 4px;
  background-color: #ff69b4;
  padding: 12px;
  border-radius: 16px;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const ProceedTex = styled.Text`
  color: #fff;
  font-size: 18px;
  text-align: center;
  align-self: center;
  width: 100%;
`;

const Separator = styled.View`
  border-top-width: 1px;
  border-top-color: #dbdbdb;
  margin: 10px 0 10px 0;
`;

const Middle = styled.View`
  display: flex;
  margin: 0 0 15px 0;
  flex-direction: column;
  justify-contents: center;
  gap: 8px;
`;

const Bottom = styled.View`
  display: flex;
  flex-direction: column;
  justify-contents: center;
  gap: 8px;
  margin: 0 0 20px 0;
`;

const BotCon = styled.View`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-item: center;
`;

const BoxImg = styled.Image`
  width: 36px;
  height: 36px;
`;

const TrashImg = styled.Image`
  width: 20px;
  height: 20px;
`;

const ReTex = styled.Text`
  font-size: 20px;
  text-align: right;
`;

const DeselectCon = styled.View`
  width: 100%;
`;

const DeselectBtn = styled.TouchableOpacity`
  margin: 0 0 10px 0;
`;

const DeselectTxt = styled.Text`
  font-size: 14px;
  color: rgb(255, 57, 156);
  text-align: right;
`;

const ProTit = styled.Text`
  font-size: 16px;
  color: #000;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-align: right;
`;

const ProDeal = styled.Text`
  font-size: 14px;
  color: rgb(252, 38, 38);
  font-weight: 600;
  margin: 0 0 8px 0;
  text-align: right;
`;

const DisCon = styled.View`
  display: flex;
  flex-direction: row-reverse;
  gap: 5px;
  align-items: center;
  margin: 0 0 8px 0;
`;

const DisPerView = styled.View`
  background-color: rgb(252, 38, 38);
  padding: 4px 6px;
  border-radius: 4px;
`;

const DisPer = styled.Text`
  color: #fff;
  font-size: 12px;
  text-align: right;
`;

const PriceTex = styled.Text`
  color: #000;
  font-weight: 600;
  font-size: 18px;
  text-align: right;
`;

const StockTex = styled.Text`
  color: rgb(11, 158, 3);
  margin: 4px 0;
  font-size: 12px;
  text-align: right;
`;

const ReturnTex = styled.Text`
  color: rgb(3, 114, 158);
  font-size: 12px;
  text-align: right;
`;

const DeliveryTex = styled.Text`
  font-size: 12px;
  color: #000;
  margin: 4px 0;
  text-align: right;
`;

// New styled components for the restructured layout
const ProductRow = styled.View`
  display: flex;
  flex-direction: row-reverse;
  gap: 12px;
`;

const ProductInfo = styled.View`
  flex: 1;
  justify-content: flex-start;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 20px;
  align-items: flex-start;
  margin-top: 10px;
  padding-horizontal: 10px;
  direction: rtl;
`;

// Left side as a column
const LeftGroup = styled.View`
  flex-direction: column;
  gap: 8px;
  width: 35%;
`;

// Right side stays a row
const RightGroup = styled.View`
  flex-direction: row-reverse;
  align-items: center;
  gap: 8px;
`;

// Quantity selector (unchanged)
const QuantityButton = styled.TouchableOpacity`
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 6px;
  padding-horizontal: 12px;
  background-color: #fff;
  border: 2px solid rgb(255, 57, 156);
  border-radius: 16px;
  width: 100%;
`;

const ShareButton = styled.TouchableOpacity`
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;
  padding-vertical: 6px;
  padding-horizontal: 12px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 16px;
  width: 80%;
`;

// Shared action buttons (unchanged)
const ActionButton = styled.TouchableOpacity`
  padding-vertical: 8px;
  padding-horizontal: 14px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 16px;
`;

// Consistent text style
const ActionText = styled.Text`
  font-size: 14px;
  color: #333;
  text-align: center;
`;

const TextInput = styled.TextInput``;

// New styled components for payment modal
const PaymentModal = styled.Modal``;

const PaymentContainer = styled.View`
  flex: 1;
  background-color: #fff;
`;

const PaymentHeader = styled.View`
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #ff69b4;
  padding-top: 50px;
`;

const PaymentHeaderText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: right;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 5px;
`;

const CloseButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-align: right;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const LoadingText = styled.Text`
  margin-top: 10px;
  font-size: 16px;
  color: #666;
  text-align: right;
`;

const Pay = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // New state for checkout functionality
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [isToggle, setIsToggle] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    country: "",
    city: "",
    street: "",
    email: "",
    name: "",
  });

  const handleBack = () => {
    router.back();
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const handleToggle = () => {
    setIsToggle((pre) => !pre);
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const validateForm = () => {
    const { country, city, street, email, name } = shippingInfo;

    if (!name.trim()) {
      setIsToggle(true);
      Alert.alert("خطأ", "يرجى إدخال الاسم");
      return false;
    }

    if (!email.trim() || !email.includes("@")) {
      setIsToggle(true);
      Alert.alert("خطأ", "يرجى إدخال بريد إلكتروني صحيح");
      return false;
    }

    if (!country.trim() || !city.trim() || !street.trim()) {
      setIsToggle(true);
      Alert.alert("خطأ", "يرجى إكمال جميع بيانات العنوان");
      return false;
    }

    if (cart.products.length === 0) {
      setIsToggle(true);
      Alert.alert("خطأ", "السلة فارغة");
      return false;
    }

    return true;
  };

  const handlePaymentNavigation = (navState) => {
    const { url } = navState;

    // Allow about:srcdoc and about:blank URLs as they're used internally by payment gateways
    if (url.startsWith("about:srcdoc") || url.startsWith("about:blank")) {
      return true;
    }

    // Block other about: URLs that might cause warnings
    if (url.startsWith("about:")) {
      return false;
    }

    // Check for success URL patterns
    if (
      url.includes("payment-success") ||
      url.includes("success") ||
      url.includes("completed") ||
      url.includes("approved")
    ) {
      setShowPaymentModal(false);
      setPaymentUrl("");
      Alert.alert(
        "نجح الدفع",
        "تم إتمام عملية الدفع بنجاح. سيتم معالجة طلبك قريباً.",
        [
          {
            text: "موافق",
            onPress: () => {
              // Navigate to order confirmation or home
              // Clear any remaining cart data
              dispatch(clearCart());
            },
          },
        ]
      );
      return false;
    }

    // Check for failure URL patterns
    if (
      url.includes("payment-failed") ||
      url.includes("failed") ||
      url.includes("error") ||
      url.includes("cancelled") ||
      url.includes("declined")
    ) {
      setShowPaymentModal(false);
      setPaymentUrl("");
      Alert.alert(
        "فشل الدفع",
        "لم يتم إتمام عملية الدفع. يرجى المحاولة مرة أخرى.",
        [
          {
            text: "موافق",
            onPress: () => {
              // Handle payment failure - keep cart intact
            },
          },
        ]
      );
      return false;
    }

    return true;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "PAYMENT_SUCCESS") {
        setShowPaymentModal(false);
        setPaymentUrl("");
        Alert.alert("نجح الدفع", "تم إتمام عملية الدفع بنجاح");
      } else if (data.type === "PAYMENT_FAILED") {
        setShowPaymentModal(false);
        setPaymentUrl("");
        Alert.alert("فشل الدفع", "لم يتم إتمام عملية الدفع");
      }
    } catch (error) {
      console.log("WebView message parsing error:", error);
    }
  };

  // Updated error handlers to be less verbose about about: URLs
  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;

    // Don't show error for about: URLs as they're expected with payment gateways
    if (
      nativeEvent.url &&
      (nativeEvent.url.startsWith("about:srcdoc") ||
        nativeEvent.url.startsWith("about:blank"))
    ) {
      return;
    }

    // Only log actual errors, not expected about: URL warnings
    if (!nativeEvent.url || !nativeEvent.url.startsWith("about:")) {
      console.error("WebView error: ", nativeEvent);
      Alert.alert("خطأ", "حدث خطأ في تحميل صفحة الدفع");
    }
  };

  const handleWebViewHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;

    // Don't log errors for about: URLs
    if (nativeEvent.url && nativeEvent.url.startsWith("about:")) {
      return;
    }

    console.error("WebView HTTP error: ", nativeEvent);
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setCurrentStep("uploading");
    setErrorMessage("");

    // Save cart details before clearing them
    const orderTotal = cart.total;
    const orderProducts = [...cart.products];

    try {
      // Get user ID from AsyncStorage
      const userId = await AsyncStorage.getItem("userId");

      // Prepare order data
      const orderData = {
        userId: userId || "guestUser",
        products: orderProducts.map((product) => ({
          productId: product._id,
          quantity: product.quantity || 1,
          name: product.name,
          price: product.price,
        })),
        amount: orderTotal,
        address: {
          country: shippingInfo.country,
          city: shippingInfo.city,
          street: shippingInfo.street,
          email: shippingInfo.email,
          name: shippingInfo.name,
        },
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Create authenticated request instance
      const userRequest = createUserRequest();

      // Submit order information using authenticated request
      const orderResponse = await userRequest.post("/orders", orderData);

      if (!orderResponse.data) {
        throw new Error("Order submission failed");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setErrorMessage("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
      setLoading(false);
      Alert.alert("خطأ", "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
      return;
    }

    // Proceed to Tap payment
    setCurrentStep("processing");

    try {
      const payload = {
        amount: orderTotal,
        currency: "SAR",
        items: orderProducts.map((product) => ({
          name: product.name || product.title,
          quantity: product.quantity || 1,
          unit_price: parseFloat(product.price) || 0,
        })),
        customer: {
          name: shippingInfo.name,
          email: shippingInfo.email,
        },
        redirect_url: "your-app://payment-success",
      };

      // Use authenticated request for Tap payment as well if needed
      const userRequest = createUserRequest();
      const tapResponse = await userRequest.post("/tap-charge", payload);

      if (tapResponse.data?.transaction?.url) {
        // Clear the cart only after successful tap charge creation
        dispatch(clearCart());

        // Show payment in WebView modal instead of opening browser
        setPaymentUrl(tapResponse.data.transaction.url);
        setShowPaymentModal(true);
        setWebViewLoading(true);

        setLoading(false);
        setCurrentStep("payment");
      } else {
        throw new Error("Tap charge creation failed");
      }
    } catch (error) {
      console.error("Error in Tap payment:", error);
      setErrorMessage("حدث خطأ أثناء معالجة الدفع مع Tap.");
      setLoading(false);
      Alert.alert("خطأ", "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.");
    }
  };

  const closePaymentModal = () => {
    Alert.alert(
      "إغلاق الدفع",
      "هل أنت متأكد من إغلاق صفحة الدفع؟ سيتم إلغاء العملية.",
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "إغلاق",
          style: "destructive",
          onPress: () => {
            setShowPaymentModal(false);
            setPaymentUrl("");
            setWebViewLoading(true);
          },
        },
      ]
    );
  };

  // Enhanced proceed button component
  const renderProceedButton = () => {
    if (loading) {
      return (
        <ProceedBut disabled>
          <ProceedTex>
            {currentStep === "uploading"
              ? "جاري إرسال الطلب..."
              : currentStep === "processing"
              ? "جاري المعالجة..."
              : "جاري التحضير للدفع..."}
          </ProceedTex>
        </ProceedBut>
      );
    }

    return (
      <ProceedBut onPress={handleCheckout}>
        <ProceedTex>إتمام الشراء ({cart.products.length} عناصر)</ProceedTex>
      </ProceedBut>
    );
  };

  // Error message component
  const renderErrorMessage = () => {
    if (!errorMessage) return null;

    return (
      <View
        style={{
          backgroundColor: "#ffebee",
          padding: 12,
          borderRadius: 8,
          margin: 10,
          borderLeftWidth: 4,
          borderLeftColor: "#f44336",
        }}
      >
        <Text style={{ color: "#c62828", fontSize: 14 }}>{errorMessage}</Text>
      </View>
    );
  };

  // Shipping form component
  const renderShippingForm = () => {
    return (
      <View
        style={{
          padding: 15,
          backgroundColor: "#fff",
          margin: 10,
          borderRadius: 8,
        }}
      >
        <ToggleCon>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 15,
              color: "#000",
            }}
          >
            معلومات الشحن
          </Text>
          <ToggleBtn onPress={handleToggle}>
            <TrashImg source={Plus} />
          </ToggleBtn>
        </ToggleCon>
        {isToggle ? (
          <View>
            <TextInput
              placeholder="الاسم الكامل"
              value={shippingInfo.name}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, name: text })
              }
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                backgroundColor: "#fff",
              }}
            />

            <TextInput
              placeholder="البريد الإلكتروني"
              value={shippingInfo.email}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, email: text })
              }
              keyboardType="email-address"
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                backgroundColor: "#fff",
              }}
            />

            <TextInput
              placeholder="الدولة"
              value={shippingInfo.country}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, country: text })
              }
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                backgroundColor: "#fff",
              }}
            />

            <TextInput
              placeholder="المدينة"
              value={shippingInfo.city}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, city: text })
              }
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                backgroundColor: "#fff",
              }}
            />

            <TextInput
              placeholder="الشارع والرقم"
              value={shippingInfo.street}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, street: text })
              }
              multiline={true}
              numberOfLines={2}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                backgroundColor: "#fff",
                textAlignVertical: "top",
              }}
            />
          </View>
        ) : (
          <ToggleText>اضغط علامة الزايد لادخال بياناتك</ToggleText>
        )}
      </View>
    );
  };

  // Payment modal component
  const renderPaymentModal = () => {
    return (
      <PaymentModal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <PaymentContainer>
          <PaymentHeader>
            <PaymentHeaderText>إتمام الدفع</PaymentHeaderText>
            <CloseButton onPress={closePaymentModal}>
              <CloseButtonText>✕</CloseButtonText>
            </CloseButton>
          </PaymentHeader>

          {webViewLoading && (
            <LoadingContainer>
              <ActivityIndicator size="large" color="#ff69b4" />
              <LoadingText>جاري تحميل صفحة الدفع...</LoadingText>
            </LoadingContainer>
          )}

          {paymentUrl ? (
            <WebView
              source={{ uri: paymentUrl }}
              style={{ flex: 1 }}
              onLoadStart={() => setWebViewLoading(true)}
              onLoadEnd={() => setWebViewLoading(false)}
              onNavigationStateChange={handlePaymentNavigation}
              onMessage={handleWebViewMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              mixedContentMode="compatibility"
              allowsInlineMediaPlaybook={true}
              mediaPlaybackRequiresUserAction={false}
              onError={handleWebViewError}
              onHttpError={handleWebViewHttpError}
              // Updated configuration to handle about: URLs
              originWhitelist={["https://", "http://", "about:"]}
              allowsBackForwardNavigationGestures={false}
              allowsLinkPreview={false}
              // Allow about: URLs but handle them gracefully
              onShouldStartLoadWithRequest={(request) => {
                // Allow about:srcdoc and about:blank as they're used internally
                if (
                  request.url.startsWith("about:srcdoc") ||
                  request.url.startsWith("about:blank")
                ) {
                  return true;
                }
                // Block other about: URLs that might cause issues
                if (
                  request.url.startsWith("about:") &&
                  !request.url.includes("srcdoc") &&
                  !request.url.includes("blank")
                ) {
                  return false;
                }
                return true;
              }}
              // Additional props for better handling
              cacheEnabled={false}
              thirdPartyCookiesEnabled={true}
              sharedCookiesEnabled={true}
              // Suppress console warnings
              onContentProcessDidTerminate={() => {
                // Handle content process termination gracefully
                console.log("WebView content process terminated");
              }}
            />
          ) : null}
        </PaymentContainer>
      </PaymentModal>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF0E6" />
      <Container>
        <Content>
          <Top>
            <SubtotalCon>
              <Subtotal>
                <MainText>المجموع الفرعي</MainText>
                <MainText>{cart.total.toFixed(2)} ريال</MainText>
              </Subtotal>
              <BackButtonBtn onPress={handleBack}>
                <Feather name="arrow-left" size={24} color="#000" />
              </BackButtonBtn>
            </SubtotalCon>
            {renderProceedButton()}
          </Top>

          {renderErrorMessage()}
          {renderShippingForm()}

          <Separator />

          <DeselectCon>
            <DeselectBtn onPress={handleClear}>
              <DeselectTxt>إلغاء تحديد جميع العناصر</DeselectTxt>
            </DeselectBtn>
          </DeselectCon>

          {cart.products.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "#666",
                marginTop: 20,
              }}
            >
              السلة فارغة
            </Text>
          ) : (
            cart.products.map((product) => (
              <Middle key={product._id}>
                <ProductRow>
                  <ImagePro
                    source={product.img ? { uri: product.img } : Product}
                    resizeMode="cover"
                  />
                  <ProductInfo>
                    <ProTit>{product.name}</ProTit>
                    <ProDeal>عرض الصيف</ProDeal>
                    <DisCon>
                      <DisPerView>
                        <DisPer>-15%</DisPer>
                      </DisPerView>
                      <PriceTex>{product.price} ريال</PriceTex>
                    </DisCon>
                    <DeliveryTex>توصيل مجاني غداً، 31 مايو</DeliveryTex>
                    <StockTex>متوفر</StockTex>
                    <ReturnTex>قابل للإرجاع خلال 15 يوم</ReturnTex>
                  </ProductInfo>
                </ProductRow>

                <ButtonRow>
                  <LeftGroup>
                    <QuantityButton>
                      <TrashImg source={Trash} />
                      <Text style={{ marginHorizontal: 6 }}>
                        {product.quantity || 1}
                      </Text>
                      <TrashImg source={Plus} />
                    </QuantityButton>

                    <ShareButton>
                      <ActionText>مشاركة</ActionText>
                    </ShareButton>
                  </LeftGroup>

                  <RightGroup>
                    <ActionButton
                      onPress={() => handleRemoveProduct(product._id)}
                    >
                      <ActionText>حذف</ActionText>
                    </ActionButton>
                    <ActionButton>
                      <ActionText>حفظ لاحقاً</ActionText>
                    </ActionButton>
                  </RightGroup>
                </ButtonRow>
              </Middle>
            ))
          )}

          <View>
            <ConFlex>
              <Text>العناصر:</Text>
              <Text>{cart.products.length}</Text>
            </ConFlex>
            <ConFlex>
              <Text>الشحن والمناولة</Text>
              <Text>مجاني</Text>
            </ConFlex>
            <ConFlex>
              <ReTex>المجموع الإجمالي</ReTex>
              <ReTex>{cart.total.toFixed(2)} ريال</ReTex>
            </ConFlex>
          </View>

          <Separator />

          <Bottom>
            <BotCon>
              <View>
                <ReTex>الإرجاع سهل</ReTex>
                <Text>إرجاع خلال 15 يوم لملايين المنتجات</Text>
              </View>
              <View>
                <BoxImg source={Box} />
              </View>
            </BotCon>
          </Bottom>
        </Content>
      </Container>

      {renderPaymentModal()}
    </>
  );
};

export default Pay;
