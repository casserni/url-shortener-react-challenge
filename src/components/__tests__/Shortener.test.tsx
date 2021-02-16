import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";

import { Shortener } from "../Shortener";
import { APIStub, createAPI } from "./utils";

let apiStub: APIStub;

let onCreate = jest.fn();
let onList = jest.fn();

beforeEach(() => {
  onCreate = jest.fn();
  onList = jest.fn();

  apiStub = createAPI({ create: [, onCreate], list: [, onList] });
});

afterEach(() => {
  apiStub.mockRestore();
});

describe("<Shortener />", () => {
  test("should display a blank inputs, with disabled submit button", async () => {
    const { findByTestId } = render(<Shortener />);

    const urlInput = await findByTestId("url-input");
    expect(urlInput).toHaveValue("");

    const slugInput = await findByTestId("slug-input");
    expect(slugInput).toHaveValue("");

    const createButton = await findByTestId("create-button");
    expect(createButton).toBeDisabled();
  });

  test("should enable button after entering a url", async () => {
    const { findByTestId } = render(<Shortener />);

    const urlInput = await findByTestId("url-input");
    fireEvent.change(urlInput, { target: { value: "test" } });

    const createButton = await findByTestId("create-button");
    expect(createButton).toBeEnabled();
  });

  test("should send create with inputs", async () => {
    const { findByTestId } = render(<Shortener />);

    const urlInput = await findByTestId("url-input");
    fireEvent.change(urlInput, { target: { value: "url" } });

    const slugInput = await findByTestId("slug-input");
    fireEvent.change(slugInput, { target: { value: "slug" } });

    const createButton = await findByTestId("create-button");
    fireEvent.click(createButton);

    await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));

    expect(onCreate).toHaveBeenCalledWith({
      slug: "slug",
      url: "url",
    });
  });

  test("should refresh list after successful create", async () => {
    const { findByTestId } = render(<Shortener />);

    const urlInput = await findByTestId("url-input");
    fireEvent.change(urlInput, { target: { value: "url" } });

    const slugInput = await findByTestId("slug-input");
    fireEvent.change(slugInput, { target: { value: "slug" } });

    const createButton = await findByTestId("create-button");
    fireEvent.click(createButton);

    await waitFor(() => expect(onList).toHaveBeenCalledTimes(1));

    expect(onCreate).toHaveBeenCalled();
    expect(onList).toHaveBeenCalled();
  });
});
