import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, ShoppingBag, Calendar, DollarSign, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const res = await axios.get("http://localhost:5000/api/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Sort orders by date (newest first)
                const sortedOrders = res.data.sort((a, b) => 
                    new Date(b.date) - new Date(a.date)
                );
                
                setOrders(sortedOrders);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const toggleOrderDetails = (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="mr-4 p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="mx-auto w-16 h-16 bg-indigo-100 flex items-center justify-center rounded-full mb-4">
                            <ShoppingBag className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No Orders Found</h3>
                        <p className="text-gray-500">There are no orders in the system yet.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <React.Fragment key={order._id}>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {order._id.substring(order._id.length - 8)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.customer_name || "Customer " + order.customer_id.substring(order.customer_id.length - 6)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1 text-indigo-500" />
                                                        {formatDate(order.date)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">

                                                        {formatCurrency(order.amount)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Package className="w-4 h-4 mr-1 text-indigo-500" />
                                                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => toggleOrderDetails(order._id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        {expandedOrder === order._id ? "Hide Details" : "View Details"}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedOrder === order._id && (
                                                <tr className="bg-indigo-50/30">
                                                    <td colSpan="6" className="px-6 py-4">
                                                        <div className="rounded-lg border border-indigo-100 overflow-hidden">
                                                            <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
                                                                <h4 className="font-medium text-indigo-700">Order Items</h4>
                                                            </div>
                                                            <div className="p-4">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {order.items.map((item, index) => (
                                                                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                                                <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                                                                                <td className="px-4 py-2 text-sm text-gray-500">{item.quantity}</td>
                                                                                <td className="px-4 py-2 text-sm text-gray-500">{formatCurrency(item.price)}</td>
                                                                                <td className="px-4 py-2 text-sm text-gray-700 font-medium">
                                                                                    {formatCurrency(item.price * item.quantity)}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                    <tfoot className="bg-gray-50">
                                                                        <tr>
                                                                            <td colSpan="3" className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total:</td>
                                                                            <td className="px-4 py-2 text-sm font-bold text-gray-900">{formatCurrency(order.amount)}</td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
