import * as MailComposer from "expo-mail-composer";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  initialRecipient?: string;
  initialSubject?: string;
  initialBody?: string;
};

const isValidEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

export default function EmailForm({ initialRecipient = "", initialSubject = "", initialBody = "" }: Props) {
  const router = useRouter();
  const [recipient, setRecipient] = useState(initialRecipient);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!recipient || !isValidEmail(recipient)) {
      Alert.alert("Erreur", "Veuillez renseigner une adresse email valide.");
      return;
    }
    if (!subject) {
      Alert.alert("Erreur", "Veuillez renseigner un sujet.");
      return;
    }

    setLoading(true);
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Erreur", "La fonction d'envoi d'email n'est pas disponible sur cet appareil.");
        setLoading(false);
        return;
      }

      const result = await MailComposer.composeAsync({
        recipients: [recipient],
        subject,
        body,
      });

      if (result.status === "sent") {
        Alert.alert("Succès", "Email prêt à être envoyé (ou envoyé selon la configuration).", [
          {
            text: "OK",
            onPress: () => {
              setRecipient("");
              setSubject("");
              setBody("");
              router.replace("/");
            },
          },
        ]);
      } else {
        Alert.alert("Info", "Action terminée : " + result.status);
      }
    } catch (err: any) {
      Alert.alert("Erreur", err?.message ?? "Erreur lors de l'envoi de l'email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Destinataire</Text>
      <TextInput style={styles.input} value={recipient} onChangeText={setRecipient} keyboardType="email-address" autoCapitalize="none" />
      <Text style={styles.label}>Sujet</Text>
      <TextInput style={styles.input} value={subject} onChangeText={setSubject} />
      <Text style={styles.label}>Message</Text>
      <TextInput style={[styles.input, styles.multiline]} value={body} onChangeText={setBody} multiline numberOfLines={4} />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Envoyer par email" onPress={handleSend} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  label: {
    marginBottom: 4,
  },
});
