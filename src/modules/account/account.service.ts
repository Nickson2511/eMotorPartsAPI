import User from "../user/user.model";
import Order from "../order/order.model";
import Address from "../address/address.model";
import Wishlist from "../wishlist/wishlist.model";
import Cart from "../cart/cart.model";

export const getAccountDashboard = async (userId: string) => {

    const user = await User.findById(userId)
        .select("-password -refreshToken");

    if (!user) {
        throw new Error("User not found");
    }

    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5);

    const totalOrders = await Order.countDocuments({ user: userId });

    const addresses = await Address.find({ user: userId });

    const defaultAddress = addresses.find(a => a.isDefault);

    const wishlist = await Wishlist.findOne({ user: userId });

    const cart = await Cart.findOne({ user: userId });

    return {
        user,

        stats: {
            totalOrders,
            wishlistItems: wishlist?.products?.length || 0,
            cartItems: cart?.items?.length || 0,
            addresses: addresses.length
        },

        defaultAddress,

        recentOrders: orders
    };
};