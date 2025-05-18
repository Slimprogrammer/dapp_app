import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const CryptoNews = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "https://data-api.coindesk.com/news/v1/article/list?lang=EN&limit=100"
        );
        setNews(response.data.Data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const formatTimeAgo = (timestamp) => {
    const diff = Math.floor((Date.now() / 1000 - timestamp) / (60 * 60 * 24));
    return diff === 0 ? "Today" : `${diff} day${diff > 1 ? "s" : ""} ago`;
  };

  const handleBack = () => setSelectedNews(null);
  const handleLoadMore = () => setVisibleCount((prev) => prev + 10);

  return (
    <div className="container py-3">
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        {selectedNews && (
          <button className="btn btn-link p-0 me-2" onClick={handleBack}>
            <span style={{ fontSize: "1.5rem" }}>←</span>
          </button>
        )}
        <h4 className="mb-0">News</h4>
      </div>

      {/* Detail View */}
      {selectedNews ? (
        <div>
          <img
            src={selectedNews.IMAGE_URL}
            className="img-fluid rounded mb-3"
            alt={selectedNews.TITLE}
          />
          <h5>{selectedNews.TITLE}</h5>
          <p className="text-muted">
            By {selectedNews.SOURCE_DATA?.NAME || "Unknown Source"}
          </p>
          <p>{selectedNews.BODY}</p>
        </div>
      ) : (
        <>
          {news.slice(0, visibleCount).map((item) => (
            <div
              key={item.ID}
              className="d-flex mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedNews(item)}
            >
              <img
                src={item.IMAGE_URL}
                alt={item.TITLE}
                className="me-3 rounded"
                style={{ width: 64, height: 64, objectFit: "cover" }}
              />
              <div>
                <h6 className="mb-1">{item.TITLE.slice(0, 50)}...</h6>
                <small className="text-success d-block mb-1">
                  By {item.SOURCE_DATA?.NAME}
                </small>
                <small className="text-muted">
                  {item.BODY.slice(0, 80)}...
                </small>
                <div className="text-muted small">
                  {formatTimeAgo(item.PUBLISHED_ON)}
                </div>
              </div>
            </div>
          ))}

          {/* Load More */}
          {visibleCount < news.length && (
            <div className="text-center mt-4">
              <button
                className="btn btn-info text-white"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CryptoNews;
