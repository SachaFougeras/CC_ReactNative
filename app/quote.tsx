import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
} from "react-native";

export default function QuoteScreen() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !email) {
      Alert.alert("Erreur", "Nom et email obligatoires.");
      return;
    }
    // Envoi via EmailJS, Formspree, ou votre backend
    Alert.alert("Succès", "Votre demande de devis a bien été envoyée !");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Devis pour : {title}</Text>
      <TextInput style={styles.input} placeholder="Votre nom" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Votre email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Message (optionnel)"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Envoyer la demande</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 12, marginBottom: 14, fontSize: 15,
  },
  textarea: { height: 120, textAlignVertical: "top" },
  btn: {
    backgroundColor: "#0066cc", padding: 14,
    borderRadius: 8, alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});