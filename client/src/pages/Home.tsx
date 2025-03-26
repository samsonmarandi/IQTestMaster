import { WelcomeScreen } from "@/components/WelcomeScreen";
import { UserInfo } from "@shared/schema";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  const handleStartTest = (userInfo: UserInfo) => {
    // Store user info in sessionStorage for quiz page
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    
    // Navigate to quiz page
    navigate("/quiz");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <WelcomeScreen onStartTest={handleStartTest} />
    </div>
  );
}
