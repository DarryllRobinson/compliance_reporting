import { render, screen, waitFor } from "./test-utils";
import BlogIndex from "../routes/BlogIndex";

beforeAll(() => {
  global.fetch = jest.fn((url) => {
    if (url === "/blog/index.json") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ slug: "example-post" }]),
      });
    }

    if (url === "/blog/example-post.md") {
      return Promise.resolve({
        ok: true,
        text: () =>
          Promise.resolve(`---
title: Mock Post
description: A short mock post.
date: 2025-05-20
tags: [testing]
---`),
      });
    }

    return Promise.reject(new Error("not mocked"));
  });
});

test.skip("renders blog index header", async () => {
  render(<BlogIndex />);
  await waitFor(() => {
    expect(screen.getByText(/compliance blog/i)).toBeInTheDocument();
  });
});
