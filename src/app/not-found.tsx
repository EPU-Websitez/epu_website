"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

const NotFound = () => {
  return (
    <html>
      <body>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Background decorative elements */}

          {/* Top right circular shape */}
          <div
            style={{
              position: "absolute",
              top: "100px",
              right: "100px",
              width: "80px",
              height: "80px",
              opacity: 0.3,
            }}
          >
            <Image
              src="/images/rotate.svg"
              alt="Decorative Rotate Shape"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Top left decorative line */}
          <div
            style={{
              position: "absolute",
              top: "250px",
              left: "180px",
              width: "60px",
              height: "40px",
              opacity: 0.4,
            }}
          >
            <Image
              src="/images/dialog.svg"
              alt="Decorative Dialog Shape"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Bottom left dots */}
          <div
            style={{
              position: "absolute",
              bottom: "100px",
              left: "50px",
              width: "30px",
              height: "80px",
              opacity: 0.4,
            }}
          >
            <Image
              src="/images/dots.svg"
              alt="Decorative Dots"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Bottom right circular shape */}
          <div
            style={{
              position: "absolute",
              bottom: "80px",
              right: "150px",
              width: "100px",
              height: "100px",
              opacity: 0.3,
            }}
          >
            <Image
              src="/images/rotate.svg"
              alt="Decorative Rotate Shape"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Bottom right decorative line */}
          <div
            style={{
              position: "absolute",
              bottom: "200px",
              right: "50px",
              width: "80px",
              height: "60px",
              opacity: 0.4,
            }}
          >
            <Image
              src="/images/dialog.svg"
              alt="Decorative Dialog Shape"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Header Logo */}
          <Link
            href="/"
            style={{
              position: "absolute",
              top: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "200px",
              height: "60px",
              display: "block",
              zIndex: 20,
            }}
          >
            <Image
              src="/images/logo.svg"
              alt="EPU Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>

          {/* Main Content */}
          <div
            style={{
              textAlign: "center",
              zIndex: 10,
              position: "relative",
            }}
          >
            {/* 404 Number Image */}
            <div
              style={{
                marginBottom: "20px",
                width: "300px",
                height: "120px",
                margin: "0 auto 20px auto",
              }}
            >
              <Image
                src="/images/404.svg"
                alt="404 Error Illustration"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>

            {/* Oops! Text */}
            <h1
              style={{
                fontSize: "68px",
                fontWeight: "bold",
                color: "#2c5282",
                marginTop: "-60px",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Oops !
            </h1>

            {/* Error Message */}
            <p
              style={{
                fontSize: "18px",
                color: "#4a5568",
                margin: "0 0 40px 0",
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.5",
              }}
            >
              It looks something went
              <br />
              wrong.
            </p>

            {/* Back to Home Button */}
            <Link
              href="/"
              title="Home"
              style={{
                background: "linear-gradient(135deg, #2c5282 0%, #3182ce 100%)",
                color: "white",
                padding: "12px 30px",
                borderRadius: "25px",
                border: "none",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                fontFamily: "Arial, sans-serif",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textDecoration: "none",
                display: "inline-block",
                position: "relative",
                zIndex: 20,
              }}
            >
              Back To Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
};

export default NotFound;
