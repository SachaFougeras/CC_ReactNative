import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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

  const filtered = useMemo(() => {
    if (!query) return trainings;
    const q = query.toLowerCase();
    return (trainings as any[]).filter((t) => (t.title || "").toLowerCase().includes(q));
  }, [trainings, query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Rechercher une formation..."
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item: any) => item.slug}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push(`/detail/${item.slug}` as any)}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.summary ? <Text style={styles.itemSummary}>{stripHtml(item.summary)}</Text> : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  search: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 12 },
  list: { paddingBottom: 40 },
  item: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 12, elevation: 1 },
  itemTitle: { fontSize: 18, fontWeight: '700' },
  itemSummary: { marginTop: 6, color: '#555' },
});

function stripHtml(html?: string) {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, "");
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}