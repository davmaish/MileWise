import ProgressBar from "@/components/ProgressBar";
import Screen from "@/components/Screen";

export default function HomeScreen() {
  return (
    <Screen>
      <ProgressBar progress={100} />

      <ProgressBar progress={75} style={{ marginTop: 20 }} />

      <ProgressBar progress={45} color="#FFC107" style={{ marginTop: 20 }} />

      <ProgressBar progress={20} color="#EF4444" style={{ marginTop: 20 }} />
    </Screen>
  );
}
