CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INT DEFAULT 0
)

INSERT INTO blogs (author, url, title, likes)
VALUES ('Jane Doe', 'https://janedoe.com/how-to-cook', 'How to Cook Delicious Meals', 10);
INSERT INTO blogs (author, url, title, likes)
VALUES ('John Doe', 'https://johndoe.com/tech-trends', 'Top Tech Trends for 2024', 25);