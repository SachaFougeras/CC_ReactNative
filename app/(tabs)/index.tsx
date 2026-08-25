import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { getTrainings } from "../../API/api";

export default function HomeScreen() {
  const router = useRouter();

  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadTrainings() {
    try {
      setError(null);

      const data = await getTrainings();

      setTrainings(data);
    } catch (err) {
      console.error(err);

      setError("Impossible de charger les formations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrainings();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await loadTrainings();

    setRefreshing(false);
  }, []);

  const filtered = useMemo(() => {
    if (!query) {
      return trainings;
    }

    const q = query.toLowerCase();

    return trainings.filter((training) =>
      (training.title || "")
        .toLowerCase()
        .includes(q)
    );
  }, [trainings, query]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Chargement des formations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>

        <TouchableOpacity onPress={loadTrainings}>
          <Text style={styles.retry}>
            Réessayer
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Rechercher une formation..."
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={styles.list}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }

        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              router.push(`/detail/${item.slug}` as any)
            }
          >
            <Text style={styles.itemTitle}>
              {item.title}
            </Text>

            {item.summary ? (
              <Text style={styles.itemSummary}>
                {stripHtml(item.summary)}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },

  list: {
    paddingBottom: 40,
  },

  item: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },

  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  itemSummary: {
    marginTop: 6,
    color: "#555",
  },

  retry: {
    marginTop: 12,
    fontWeight: "700",
  },
});

function stripHtml(html?: string) {
  if (!html) {
    return "";
  }

  const text = html.replace(/<[^>]*>/g, "");

  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}