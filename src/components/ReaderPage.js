// src/components/ReaderPage.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import books from "../data";
import "./ReaderPage.css";

export default function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === parseInt(id));

  if (!book) {
    return <h2 style={{ textAlign: "center" }}>Book not found.</h2>;
  }

  return (
    <div className="reader-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>{book.title}</h2>
      <p className="author">By {book.author}</p>

      <div className="book-content">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in justo
          id urna commodo efficitur. Integer a quam vel justo malesuada blandit.
          Suspendisse potenti. Morbi in lacinia mi. Vestibulum ante ipsum primis
          in faucibus orci luctus et ultrices posuere cubilia curae. Donec
          tincidunt leo id turpis congue, ut efficitur nisl tristique. Curabitur
          sit amet nisl ac sapien viverra vulputate. Pellentesque ut neque vel
          lectus commodo ultricies vitae in nibh.
        </p>

        <p>
          Proin ut ipsum id ligula porttitor pulvinar. Nullam non ex eget massa
          vestibulum maximus. Cras egestas nisi non faucibus convallis. Morbi
          non venenatis magna. Maecenas ut lacus justo. Praesent porttitor ex
          vitae ante feugiat, nec suscipit est commodo.
        </p>
      </div>
    </div>
  );
}
