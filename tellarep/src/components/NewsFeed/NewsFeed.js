import React, { useEffect, useState } from "react";
import NewsItem from "../NewsItem/NewsItem";
import SignupTeaser from "../SignupTeaser/SignupTeaser";
import SharePrompt from "../SharePrompt/SharePrompt";
import Poll from "../Poll/Poll";
import "./NewsFeed.css";

function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let url = "/.netlify/functions/get-news";
    if (searchQuery) {
      url += `?query=${encodeURIComponent(searchQuery)}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the data for debugging
        setArticles(data.articles);
      })
      .catch((error) => {
        console.error("Error fetching the news", error);
      });
  }, [searchQuery]);

  return (
    <div className="news-feed">
      <div className="search-input">
        <input
          type="text"
          placeholder="Search for articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setSearchQuery(searchQuery)}>Search</button>
      </div>

      {articles.map((article, index) => (
        <React.Fragment key={article.url}>
          <NewsItem article={article} />
          {(index + 1) % 3 === 0 && (
            <React.Fragment>
              {/* Alternate between SharePrompt and Poll */}
              {Math.floor(index / 3) % 2 === 0 ? <SharePrompt /> : <Poll />}
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default NewsFeed;
