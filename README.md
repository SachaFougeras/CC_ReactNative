# README - Mise en place du projet React Native avec Expo Router

## 1. Création du projet

Créer un nouveau projet Expo :

```bash
npx create-expo-app CC_ReactNative
```

Se placer dans le dossier :

```bash
cd CC_ReactNative
```

---

## 2. Installation des dépendances

Installer Expo Router et les dépendances nécessaires :

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens
```

Installer Axios pour les appels REST :

```bash
npm install axios
```

Installer Expo Mail Composer pour l'envoi d'emails :

```bash
npx expo install expo-mail-composer
```


## 3. Structure du projet

Créer la structure suivante :

```text
app/
│
├── _layout.tsx
│
├── (tabs)/
│   ├── index.tsx
│   └── quote.tsx
│
└── training/
    └── [slug].tsx
```


