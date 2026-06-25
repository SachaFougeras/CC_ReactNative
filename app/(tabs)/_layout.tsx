import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Formations",
        }}
      />

      <Tabs.Screen
        name="quote"
        options={{
          title: "Demande de devis",
        }}
      />
    </Tabs>
  );
}