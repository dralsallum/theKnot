import React from "react";
import styled from "styled-components/native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function PlanningScreen() {
  return (
    <Container>
      <Main />
      <IconsContainer>
        <OuterCircleRow>
          <CircleContainer>
            <Circle>
              <FontAwesome name="dollar" size={24} color="white" />
            </Circle>
            <Label>Budget Advisor</Label>
          </CircleContainer>

          <CircleContainer style={{ marginTop: -30 }}>
            <Circle>
              <MaterialIcons name="list-alt" size={24} color="white" />
            </Circle>
            <Label>Checklist</Label>
          </CircleContainer>

          <CircleContainer style={{ marginTop: -30 }}>
            <Circle>
              <Ionicons name="people" size={24} color="white" />
            </Circle>
            <Label>Guest List</Label>
          </CircleContainer>

          <CircleContainer>
            <Circle>
              <Ionicons name="heart" size={24} color="white" />
            </Circle>
            <Label>Your Vision</Label>
          </CircleContainer>
        </OuterCircleRow>
      </IconsContainer>
    </Container>
  );
}

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Main = styled.View`
  flex: 1;
`;

const IconsContainer = styled.View`
  width: 100%;
  margin-bottom: 40px;
`;

const OuterCircleRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  padding: 0 10px;
`;

const CircleContainer = styled.TouchableOpacity`
  align-items: center;
`;

const Circle = styled.View`
  width: 68px;
  height: 68px;
  border-radius: 34px;
  background-color: #ec65b8;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #000;
`;
