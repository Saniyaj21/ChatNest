import GlobalChat from "@/components/globalChat/GlobalChat";
import LandingPage from "@/components/home/LandingPage";


export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 ">
      {/* <LandingPage /> */}
      <GlobalChat />
    </div>
  );
}
