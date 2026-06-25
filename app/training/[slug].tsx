import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function DetailScreen() {
  const { slug } = useLocalSearchParams();
  const [training, setTraining] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`https://dawan.org/public/training/show/${slug}`)
      .then((res) => setTraining(res.data));
  }, [slug]);

  if (!training) return <Text>Chargement...</Text>;

  return (
    <View>
      <Text>{training.title}</Text>
      <Text>{training.description}</Text>
    </View>
  );
}