import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { getTrainingBySlug } from "../../API/api";
import EmailForm from "../../components/EmailForm";
import ErrorBoundary from "../../components/ErrorBoundary";

export default function DetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [training, setTraining] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTraining() {
    if (!slug) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getTrainingBySlug(slug);

      setTraining(data);
    } catch (err) {
      console.error(err);

      setError("Impossible de charger cette formation.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTraining();
  }, [slug]);

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {
              paddingTop: Math.max(insets.top, 16),
            },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backText}>
                ← Retour
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>
                Chargement...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>
                {error}
              </Text>

              <TouchableOpacity
                onPress={loadTraining}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>
                  Réessayer
                </Text>
              </TouchableOpacity>
            </View>
          ) : training ? (
            <>
              <Text style={styles.title}>
                {training.title}
              </Text>

              <Text style={styles.description}>
                {stripHtml(
                  training.description ||
                  training.summary
                )}
              </Text>

              <Text style={styles.section}>
                Contact / Envoyer par email
              </Text>

              <EmailForm
                initialRecipient="yannis.billon1@gmail.com"
                initialSubject={`Info: ${training.title}`}
                initialBody=""
              />
            </>
          ) : (
            <Text style={styles.errorText}>
              Formation introuvable
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16, backgroundColor: "#fff" },
  header: { marginBottom: 18, alignSelf: "stretch" },
  backButton: { backgroundColor: "#eee", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, alignSelf: "flex-start" },
  backText: { fontWeight: "600", color: "#000", fontSize: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 14, color: "#000" },
  description: { marginBottom: 20, fontSize: 16, lineHeight: 23, color: "#222" },
  section: { marginTop: 10, marginBottom: 8, fontSize: 18, fontWeight: "700", color: "#000" },
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 30 },
  loadingText: { marginTop: 10, color: "#000" },
  errorText: { color: "#b00020", marginBottom: 12 },
  retryButton: { backgroundColor: "#eee", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, },
  retryText: { fontWeight: "600", color: "#000" },
});

function stripHtml(html?: string) {
  if (!html) return "";

  const text = html.replace(/<[^>]*>/g, "");

  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}