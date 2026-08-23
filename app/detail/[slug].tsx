import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import EmailForm from "../../components/EmailForm";
import ErrorBoundary from "../../components/ErrorBoundary";

export default function DetailScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [training, setTraining] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`https://dawan.org/public/training/show/${slug}`)
      .then((res) => setTraining(res.data))
      .catch((err) => console.log(err));
  }, [slug]);

  return (
    <ErrorBoundary>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← Retour</Text>
            </TouchableOpacity>
          </View>

          {!training ? (
            <Text>Chargement...</Text>
          ) : (
            <>
              <Text style={styles.title}>{training.title}</Text>
              <Text style={styles.description}>{stripHtml(training.description)}</Text>
              <Text style={styles.section}>Contact / Envoyer par email</Text>
              <EmailForm initialSubject={`Info: ${training.title}`} initialBody={""} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { marginBottom: 12, alignSelf: "stretch" },
  backButton: { backgroundColor: "#eee", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, alignSelf: "flex-start" },
  backText: { fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  description: { marginBottom: 12 },
  section: { marginTop: 12, marginBottom: 8, fontWeight: "600" },
});

function stripHtml(html?: string) {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, "");
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
