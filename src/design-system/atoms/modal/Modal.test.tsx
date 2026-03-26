import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { HTMLAttributes, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Modal } from "@/design-system/atoms/modal/Modal";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  motion: {
    div: (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    main: (props: HTMLAttributes<HTMLElement>) => <main {...props} />,
  },
}));

afterEach(() => {
  cleanup();
});

describe("Modal", () => {
  it("does not render when closed", () => {
    render(
      <Modal open={false} onClose={vi.fn()}>
        <p>Conteudo do modal</p>
      </Modal>,
    );

    expect(screen.queryByText("Conteudo do modal")).not.toBeInTheDocument();
  });

  it("closes when clicking the overlay", () => {
    const onClose = vi.fn();

    render(
      <Modal open onClose={onClose}>
        <p>Conteudo do modal</p>
      </Modal>,
    );

    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking inside content", () => {
    const onClose = vi.fn();

    render(
      <Modal open onClose={onClose}>
        <p>Conteudo do modal</p>
      </Modal>,
    );

    fireEvent.mouseDown(screen.getByText("Conteudo do modal"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
