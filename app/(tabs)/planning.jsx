import React from "react";
import styled from "styled-components/native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PlanningScreen() {
  return (
    <Container>
      <Main />
      <IconsContainer>
        <OuterCircleRow>
          <CircleButton
            route="/budget"
            icon={<FontAwesome name="dollar" size={24} color="white" />}
            label="Budget Advisor"
          />
          <CircleButton
            route="/checklist"
            style={{ marginTop: -30 }}
            icon={<MaterialIcons name="list-alt" size={24} color="white" />}
            label="Checklist"
          />
          <CircleButton
            route="/guest"
            style={{ marginTop: -30 }}
            icon={<Ionicons name="people" size={24} color="white" />}
            label="Guest List"
          />
          <CircleButton
            route="/favorite"
            icon={<Ionicons name="heart" size={24} color="white" />}
            label="Your Vision"
          />
        </OuterCircleRow>
      </IconsContainer>
    </Container>
  );
}

function CircleButton({ route, icon, label, style }) {
  const router = useRouter();
  return (
    <CircleContainer style={style} onPress={() => router.push(route)}>
      <Circle>{icon}</Circle>
      <Label>{label}</Label>
    </CircleContainer>
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
