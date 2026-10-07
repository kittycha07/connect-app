import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, MapPin, Search, Star, Clock, ChevronRight, 
  Plus, Minus, ArrowLeft, Tag, Bike, Store, ShoppingCart, 
  Send, User, Phone, CheckCircle2, MessageSquare, ShieldCheck
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('food');
  const [selectedAddress, setSelectedAddress] = useState('บ้าน (สุขุมวิท 55)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [currentOrderStatus, setCurrentOrderStatus] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'driver', text: 'สวัสดีครับ ไรเดอร์กำลังเดินทางไปรับอาหารที่ร้านครับ' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // ตัวอย่างข้อมูลร้านค้าสำหรับ CONNECT
  const stores = [
    {
      id: 1,
      name: 'CONNECT Coffee & Bakery',
      category: 'เครื่องดื่ม & คาเฟ่',
      rating: 4.9,
      deliveryTime: '15-25 นาที',
      distance: '1.2 กม.',
      deliveryFee: 15,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60',
      menu: [
        { id: 101, name: 'CONNECT Iced Latte', price: 75, description: 'กาแฟเอสเพรสโซเข้มข้นผสมนมนุ่มลิ้น', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=60' },
        { id: 102, name: 'Matcha Green Tea', price: 85, description: 'ชาเขียวมัทฉะแท้จากอุจิ เกียวโต', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&auto=format&fit=crop&q=60' },
        { id: 103, name: 'Croissant Butter Classic', price: 65, description: 'ครัวซองต์เนยสดแท้นำเข้าจากฝรั่งเศส', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=60' }
      ]
    },
    {
      id: 2,
      name: 'กะเพราแท้ CONNECT Express',
      category: 'อาหารไทย',
      rating: 4.8,
      deliveryTime: '20-30 นาที',
      distance: '2.5 กม.',
      deliveryFee: 20,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
      banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60',
      menu: [
        { id: 201, name: 'ข้าวผัดกะเพราหมูกรอบ + ไข่ดาว', price: 89, description: 'หมูกรอบแท้คั่วกะเพราหอมกลิ่นกระทะ', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=60' },
        { id: 202, name: 'ข้าวผัดกะเพราเนื้อสับ', price: 95, description: 'เนื้อโคขุนสับผัดพริกแห้งเข้มข้น', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60' }
      ]
    }
  ];

  const addToCart = (item, store, options = {}) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, storeName: store.name, storeId: store.id, options }];
    });
    setSelectedMenuItem(null);
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
  const deliveryFee = cart.length > 0 ? 20 : 0;
  const discount = appliedVoucher ? (appliedVoucher === 'CONNECT50' ? 50 : 20) : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const applyVoucher = () => {
    if (voucherCode.toUpperCase() === 'CONNECT50') {
      setAppliedVoucher('CONNECT50');
    } else {
      alert('โค้ดส่วนลดไม่ถูกต้อง (ลองใช้โค้ด CONNECT50)');
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: inputMessage }]);
    setInputMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'driver', text: 'รับทราบครับ กำลังเร่งเดินทางครับ!' }]);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20 font-sans text-gray-800 border-x border-gray-200">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-white text-emerald-600 font-extrabold px-2 py-0.5 rounded text-lg tracking-wider">CONNECT</span>
            <div className="flex items-center text-xs bg-emerald-700/60 px-2 py-1 rounded-full">
              <MapPin className="w-3 h-3 mr-1" />
              <select 
                value={selectedAddress} 
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="บ้าน (สุขุมวิท 55)" className="text-gray-800">บ้าน (สุขุมวิท 55)</option>
                <option value="ออฟฟิศ (อโศก)" className="text-gray-800">ออฟฟิศ (อโศก)</option>
                <option value="คอนโด (ห้วยขวาง)" className="text-gray-800">คอนโด (ห้วยขวาง)</option>
              </select>
            </div>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-emerald-700 rounded-full hover:bg-emerald-800 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-600">
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="ค้นหาร้านค้า หรือเมนูโปรดใน CONNECT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-gray-800 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none shadow-inner"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {selectedStore ? (
          /* Detail Store View */
          <div>
            <button 
              onClick={() => setSelectedStore(null)} 
              className="flex items-center text-emerald-600 font-medium mb-3 text-sm bg-emerald-50 px-3 py-1.5 rounded-lg w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> ย้อนกลับไปหน้าร้านค้า
            </button>
            <img src={selectedStore.banner} alt={selectedStore.name} className="w-full h-40 object-cover rounded-xl mb-3 shadow-sm" />
            <h1 className="text-xl font-bold text-gray-900">{selectedStore.name}</h1>
            <div className="flex items-center text-xs text-gray-500 space-x-3 my-2">
              <span className="flex items-center text-amber-500 font-bold"><Star className="w-3.5 h-3.5 fill-current mr-0.5" />{selectedStore.rating}</span>
              <span>•</span>
              <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-0.5" />{selectedStore.deliveryTime}</span>
              <span>•</span>
              <span>ค่าส่ง ฿{selectedStore.deliveryFee}</span>
            </div>

            <h2 className="font-bold text-gray-800 mt-5 mb-3 border-b pb-1">รายการเมนู</h2>
            <div className="space-y-3">
              {selectedStore.menu.map(item => (
                <div key={item.id} className="bg-white p-3 rounded-xl flex justify-between shadow-sm border border-gray-100">
                  <div className="flex-1 pr-3">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.description}</p>
                    <p className="text-emerald-600 font-bold text-sm mt-2">฿{item.price}</p>
                  </div>
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <button 
                      onClick={() => addToCart(item, selectedStore)}
                      className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full shadow-md hover:bg-emerald-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Home View */
          <div>
            {/* Promo Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-sm mb-5 flex justify-between items-center">
              <div>
                <span className="bg-yellow-400 text-xs font-bold text-gray-900 px-2 py-0.5 rounded-full">โค้ดส่วนลด</span>
                <h3 className="font-bold text-lg mt-1">ลดทันที 50 บาท!</h3>
                <p className="text-xs text-emerald-100 mt-0.5">ใช้โค้ด: <span className="font-bold underline">CONNECT50</span></p>
              </div>
              <Tag className="w-12 h-12 opacity-80" />
            </div>

            <h2 className="font-bold text-gray-800 mb-3 text-lg">ร้านค้าแนะนำใกล้คุณ</h2>
            <div className="space-y-4">
              {stores.map(store => (
                <div 
                  key={store.id} 
                  onClick={() => setSelectedStore(store)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
                >
                  <img src={store.image} alt={store.name} className="w-full h-36 object-cover" />
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900">{store.name}</h3>
                      <span className="bg-amber-50 text-amber-700 font-bold text-xs px-2 py-0.5 rounded-md flex items-center">
                        <Star className="w-3 h-3 fill-current text-amber-400 mr-1" />{store.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{store.category} • {store.distance}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-50">
                      <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      <span>{store.deliveryTime}</span>
                      <span className="ml-auto font-medium text-emerald-600">ค่าส่ง ฿{store.deliveryFee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col p-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-lg">ตะกร้าของคุณ (CONNECT)</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <ShoppingBag className="w-16 h-16 mb-2 stroke-1" />
                <p>ยังไม่มีสินค้าในตะกร้า</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-3 space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-emerald-600 font-bold">฿{item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-lg border">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-500"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-emerald-600"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}

                  {/* Promo Input */}
                  <div className="mt-4 pt-3 border-t">
                    <label className="text-xs font-semibold text-gray-600">โค้ดส่วนลด</label>
                    <div className="flex mt-1">
                      <input 
                        type="text" 
                        placeholder="กรอก CONNECT50"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="flex-1 border rounded-l-lg px-3 py-1.5 text-sm focus:outline-none"
                      />
                      <button onClick={applyVoucher} className="bg-emerald-600 text-white px-4 text-sm font-medium rounded-r-lg">ใช้โค้ด</button>
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-600"><span>ค่าอาหาร</span><span>฿{subtotal}</span></div>
                  <div className="flex justify-between text-gray-600"><span>ค่าจัดส่ง</span><span>฿{deliveryFee}</span></div>
                  {discount > 0 && <div className="flex justify-between text-red-500"><span>ส่วนลด</span><span>-฿{discount}</span></div>}
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t">
                    <span>ยอดรวมทั้งหมด</span>
                    <span className="text-emerald-600">฿{grandTotal}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setCurrentOrderStatus('preparing');
                      setIsCartOpen(false);
                      setCart([]);
                    }}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold mt-3 shadow-lg hover:bg-emerald-700"
                  >
                    ยืนยันสั่งซื้อ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Live Tracking View Modal */}
      {currentOrderStatus && (
        <div className="fixed inset-0 bg-white z-40 p-4 flex flex-col max-w-md mx-auto">
          <div className="flex justify-between items-center pb-3 border-b">
            <h2 className="font-bold text-lg text-emerald-600">CONNECT Live Tracking</h2>
            <button onClick={() => setCurrentOrderStatus(null)} className="text-gray-400 font-bold">✕</button>
          </div>

          <div className="my-4 p-4 bg-emerald-50 rounded-2xl flex items-center space-x-3 border border-emerald-100">
            <Bike className="w-8 h-8 text-emerald-600 animate-bounce" />
            <div>
              <p className="font-bold text-emerald-900">ไรเดอร์กำลังจัดส่งอาหารของคุณ</p>
              <p className="text-xs text-emerald-600">ประมาณการเวลาถึง: 15 นาที</p>
            </div>
          </div>

          {/* Driver Info */}
          <div className="bg-white border p-3 rounded-xl flex items-center justify-between mb-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-700">
                สมชาย
              </div>
              <div>
                <p className="font-bold text-sm">สมชาย ใจดี (CONNECT Rider)</p>
                <p className="text-xs text-gray-500">ฮอนด้า เวฟ • กข-1234</p>
              </div>
            </div>
            <a href="tel:0812345678" className="p-2 bg-emerald-50 text-emerald-600 rounded-full"><Phone className="w-4 h-4" /></a>
          </div>

          {/* Chat Section */}
          <div className="flex-1 border rounded-xl p-3 flex flex-col justify-between bg-gray-50">
            <div className="space-y-2 overflow-y-auto max-h-60">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className={`px-3 py-1.5 rounded-xl text-xs max-w-[80%] ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-800 border'}`}>
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex space-x-2 mt-2">
              <input 
                type="text" 
                placeholder="ส่งข้อความถึงไรเดอร์..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none"
              />
              <button onClick={handleSendMessage} className="bg-emerald-600 text-white p-2 rounded-lg"><Send className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
