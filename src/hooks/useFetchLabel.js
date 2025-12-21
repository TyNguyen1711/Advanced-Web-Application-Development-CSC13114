import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import taskApi from "../services/taskApi";
import {
  setGoogleLabels,
  setIsRunFirstFetch,
  setListTypes,
} from "../redux/taskSlice";

const useFetchLabel = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const [labels, types] = await Promise.all([
          taskApi.getGoogleLabels(),
          taskApi.getAllTypes(),
        ]);

        dispatch(setGoogleLabels(labels.labels || []));
        dispatch(setListTypes(types.statuses || []));
        dispatch(setIsRunFirstFetch(true));
      } catch (err) {
        setError(err.message || "Failed to fetch labels");
      } finally {
        setLoading(false);
      }
    };

    fetchLabels();
  }, [dispatch]);

  return { loading, error };
};

export default useFetchLabel;
