import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { db } from "../../services/firebase";
import { addDoc, collection, documentId, getDocs, query, where, writeBatch } from "firebase/firestore";

export default function Checkout() {
  const [orderCreated, setOrderCreated] = useState(false);
  const [buyer, setBuyer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const { cart, totalQuantity, getTotal, clearCart } = useCart();
  const total = getTotal();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBuyer((prevBuyer) => ({
      ...prevBuyer,
      [name]: value,
    }));
  };

  const createOrder = async () => {
    setLoading(true);

    const objOrder = {
      buyer,
      items: cart,
      totalQuantity,
      total,
      date: new Date(),
    };

    const ids = cart.map((item) => item.id);
    const productRef = collection(db, "products");

    const productsAddedFromFirestore = await getDocs(
      query(productRef, where(documentId(), "in", ids))
    );

    const { docs } = productsAddedFromFirestore;

    const outOfStock = [];
    const batch = writeBatch(db);

    docs.forEach((doc) => {
      const dataDoc = doc.data();
      const stockDb = dataDoc.stock;

      const productAddedToCart = cart.find((prod) => prod.id === doc.id);
      const prodQuantity = productAddedToCart.quantity;

      if (stockDb >= prodQuantity) {
        batch.update(doc.ref, { stock: stockDb - prodQuantity });
      } else {
        outOfStock.push({ id: doc.id, ...dataDoc });
      }
    });

    if (outOfStock.length === 0) {
      await batch.commit();
      const orderRef = collection(db, "orders");
      const orderAdded = await addDoc(orderRef, objOrder);
      console.log(`El id de su orden es ${orderAdded.id}`);
      clearCart();
      setOrderCreated(true);
    } else {
      console.log("Hay productos fuera de stock");
    }

    setLoading(false);
  };

  if (orderCreated) {
    return <h1>La orden fue creada correctamente</h1>;
  }

  return (
    <>
      <h1>Checkout</h1>
      {/* Formulario de checkout */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createOrder();
        }}
      >
        <div>
          <label htmlFor="firstName">Nombre:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={buyer.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Apellido:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={buyer.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={buyer.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="address">Dirección:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={buyer.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Procesando..." : "Generar Orden"}
        </button>
      </form>
    </>
  );
}
