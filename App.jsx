import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, MapPin, Search, Star, Clock, ArrowLeft, 
  Tag, Bike, ShoppingCart, Send, Phone, Navigation, Plus, Minus,
  Car, Package, Store as MartIcon, Sparkles, CheckCircle, ChevronRight, MessageCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('food'); // food, mart, express, ride
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedAddress, setSelectedAddress] = useState('บ้าน (สุขุมวิท 55)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [currentOrderStatus, setCurrentOrderStatus] = useState(null); // 'preparing', 'delivering', 'completed'
  const [orderStep, setOrderStep] = useState(1);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'driver', text: 'สวัสดีครับ ไรเดอร์ CONNECT ได้รับออเดอร์แล้ว กำลังไปรับอาหารครับ!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // จำลองการเปลี่ยนสถานะออเดอร์อัตโนมัติ
  useEffect(() => {
    if (currentOrderStatus === 'delivering') {
      const timer1 = setTimeout(() => setOrderStep(2), 3000); // ร้านเริ่มทำ
      const timer2 = setTimeout(() => setOrderStep(3), 7000); // ไรเดอร์กำลังมา
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [currentOrderStatus]);

  const categories = ['ทั้งหมด', '🔥 โค้ดคุ้ม', 'ส่งฟรี', 'อาหารตามสั่ง', 'คาเฟ่ & ชา', 'สตรีทฟู้ด', 'อาหารญี่ปุ่น'];

  const stores = [
    {
      id: 1,
      name: 'CONNECT Coffee & Roastery',
      category: 'คาเฟ่ & ชา',
      rating: 4.9,
      reviewCount: '1.2k+',
      deliveryTime: '15-20 นาที',
      distance: '1.2 กม.',
      deliveryFee: 0,
      badge: 'ส่งฟรี',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60',
      menu: [
        { id: 101, name: 'CONNECT Signature Iced Latte', price: 75, description: 'เมล็ดอาราบิก้าคั่วกลาง ผสมนมนุ่มละมุน', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=60', popular: true },
        { id: 102, name: 'Uji Matcha Premium Latte', price: 95, description: 'มัทฉะแท้เกรดพิธีการจากอุจิ เข้มข้นหอมชา', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&auto=format&fit=crop&q=60', popular: true },
        { id: 103, name: 'Croissant Butter Classic', price: 65, description: 'ครัวซองต์เนยสดฝรั่งเศส อบสดใหม่ทุกวัน', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=60', popular: false }
      ]
    },
    {
      id: 2,
      name: 'กะเพราแท้ CONNECT Express',
      category: 'อาหารตามสั่ง',
      rating: 4.8,
      reviewCount: '2.5k+',
      deliveryTime: '20-30 นาที',
      distance: '2.1 กม.',
      deliveryFee: 15,
      badge: 'ลด 50%',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60',
      menu: [
        { id: 201, name: 'ข้าวผัดกะเพราหมูกรอบสูตรโบราณ', price: 89, description: 'หมูกรอบหนังกรอบผัดพริกแห้งเข้มข้น', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=60', popular: true },
        { id: 202, name: 'ข้าวผัดกะเพราเนื้อโคขุนสับ + ไข่ดาวพริกน้ำปลา', price: 105, description: 'เนื้อโคขุนสับละเอียด หอมกลิ่นคั่วกระทะ', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60', popular: true }
      ]
    }
  ];

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || store.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'ทั้งหมด') return matchesSearch;
    if (selectedCategory === 'ส่งฟรี') return matchesSearch && store.deliveryFee === 0;
    return matchesSearch && store.category === selectedCategory;
  });

  const addToCart = (item, store) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1, storeName: store.name }];
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? (selectedStore?.deliveryFee || 15) : 0;
  const discount = appliedVoucher === 'CONNECT50' ? 50 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const applyVoucher = () => {
    if (voucherCode.toUpperCase() === 'CONNECT50') setAppliedVoucher('CONNECT50');
    else alert('โค้ดไม่ถูกต้อง (ลองใช้: CONNECT50)');
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: inputMessage }]);
    setInputMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'driver', text: 'รับทราบครับผม กำลังรีบส่งให้ครับ!' }]);
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen pb-20 font-sans text-gray-800 border-x border-gray-200">
      
      {/* 🟢 TOP HEADER SECTION */}
      <header className="bg-emerald-600 text-white p-4 sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-white text-emerald-600 font-extrabold px-2.5 py-0.5 rounded-lg text-xl tracking-tight shadow-sm">CONNECT</span>
            <div className="flex items-center text-xs bg-emerald-700/80 px-3 py-1 rounded-full cursor-pointer hover:bg-emerald-800">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-yellow-300" />
              <select 
                value={selectedAddress} 
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="bg-transparent font-semibold focus:outline-none cursor-pointer text-white"
              >
                <option value="บ้าน (สุขุมวิท 55)" className="text-gray-800">จัดส่งที่: บ้าน (สุขุมวิท 55)</option>
                <option value="ออฟฟิศ (อโศก)" className="text-gray-800">จัดส่งที่: ออฟฟิศ (อโศก)</option>
              </select>
            </div>
          </div>

          <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-emerald-700/80 rounded-full hover:bg-emerald-800">
            <ShoppingCart className="w-5 h-5 text-white" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-600 animate-pulse">
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="ค้นหาร้านค้า เมนูโปรด หรือของกิน..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-800 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none shadow-inner"
          />
        </div>
      </header>

      {/* 🛵 SERVICE HUB NAVIGATION TABS */}
      {!selectedStore && (
        <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-100 grid grid-cols-4 gap-2 text-center">
          <button onClick={() => setActiveTab('food')} className={`p-2 rounded-xl flex flex-col items-center transition ${activeTab === 'food' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-500'}`}>
            <div className={`p-2 rounded-full ${activeTab === 'food' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}><Bike className="w-5 h-5" /></div>
            <span className="text-xs mt-1">อาหาร</span>
          </button>
          <button onClick={() => setActiveTab('mart')} className={`p-2 rounded-xl flex flex-col items-center transition ${activeTab === 'mart' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-500'}`}>
            <div className={`p-2 rounded-full ${activeTab === 'mart' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}><MartIcon className="w-5 h-5" /></div>
            <span className="text-xs mt-1">มาร์ท/ของสด</span>
          </button>
          <button onClick={() => setActiveTab('express')} className={`p-2 rounded-xl flex flex-col items-center transition ${activeTab === 'express' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-500'}`}>
            <div className={`p-2 rounded-full ${activeTab === 'express' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}><Package className="w-5 h-5" /></div>
            <span className="text-xs mt-1">ส่งพัสดุ</span>
          </button>
          <button onClick={() => setActiveTab('ride')} className={`p-2 rounded-xl flex flex-col items-center transition ${activeTab === 'ride' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-gray-500'}`}>
            <div className={`p-2 rounded-full ${activeTab === 'ride' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}><Car className="w-5 h-5" /></div>
            <span className="text-xs mt-1">เรียกรถ</span>
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="p-4">
        {selectedStore ? (
          /* STORE DETAIL VIEW */
          <div>
            <button onClick={() => setSelectedStore(null)} className="flex items-center text-emerald-700 font-semibold mb-3 text-xs bg-emerald-100/60 px-3 py-1.5 rounded-lg w-fit">
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับไปหน้ารวมร้าน
            </button>
            <div className="relative rounded-2xl overflow-hidden mb-3 shadow-md">
              <img src={selectedStore.banner} alt={selectedStore.name} className="w-full h-44 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="text-white">
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{selectedStore.category}</span>
                  <h1 className="text-xl font-extrabold mt-1">{selectedStore.name}</h1>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between text-xs text-gray-600 mb-4 border border-gray-100">
              <span className="flex items-center text-amber-50
