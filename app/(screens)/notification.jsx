import React from "react";
import { StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

const Notification = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF0E6" />
      <Container>
        <HeaderContainer>
          <BackButtonContainer onPress={handleBack}>
            <BackArrow>←</BackArrow>
          </BackButtonContainer>
          <HeaderText>Notifications</HeaderText>
        </HeaderContainer>

        <ContentContainer>
          <EmptyStateContainer>
            <MessageBubble>
              <DotContainer>
                <Dot />
                <Dot />
                <Dot />
              </DotContainer>
            </MessageBubble>
            <NoNotificationsText>No notifications yet!</NoNotificationsText>
            <DescriptionText>
              We'll put helpful tips and to-dos here when you need them.
            </DescriptionText>
          </EmptyStateContainer>
        </ContentContainer>
      </Container>
    </>
  );
};

// Styled Components
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #faf0e6;
`;

const HeaderContainer = styled.View`
  padding: 20px;
  padding-top: 30px;
  padding-bottom: 10px;
  flex-direction: row;
  align-items: center;
`;

const BackButtonContainer = styled.TouchableOpacity`
  padding: 10px;
  margin-right: 10px;
`;

const BackArrow = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000;
`;

const HeaderText = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #000;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyStateContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const MessageBubble = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: #f2e6d9;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const DotContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #e6d0b8;
  margin: 0 5px;
`;

const NoNotificationsText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
  text-align: center;
`;

const DescriptionText = styled.Text`
  font-size: 18px;
  color: #666;
  text-align: center;
  max-width: 300px;
  line-height: 24px;
`;

export default Notification;
