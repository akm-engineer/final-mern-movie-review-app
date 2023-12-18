/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { getAppInfo } from "../../api/admin";
import { useNotification } from "../../hooks";
import AppInfoBox from "../AppInfoBox";
import LatestUploads from "../LatestUploads";
import MostRatedMovies from "../MostRatedMovies";

//Dashboard component
export default function Dashboard() {
  const [appInfo, setAppInfo] = useState({
    movieCount: 0,
    reviewCount: 0,
    userCount: 0,
  });

  // Notification hook for handling updates
  const { updateNotification } = useNotification();

  // Function to fetch application information
  const fetchAppInfo = async () => {
    const { appInfo, error } = await getAppInfo();

    if (error) return updateNotification("error", error);

    setAppInfo({ ...appInfo });
  };

  useEffect(() => {
    fetchAppInfo();
  }, []);

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-1  gap-5 p-5">
      <AppInfoBox
        title="Total Uploads"
        subTitle={appInfo.movieCount.toLocaleString()}
      />

      <AppInfoBox
        title="Total Reviews"
        subTitle={appInfo.reviewCount.toLocaleString()}
      />
      <AppInfoBox
        title="Total Users"
        subTitle={appInfo.userCount.toLocaleString()}
      />
      {/* Displaying components for latest uploads and most rated movies */}
      <LatestUploads />
      <MostRatedMovies />
    </div>
  );
}
