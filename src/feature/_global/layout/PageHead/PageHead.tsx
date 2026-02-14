"use client";
import { useEffect } from "react";

interface PropTypes {
  title?: string;
}

const PageHead = (props: PropTypes) => {
  const { title = "Dashboard" } = props;

  useEffect(() => {
    document.title = title;
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = "/images/logo.png";
    }
  }, [title]);

  return null;
};

export default PageHead;
