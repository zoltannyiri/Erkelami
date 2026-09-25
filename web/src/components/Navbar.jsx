import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + "/api/navigation") 
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching navigation items:", error);
      })
  }, []);

  return (
    <nav className="bg-gray-800 p-4">
      {items.map((item) => (
        <a key={item.id} href={item.url}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}