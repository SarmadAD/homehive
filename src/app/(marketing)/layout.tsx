"use client";

import * as React from "react";
import GlobalStyles from "@mui/material/GlobalStyles";
import { MainNav } from "src/components/marketing/layout/top-nav";
import { Footer } from "src/components/marketing/layout/footer";
import { useEffect } from "react";
import "./gradient.css"; // Import der CSS-Datei

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  useEffect(() => {
    const patternElement = document.getElementById("pattern");

    if (!patternElement) return;

    const countY = Math.ceil(patternElement.clientHeight / 40) + 1;
    const countX = Math.ceil(patternElement.clientWidth / 48) + 1;
    const gap = 2;

    for (let i = 0; i < countY; i++) {
      for (let j = 0; j < countX; j++) {
        const hexagon = document.createElement("div");
        hexagon.style.background =
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODciIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgODcgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMi4xOTg3MyAyNi4xNTQ3TDQzLjUgMi4zMDk0TDg0LjgwMTMgMjYuMTU0N1Y3My44NDUzTDQzLjUgOTcuNjkwNkwyLjE5ODczIDczLjg0NTNWMjYuMTU0N1oiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjwvc3ZnPgo=') no-repeat";
        hexagon.style.width = "44px";
        hexagon.style.height = "50px";
        hexagon.style.backgroundSize = "contain";
        hexagon.style.position = "absolute";
        hexagon.style.top = `${i * 40}px`;
        hexagon.style.left = `${j * 48 + ((i * 24) % 48)}px`;

        patternElement.appendChild(hexagon);
      }
    }

    let mousePosition = {
      x: 0,
      y: 0,
    };

    document.addEventListener("mousemove", (mouse) => {
      mousePosition = {
        x: mouse.clientX,
        y: mouse.clientY,
      };
    });

    const loop = () => {
      const gradientElement = document.getElementById("gradient");

      if (gradientElement) {
        const scrollX = window.scrollX || 0;
        const scrollY = window.scrollY || 0;

        gradientElement.style.transform = `translate(${mousePosition.x + scrollX}px, ${mousePosition.y + scrollY}px)`;
      }

      // Request the next animation frame
      window.requestAnimationFrame(loop);
    };

    // Start the animation loop
    window.requestAnimationFrame(loop);
  }, []);

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          body: {
            "--MainNav-height": "72px",
            "--MainNav-zIndex": 1000,
            "--SideNav-width": "280px",
            "--SideNav-zIndex": 1100,
            "--MobileNav-width": "320px",
            "--MobileNav-zIndex": 1100,
            // backgroundRepeat: "no-repeat",
            // backgroundPosition: "top center",
            // backgroundImage: 'url("/assets/gradient-bg.svg")',
            pt: "120px",
          },
        }}
      />
      <div>
        <MainNav />
        {children}
        <Footer />
      </div>
    </React.Fragment>
  );
}
