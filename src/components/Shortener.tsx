import { Button, InputGroup, Label } from "@blueprintjs/core";
import * as React from "react";

import { useSubmitOnEnter } from "../helpers/submitOnEnter";
import { toaster } from "../helpers/toast";
import { useAPI } from "../providers/ApiProvider";

export const Shortener: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { create, list } = useAPI();

  const [created, createLink] = create;
  const [, listLinks] = list;

  const [data, setData] = React.useState({ url: "", slug: "" });

  const onSubmit = React.useCallback(async () => {
    if (!data.url) return;

    try {
      await createLink(data);
      setData({ url: "", slug: "" });
      toaster.show({
        message: "URL created!",
        intent: "success",
      });
      listLinks();
    } catch (e) {
      toaster.show({
        message: e.message || "Oops somethig went wrong",
        intent: "danger",
      });
    }
  }, [data]);

  useSubmitOnEnter(onSubmit);

  return (
    <div className={className}>
      <div className="text-center text-2xl font-extrabold mb-12">
        Simplify Your URL!
      </div>

      <div className="flex items-end">
        <Label className="flex-1 pr-2">
          Original URL
          <InputGroup
            data-testid="url-input"
            large
            value={data.url}
            placeholder="Enter your original URL eg. https://example.com"
            onChange={(e) => setData({ ...data, url: e.target.value })}
          />
        </Label>

        <Label className="flex-1 px-2">
          Custom Slug <span className="text-gray-500">(optional)</span>
          <InputGroup
            data-testid="slug-input"
            large
            value={data.slug}
            placeholder="Enter custom slug to be used as the path in the shortened URL"
            onChange={(e) => setData({ ...data, slug: e.target.value })}
          />
        </Label>

        <Button
          data-testid="create-button"
          large
          icon="link"
          intent="primary"
          className="mb-4"
          disabled={!data.url || created.loading}
          loading={created.loading}
          onClick={onSubmit}
        >
          Shorten URL
        </Button>
      </div>
    </div>
  );
};
