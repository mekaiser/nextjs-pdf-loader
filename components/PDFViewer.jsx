"use client";

import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};

const maxWidth = 800;

export default function Sample() {
  const [file, setFile] = useState("./sample.pdf");
  // const [file, setFile] = useState("./Phy_Suggestions-Poripurok_Compressed.pdf");
  const [numPages, setNumPages] = useState();
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState();

  const onResize = useCallback((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  useEffect(() => {
    const preventPDFDownload = (event) => {
      event.preventDefault();
    };

    // Attach the event listener to the global window object
    window.addEventListener("beforeunload", preventPDFDownload);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", preventPDFDownload);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center ">
        <div className="pdf__container__document w-full" ref={setContainerRef}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            onContextMenu={(e) => e.preventDefault()}
            className="pdf-view-container"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={
                  containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
                }
                onRenderSuccess={(e) => e.preventDefault()}
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
