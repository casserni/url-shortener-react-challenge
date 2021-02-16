import * as React from "react";
import { useKeyPress } from "react-use";

export function useSubmitOnEnter(onSubmit: () => void) {
  const [submitted] = useKeyPress("Enter");

  React.useEffect(() => {
    if (submitted) {
      onSubmit();
    }
  }, [submitted]);
}
