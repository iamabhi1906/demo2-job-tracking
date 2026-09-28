import axios from "axios";

import { API_URL, NEXT_PUBLIC_API_URL } from "@/lib/config";

export const ssrApi = axios.create({
  baseURL: API_URL,
});

export const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
