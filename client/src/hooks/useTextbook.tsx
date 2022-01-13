import axios from "axios";

export default function useTextbook() {
  type CheckoutData = { book: string; student: string };
  const checkoutTextbook = async (data: CheckoutData[]) => {
    const res = await axios.post("/api/v2/textbooks/books/check-out", {
      data,
    });
    return res.data.message as string;
  };

  type CheckinData = { id: string; quality: string };
  const checkinTextbook = async (data: CheckinData[]) => {
    const res = await axios.patch("/api/v2/textbooks/books/check-in", {
      books: data,
    });
    return res.data.message as string;
  };

  return { checkoutTextbook, checkinTextbook };
}
