import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("https://dawan.org/public/training/")
    .then((res) => {
      console.log("Status:", res.status);
      return res.json();
    })
    .then((data) => {
      console.log("OK:", data.length);
      setTrainings(data);
    })
    .catch((err) => console.log("Erreur:", err.message))
    .finally(() => setLoading(false));
}, []);

  return (
    <FlatList
      data={trainings}
      keyExtractor={(item: any) => item.slug}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
           router.push(`/training/${item.slug}` as any)
          }
        >
          <Text>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}