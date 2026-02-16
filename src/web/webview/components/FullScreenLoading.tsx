import { ClipLoader } from "react-spinners";
import { CSSProperties, useEffect } from "react";

interface FullScreenLoadingProps {
  isLoading: boolean;
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  pointerEvents: "all", // disable toàn bộ UI phía dưới
};

export default function FullScreenLoading({
  isLoading,
}: FullScreenLoadingProps) {
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div style={overlayStyle}>
      <ClipLoader color="#3238e8" size={50} />
    </div>
  );
}
