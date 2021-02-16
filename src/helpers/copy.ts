import copyToClipboard from "copy-to-clipboard";

import { toaster } from "./toast";

export const copy = (url: string) => {
  copyToClipboard(url);

  toaster.show({
    message: "Copied to Clipboard!",
    intent: "success",
  });
};
