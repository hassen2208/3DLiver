// quizService.js
import { collection, addDoc } from "firebase/firestore"
import { db } from "./firebaseConfig"

export async function guardarResultadoQuiz(usuarioId, progreso, calificacion, fecha = new Date()) {
  try {
    await addDoc(collection(db, "resultadosQuiz"), {
      usuarioId,
      progreso,
      calificacion,
      fecha
    })
    console.log("Resultado guardado en Firestore")
  } catch (error) {
    console.error("Error al guardar resultado:", error)
  }
}
