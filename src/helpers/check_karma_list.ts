import axios, { AxiosRequestConfig } from "axios";

import config from "../config";

interface ResponseMeta {
  balance: number;
}

interface ApiResponse {
  status: string;
  message: string;
  meta: ResponseMeta;
}

const createConfig = (identity: string): AxiosRequestConfig => {
  return {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://adjutor.lendsqr.com/v2/verification/karma/${identity}`,
    headers: {
      Authorization: `Bearer ${config.KARMA_SECRET}`,
    },
  };
};

export const checkKarmaList = async (identity: string): Promise<ApiResponse | undefined> => {
  const config = createConfig(identity);

  try {
    const response = await axios.request<ApiResponse>(config);
    // Return only the data part of the response
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      //Return the data part of the error response
      return error.response.data as ApiResponse;
    } else {
      console.error("Error:", error);
      return undefined;
    }
  }
};
