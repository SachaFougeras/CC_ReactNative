import axios from "axios";

const API_BASE_URL = "https://dawan.org/public/training";

export async function getTrainings() {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des formations :", error);
    throw new Error("Impossible de récupérer les formations");
  }
}

export async function getTrainingBySlug(slug: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/show/${slug}`
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement de la formation :", error);
    throw new Error("Impossible de récupérer la formation");
  }
}