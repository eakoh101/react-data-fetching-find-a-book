import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [dataquery, setDataquery] = useState("");
  const [books, setBooks] = useState([]);
  const [isloading, setIsloading] = useState(false);

  const fetchBook = async (serchTerm) => {
    if (!serchTerm) {
      setBooks([]);
      return;
    }
    setIsloading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${serchTerm}`,
      );
      setBooks(response.data.items) || [];
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => fetchBook(dataquery), 500);
    return () => clearTimeout(timer);
  }, [dataquery]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Find a Book</h1>

      {/* ส่วนของ Input */}
      <input
        type="text"
        placeholder="พิมพ์ชื่อหนังสือ..."
        value={dataquery}
        onChange={(e) => setDataquery(e.target.value)}
        style={{ width: "300px", padding: "8px", fontSize: "16px" }}
      />

      <hr />

      {/* ส่วนการแสดงผลรายการ */}
      {isloading ? (
        <p>กำลังค้นหาข้อมูล...</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id} style={{ marginBottom: "10px" }}>
              <strong>{book.volumeInfo.title}</strong>
              {book.volumeInfo.authors && (
                <span style={{ color: "gray" }}>
                  {" "}
                  - {book.volumeInfo.authors?.join(", ")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {!isloading && dataquery && books.length === 0 && (
        <p>ไม่พบข้อมูลหนังสือที่คุณค้นหา</p>
      )}
    </div>
  );
}

export default App;
