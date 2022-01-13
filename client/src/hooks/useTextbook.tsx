import axios from "axios";

export default function useTextbook() {
  type CheckoutData = { book: string; student: string };
  const checkoutTextbook = async (data: CheckoutData[]) => {
    const res = await axios.post("/api/v2/textbooks/books/check-out", {
      data,
    });
    return res.data.message;
  };

  return { checkoutTextbook };
}
