import {
  Button,
  Callout,
  HTMLTable,
  Spinner,
  Tooltip,
} from "@blueprintjs/core";
import * as React from "react";

import { copy } from "../helpers/copy";
import { toaster } from "../helpers/toast";
import { useAPI } from "../providers/ApiProvider";

export const UrlTable = () => {
  const { list } = useAPI();
  const [links, listLinks] = list;

  // fetch links on inital render
  React.useEffect(() => {
    listLinks();
  }, []);

  const urls = links.data as
    | { short_url: string; slug: string; url: string }[]
    | undefined;

  return (
    <>
      <div className="mb-6">Recent URLS</div>
      <div className="overflow-scroll">
        {!links.data && links.loading ? (
          <div data-testid="spinner">
            <Spinner />
          </div>
        ) : links.error ? (
          <Callout intent="danger" data-testid="error-callout">
            {links.error}
          </Callout>
        ) : !urls || !urls.length ? (
          <Callout intent="primary" data-testid="empty-callout">
            No links found! Try shortening a new one above!
          </Callout>
        ) : (
          <HTMLTable
            interactive
            striped
            condensed
            className="w-full overflow-scroll"
          >
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Short URL</th>
              </tr>
            </thead>

            <tbody>
              {urls.map((l, i) => (
                <tr key={i} onClick={() => copy(l.short_url)} data-testid={i}>
                  <td className="w-2/5">{l.url}</td>
                  <td className="w-2/5">{l.short_url}</td>

                  <td className="w-1/5" style={{ textAlign: "right" }}>
                    <Tooltip content="Copy">
                      <Button
                        icon="clipboard"
                        intent="primary"
                        minimal
                        onClick={(e: any) => {
                          e.stopPropagation();
                          copy(l.short_url);
                        }}
                      />
                    </Tooltip>

                    <Tooltip content="Delete">
                      <DeleteButton slug={l.slug} />
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        )}
      </div>
    </>
  );
};

const DeleteButton: React.FC<{ slug: string }> = ({ slug }) => {
  const { list, delete: deleteLink } = useAPI();

  const [, listLinks] = list;
  const [, deleteUrl] = deleteLink;

  const [loading, setLoading] = React.useState(false);

  return (
    <Button
      data-testid={`delete`}
      icon="trash"
      intent="danger"
      minimal
      loading={loading}
      onClick={async (e: any) => {
        setLoading(true);
        e.stopPropagation();
        try {
          await deleteUrl(slug);
          toaster.show({
            message: "URL deleted!",
            intent: "success",
          });
          await listLinks();
        } catch (e) {
          toaster.show({
            message: e.message || "Oops somethig went wrong",
            intent: "danger",
          });
        }
        setLoading(false);
      }}
    />
  );
};
