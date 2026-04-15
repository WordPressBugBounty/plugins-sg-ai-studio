import React from "react";
import { useAppSelector } from "@/store/hooks";

type Props = {
  timestamp: number;
};

const DateFormatter: React.FC<Props> = ({ timestamp }) => {
  const config = useAppSelector((state) => state.app.config);
  const date = new Date(timestamp * 1000);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  } as const;

  return <div>{date.toLocaleString(config.localeSlug || "en", options)}</div>;
};

export default DateFormatter;
