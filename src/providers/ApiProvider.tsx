import axios from "axios";
import * as React from "react";

import { config } from "../helpers/config";

/**
 * CONTEXT
 */
const Context = React.createContext(
  {} as {
    create: RequestHook;
    delete: RequestHook;
    list: RequestHook;
  }
);
export function useAPI() {
  return React.useContext(Context);
}

/**
 * PROVIDER
 */
export const ApiProvider: React.FC = ({ children }) => {
  const api = {
    delete: createRequest(API.delete),
    list: createRequest(API.list),
    create: createRequest(API.create, (res) => {
      let error = "";
      if (res.data && res.data.errors) {
        if (res.data.errors.url) {
          error += `url: ${res.data.errors.url.join(", ")}`;

          if (res.data.errors.slug) {
            error += ` AND `;
          }
        }
        if (res.data.errors.slug) {
          error += `slug: ${res.data.errors.slug.join(", ")}`;
        }
      }
      return error;
    }),
  };

  return <Context.Provider value={api}>{children}</Context.Provider>;
};

/**
 * API METHODS
 */
export type RequestHook = [
  { data?: any; error?: string; loading?: boolean },
  (params?: any) => any
];

type Methods = typeof API;
type Method = Methods[keyof Methods];

const axiosInstance = axios.create({
  baseURL: "https://api.bely.me/",
  headers: {
    "GB-Access-Token": config.API_KEY,
  },
});

const API = {
  create: (data: { url: string; slug?: string }) =>
    axiosInstance.request({
      url: `/links`,
      method: "POST",
      data: {
        url: data.url,
        slug: data.slug || undefined,
      },
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 422;
      },
    }),

  delete: (slug: string) =>
    axiosInstance.request({ url: `/links/${slug}`, method: "DELETE" }),

  list: () => axiosInstance.request({ url: `/links`, method: "GET" }),
};

function createRequest(
  method: Method,
  getError?: (res: any) => string
): RequestHook {
  const [data, setData] = React.useState();
  const [error, setError] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const req = React.useMemo(
    () => async (args: any) => {
      setLoading(true);

      try {
        const res = await method(args);
        const e = getError && getError(res);
        if (e) throw new Error(e);

        setData(res.data);
        setLoading(false);

        return res.data;
      } catch (e) {
        setError(e.message || "Oops something went wrong");
        setLoading(false);
        throw e;
      }
    },
    []
  );

  return [{ data, error, loading }, req];
}
