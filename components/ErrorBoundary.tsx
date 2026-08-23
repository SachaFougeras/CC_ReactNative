import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Ici on pourrait logger l'erreur vers un service externe
    // console.log(error, info);
  }

  reset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Une erreur est survenue.</Text>
          <Text style={styles.message}>{this.state.error?.message}</Text>
          <Button title="Réessayer" onPress={this.reset} />
        </View>
      );
    }
    return this.props.children as any;
  }
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontWeight: "700", marginBottom: 8 },
  message: { marginBottom: 12 },
});
