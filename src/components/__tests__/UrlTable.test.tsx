import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";

import { UrlTable } from "../UrlTable";
import { APIStub, createAPI } from "./utils";

let apiStub: APIStub;

let onList = jest.fn();
let onDelete = jest.fn();

beforeEach(() => {
  onList = jest.fn();
  onDelete = jest.fn();

  apiStub = createAPI({ delete: [, onDelete], list: [, onList] });
});

afterEach(() => {
  apiStub.mockRestore();
});

describe("<URLTable />", () => {
  test("should load urls on render", async () => {
    apiStub = createAPI({
      delete: [, onDelete],
      list: [{ loading: true }, onList],
    });

    render(<UrlTable />);
    expect(onList).toBeCalled();
  });

  test("should display a loader spinner", async () => {
    apiStub = createAPI({
      delete: [, onDelete],
      list: [{ loading: true }, onList],
    });

    const { findByTestId } = render(<UrlTable />);

    const spinner = await findByTestId("spinner");
    expect(spinner).toBeTruthy();
  });

  test("should display an error callout", async () => {
    apiStub = createAPI({
      delete: [, onDelete],
      list: [{ error: "error" }, onList],
    });

    const { findByTestId } = render(<UrlTable />);

    const callout = await findByTestId("error-callout");
    expect(callout).toHaveTextContent("error");
  });

  test("should display an empty message", async () => {
    const { findByTestId } = render(<UrlTable />);

    const callout = await findByTestId("empty-callout");
    expect(callout).toHaveTextContent(
      "No links found! Try shortening a new one above!"
    );
  });

  test("should list urls", async () => {
    apiStub = createAPI({
      delete: [, onDelete],
      list: [
        { data: [{ short_url: "short", slug: "slug", url: "url" }] },
        onList,
      ],
    });

    const { findByTestId } = render(<UrlTable />);

    await waitFor(() => expect(onList).toHaveBeenCalledTimes(1));

    const row = await findByTestId(0);

    expect(row).toHaveTextContent("short");
    expect(row).toHaveTextContent("url");
  });

  test("should delete url by slug", async () => {
    apiStub = createAPI({
      delete: [, onDelete],
      list: [
        { data: [{ short_url: "short", slug: "slug", url: "url" }] },
        onList,
      ],
    });

    const { findByTestId } = render(<UrlTable />);

    await waitFor(() => expect(onList).toHaveBeenCalledTimes(1));

    const deleteButton = await findByTestId("delete");
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalled();
  });
});
