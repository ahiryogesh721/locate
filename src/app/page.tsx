"use client";
import axios from "../../axios";
import { useEffect } from "react";

export default function Home() {
  const noticeIp = async () => {
    const res = await axios.post(`http://localhost:3000/api/ips`);
    console.log(res.data);
  };

  useEffect(() => {
    //getGioLocation();
    noticeIp();
  }, []);

  return <>hello</>;
}
