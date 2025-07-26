import Order from '../models/Order.js';

export const placeOrder = async (req, res) => {
  try {
    const { books, shippingAddress, paymentMethod } = req.body;

    if (!books || books.length === 0) {
      return res.status(400).json({ message: 'Books are required.' });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required.' });
    }

    const totalAmount = books.reduce((sum, item) => {
      return sum + item.priceAtPurchase * item.quantity;
    }, 0);

    const order = await Order.create({
      user: req.user._id,
      books,
      shippingAddress,
      totalAmount,
      paymentMethod
    });

    res.status(201).json({ message: 'Order placed successfully', order });

  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('books.book');
  res.json(orders);
};
