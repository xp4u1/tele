import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const getScale = (page: PDFPageProxy, container: HTMLElement): number => {
  const viewport = page.getViewport({
    scale: 1,
  });

  const width = container.clientWidth;
  const height = container.clientHeight;

  if (!width || !height) return 1;

  return Math.min(width / viewport.width, height / viewport.height);
};

const renderPage = async (
  pdf: PDFDocumentProxy,
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  renderingContext: CanvasRenderingContext2D,
  index: number,
) => {
  if (!Number.isInteger(index))
    throw new Error("Page index must be an integer");

  if (index < 0 || index >= pdf.numPages)
    throw new RangeError(
      `Page ${index} is outside the PDF. ` +
        `Valid range: 0-${pdf.numPages - 1}`,
    );

  const page = await pdf.getPage(index + 1);
  const scale = getScale(page, container);

  const viewport = page.getViewport({
    scale,
  });

  const devicePixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.floor(viewport.width * devicePixelRatio);
  canvas.height = Math.floor(viewport.height * devicePixelRatio);

  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;

  renderingContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  renderingContext.clearRect(0, 0, viewport.width, viewport.height);

  await page.render({
    canvas,
    canvasContext: renderingContext,
    viewport,
  }).promise;
};

export const createPdfPresentation = (
  container: HTMLElement,
  canvas: HTMLCanvasElement,
) => {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get 2D canvas context");

  let pdf: PDFDocumentProxy | null = null;
  let currentPage = 0;

  const requirePdf = () => {
    if (!pdf) throw new Error("PDF has not been loaded");

    return pdf;
  };

  const render = async (index: number) => {
    const document = requirePdf();

    await renderPage(document, container, canvas, context, index);
    currentPage = index;
  };

  const load = async (url: string) => {
    const loadingTask = getDocument({ url });
    pdf = await loadingTask.promise;

    await render(0);
  };

  const goTo = async (index: number) => {
    await render(index);
  };

  const rerender = async () => {
    if (!pdf) return;

    await render(currentPage);
  };

  const next = async () => {
    const document = requirePdf();

    if (currentPage < document.numPages - 1) {
      await goTo(currentPage + 1);
    }
  };

  const previous = async () => {
    if (currentPage > 0) {
      await goTo(currentPage - 1);
    }
  };

  return {
    load,
    goTo,
    rerender,
    next,
    previous,
    page: () => currentPage,
    pageCount: () => pdf?.numPages ?? 0,
  };
};
