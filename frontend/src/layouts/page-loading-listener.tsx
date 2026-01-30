import { useNavigation } from "react-router-dom";
import { useEffect } from "react";
import { useLoadingStore } from "@/store/useLoadingStore";

export default function PageLoadingListener() {
  const navigation = useNavigation();
  const setPageLoading = useLoadingStore((s) => s.setPageLoading);

  useEffect(() => {
    console.log("navigation.state:", navigation.state);
    setPageLoading(navigation.state === "loading");
  }, [navigation]);

  return null;
}
