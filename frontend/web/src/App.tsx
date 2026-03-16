import AppRouter from "./routes/AppRouter";
import Chatbot from "./components/Chatbot/Chatbot"; // 👈 Importamos el chatbot

function App() {
  return (
    <>
      <AppRouter />
      <Chatbot />
    </>
  );
}

export default App;