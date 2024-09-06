import AppProvider from "./provider";
import AppRouter from "./router";

const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};

export default App;
