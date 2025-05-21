import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("jspdf", () => ({
  jsPDF: function () {
    return {
      addImage: jest.fn(),
      save: jest.fn(),
      setFontSize: jest.fn(),
      text: jest.fn(),
      addPage: jest.fn(),
    };
  },
}));

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
