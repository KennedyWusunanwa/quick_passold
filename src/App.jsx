import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  User,
  Download,
  CreditCard,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  RotateCw,
  ZoomIn,
  Sun,
} from 'lucide-react';

/**
 * MOCK DATA & CONSTANTS
 */
const SERVICES = [
  { id: 'us-passport', name: 'US Passport Photo', price: 14.99, type: 'Digital + Print', desc: '2x2 inches, White Background', sizePresetId: '2x2' },
  { id: 'uk-passport', name: 'UK Passport Photo', price: 12.99, type: 'Digital Code', desc: '35x45mm, Light Grey Background', sizePresetId: '35x45' },
  { id: 'eu-visa', name: 'Schengen Visa', price: 12.99, type: 'Digital', desc: '35x45mm, White Background', sizePresetId: '35x45' },
  { id: 'jp-visa', name: 'Japan Visa', price: 14.99, type: 'Digital', desc: '45x45mm, White Background', sizePresetId: '45x45' },
];

// Country-driven passport size presets
const COUNTRY_FLAGS = {
  Afghanistan: "🇦🇫",
  Algeria: "🇩🇿",
  Argentina: "🇦🇷",
  Australia: "🇦🇺",
  Austria: "🇦🇹",
  Bahrain: "🇧🇭",
  Bangladesh: "🇧🇩",
  Belarus: "🇧🇾",
  Belgium: "🇧🇪",
  Benin: "🇧🇯",
  Bolivia: "🇧🇴",
  Botswana: "🇧🇼",
  Bulgaria: "🇧🇬",
  'Burkina Faso': "🇧🇫",
  Cambodia: "🇰🇭",
  Cameroon: "🇨🇲",
  Canada: "🇨🇦",
  China: "🇨🇳",
  'Czech Republic': "🇨🇿",
  Cyprus: "🇨🇾",
  Croatia: "🇭🇷",
  Denmark: "🇩🇰",
  Djibouti: "🇩🇯",
  Egypt: "🇪🇬",
  Estonia: "🇪🇪",
  Eswatini: "🇸🇿",
  Ethiopia: "🇪🇹",
  Finland: "🇫🇮",
  France: "🇫🇷",
  Gambia: "🇬🇲",
  Germany: "🇩🇪",
  Ghana: "🇬🇭",
  Greece: "🇬🇷",
  'Hong Kong': "🇭🇰",
  Hungary: "🇭🇺",
  Iceland: "🇮🇸",
  India: "🇮🇳",
  Indonesia: "🇮🇩",
  Iraq: "🇮🇶",
  Ireland: "🇮🇪",
  Israel: "🇮🇱",
  Italy: "🇮🇹",
  'Ivory Coast': "🇨🇮",
  Japan: "🇯🇵",
  Jordan: "🇯🇴",
  Kazakhstan: "🇰🇿",
  Kenya: "🇰🇪",
  Kuwait: "🇰🇼",
  Kyrgyzstan: "🇰🇬",
  Laos: "🇱🇦",
  Latvia: "🇱🇻",
  Lesotho: "🇱🇸",
  Liberia: "🇱🇷",
  Lithuania: "🇱🇹",
  Luxembourg: "🇱🇺",
  Macau: "🇲🇴",
  Malaysia: "🇲🇾",
  Mali: "🇲🇱",
  Malta: "🇲🇹",
  Morocco: "🇲🇦",
  Myanmar: "🇲🇲",
  Namibia: "🇳🇦",
  Nepal: "🇳🇵",
  Netherlands: "🇳🇱",
  'New Zealand': "🇳🇿",
  Niger: "🇳🇪",
  Nigeria: "🇳🇬",
  Norway: "🇳🇴",
  Pakistan: "🇵🇰",
  Philippines: "🇵🇭",
  Poland: "🇵🇱",
  Portugal: "🇵🇹",
  Qatar: "🇶🇦",
  Romania: "🇷🇴",
  Russia: "🇷🇺",
  Rwanda: "🇷🇼",
  'Saudi Arabia': "🇸🇦",
  Senegal: "🇸🇳",
  Singapore: "🇸🇬",
  Slovakia: "🇸🇰",
  Slovenia: "🇸🇮",
  Somalia: "🇸🇴",
  'South Africa': "🇿🇦",
  'South Korea': "🇰🇷",
  Spain: "🇪🇸",
  Sudan: "🇸🇩",
  'South Sudan': "🇸🇸",
  'Sri Lanka': "🇱🇰",
  Sweden: "🇸🇪",
  Switzerland: "🇨🇭",
  Tajikistan: "🇹🇯",
  Thailand: "🇹🇭",
  Togo: "🇹🇬",
  Tunisia: "🇹🇳",
  Turkey: "🇹🇷",
  Turkmenistan: "🇹🇲",
  Uganda: "🇺🇬",
  Ukraine: "🇺🇦",
  UK: "🇬🇧",
  'United Kingdom': "🇬🇧",
  'United States': "🇺🇸",
  Uzbekistan: "🇺🇿",
  Vietnam: "🇻🇳",
  Zambia: "🇿🇲",
  Zimbabwe: "🇿🇼",
};

const getFlag = (name) => {
  const base = name.split(' (')[0].trim();
  return COUNTRY_FLAGS[base] || COUNTRY_FLAGS[base.split(' ')[0]] || '🏳️';
};

const SIZE_PRESETS = [
  {
    id: '35x45',
    label: '35 x 45 mm',
    description: 'Most common global standard',
    countries: [
      'UK', 'Germany', 'France', 'Italy', 'Spain (passport often 30x40, visa 35x45)', 'Netherlands', 'Belgium', 'Austria', 'Switzerland', 'Portugal', 'Poland', 'Czech Republic', 'Slovakia', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Lithuania (some passports 40x60)', 'Latvia', 'Estonia', 'Finland', 'Sweden', 'Norway', 'Denmark', 'Iceland', 'Ireland', 'Greece (passport often 40x60)', 'Cyprus', 'Malta', 'Luxembourg',
      'Ghana', 'Nigeria', 'Kenya', 'Uganda (sometimes 51x51)', 'Rwanda', 'South Africa', 'Zimbabwe', 'Zambia', 'Botswana', 'Namibia', 'Lesotho', 'Eswatini', 'Senegal', 'Ivory Coast', 'Cameroon', 'Benin', 'Togo', 'Burkina Faso', 'Mali', 'Niger', 'Guinea', 'Sierra Leone', 'Liberia', 'Gambia', 'Morocco', 'Tunisia', 'Algeria', 'Egypt', 'Sudan', 'South Sudan',
      'Japan', 'South Korea', 'China (33x48 variant)', 'Indonesia', 'Malaysia', 'Singapore', 'Philippines', 'Thailand', 'Cambodia', 'Laos', 'Myanmar', 'Sri Lanka', 'Bangladesh', 'Nepal', 'Pakistan', 'Afghanistan', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan',
      'Australia', 'New Zealand',
    ],
  },
  {
    id: '2x2',
    label: '2 x 2 in (51 x 51 mm)',
    description: 'Square format - Americas and US aligned',
    countries: ['United States', 'Canada (50x70 official but 2x2 often accepted)', 'Uganda (some embassies)', 'Saudi Arabia', 'Jordan', 'Iraq', 'Kuwait', 'Qatar (some visas)', 'Bahrain'],
  },
  {
    id: '50x70',
    label: '50 x 70 mm',
    description: 'Canada passport and India print option',
    countries: ['Canada (passport only)', 'India (passport print option)'],
  },
  {
    id: '40x60',
    label: '40 x 60 mm',
    description: 'Eastern Europe and Southeast Asia variants',
    countries: ['Greece', 'Lithuania', 'Vietnam', 'Russia', 'Ukraine', 'Belarus'],
  },
  {
    id: '40x50',
    label: '40 x 50 mm',
    description: 'Hong Kong and Macau',
    countries: ['Hong Kong', 'Macau'],
  },
  {
    id: '30x40',
    label: '30 x 40 mm',
    description: 'Spain and some legacy systems',
    countries: ['Spain (passport)', 'Italy (legacy)', 'Ethiopia', 'Somalia'],
  },
  {
    id: '35x35',
    label: '35 x 35 mm',
    description: 'Square and smaller',
    countries: ['India (some passport offices)', 'Djibouti'],
  },
  {
    id: '33x48',
    label: '33 x 48 mm',
    description: 'China passport and visas',
    countries: ['China'],
  },
  {
    id: '45x45',
    label: '45 x 45 mm',
    description: 'Regional South America',
    countries: ['Argentina (some provincial systems)', 'Bolivia'],
  },
  {
    id: '50x60',
    label: '50 x 60 mm',
    description: 'Turkey and Turkmenistan',
    countries: ['Turkey', 'Turkmenistan'],
  },
];

const MULTISIZE_COUNTRIES = ['India', 'Uganda', 'Pakistan', 'Bangladesh', 'Nigeria'];

const normalizeCountry = (name = '') =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const COUNTRY_PRESET_MAP = (() => {
  const map = new Map();
  SIZE_PRESETS.forEach((preset) => {
    preset.countries.forEach((country) => {
      const key = normalizeCountry(country);
      if (key && !map.has(key)) map.set(key, preset.id);
    });
  });
  // Helpful aliases
  map.set('united states', '2x2');
  map.set('usa', '2x2');
  map.set('america', '2x2');
  map.set('canada', '2x2');
  map.set('united kingdom', '35x45');
  map.set('great britain', '35x45');
  map.set('england', '35x45');
  map.set('uk', '35x45');
  map.set('eu', '35x45');
  map.set('europe', '35x45');
  map.set('schengen', '35x45');
  return map;
})();

/**
 * MAIN APP COMPONENT
 */
export default function PassportApp() {
  // --- STATE ---
  const [view, setView] = useState('home'); // home, capture, editor, cart, checkout, success, dashboard, admin

  // Initialize state from LocalStorage if available to make it "functional" across reloads
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('qp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('qp_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('qp_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [sizePresetId, setSizePresetId] = useState('35x45');
  const [countryQuery, setCountryQuery] = useState('');
  const [lastOrderId, setLastOrderId] = useState(null);
  const [captureMode, setCaptureMode] = useState('camera'); // camera | upload

  // Editor State
  const [editSettings, setEditSettings] = useState({ zoom: 1, rotate: 0, brightness: 100, offsetX: 0, offsetY: 0 });
  const [processing, setProcessing] = useState(false);
  const [compliancePassed, setCompliancePassed] = useState(false);

  // --- EFFECTS (PERSISTENCE & LOGIC) ---
  useEffect(() => {
    localStorage.setItem('qp_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('qp_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart too large for localStorage (likely image data)');
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('qp_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Orders too large for localStorage');
    }
  }, [orders]);

  // Handle View Transitions (Fix for infinite loop in Editor)
  useEffect(() => {
    if (view === 'editor') {
      setProcessing(true);
      setCompliancePassed(false);
      // Reset settings when entering editor
      setEditSettings({ zoom: 1, rotate: 0, brightness: 100, offsetX: 0, offsetY: 0 });

      const timer = setTimeout(() => {
        setProcessing(false);
        setCompliancePassed(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // --- HELPERS ---
  const getDefaultPresetForService = (serviceId) => {
    switch (serviceId) {
      case 'us-passport':
        return '2x2';
      case 'uk-passport':
      case 'eu-visa':
        return '35x45';
      case 'jp-visa':
        return '45x45';
      default:
        return '35x45';
    }
  };

  const getPresetAspectRatio = (presetId) => {
    const preset = SIZE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return 3 / 4;
    const nums = preset.label.match(/[\d.]+/g);
    if (!nums || nums.length < 2) return 3 / 4;
    const w = parseFloat(nums[0]);
    const h = parseFloat(nums[1]);
    if (!w || !h) return 3 / 4;
    return w / h;
  };

  const getPresetPixels = (presetId) => {
    const preset = SIZE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return { width: 600, height: 800 };
    const nums = preset.label.match(/[\d.]+/g);
    if (!nums || nums.length < 2) return { width: 600, height: 800 };
    const w = parseFloat(nums[0]);
    const h = parseFloat(nums[1]);
    // Use 300 DPI; convert mm to inches where needed
    if (preset.label.includes('in')) {
      return { width: Math.round(w * 300), height: Math.round(h * 300) };
    }
    const mmToInch = (mm) => mm / 25.4;
    return { width: Math.round(mmToInch(w) * 300), height: Math.round(mmToInch(h) * 300) };
  };

  const handleServiceSelect = (service, targetView = 'capture', mode = 'camera') => {
    setSelectedService(service);
    setSizePresetId(service?.sizePresetId || getDefaultPresetForService(service?.id));
    setCaptureMode(mode);
    navigate(targetView);
  };

  const goToCapture = (mode = 'camera') => {
    setCaptureMode(mode);
    navigate('capture');
  };

  const navigate = (target) => {
    window.scrollTo(0, 0);
    setView(target);
  };

  const scrollToSection = (id) => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const generateProcessedImage = async () => {
    if (!currentPhoto) return null;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const { width: targetW, height: targetH } = getPresetPixels(sizePresetId || getDefaultPresetForService(selectedService?.id));
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = targetW;
        canvas.height = targetH;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);

        const baseScale = Math.max(targetW / img.width, targetH / img.height);
        const totalScale = baseScale * editSettings.zoom;

        ctx.save();
        ctx.translate(targetW / 2 + editSettings.offsetX, targetH / 2 + editSettings.offsetY);
        ctx.rotate((editSettings.rotate * Math.PI) / 180);
        ctx.scale(totalScale, totalScale);
        ctx.filter = `brightness(${editSettings.brightness}%)`;
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = currentPhoto;
    });
  };

  const handleAddToCart = async () => {
    if (!selectedService || !currentPhoto) {
      alert('Please capture or upload a photo first.');
      return;
    }

    // Apply the edits to the actual image data before adding to cart
    setProcessing(true);
    const processedPhoto = await generateProcessedImage();
    setProcessing(false);

    const presetLabel = SIZE_PRESETS.find((preset) => preset.id === sizePresetId)?.label || '35 x 45 mm';

    setCart([...cart, {
      ...selectedService,
      photo: processedPhoto,
      id: Date.now() + Math.random(), // unique ID for cart item
      sizePresetId,
      sizeLabel: presetLabel,
      countryHint: countryQuery || undefined,
    }]);
    navigate('cart');
  };

  const loginAsUser = () => {
    setUser({ name: 'Alex Doe', role: 'user', email: 'alex@example.com' });
    navigate('dashboard');
  };

  const loginAsAdmin = () => {
    setUser({ name: 'Admin User', role: 'admin', email: 'admin@quickpass.com' });
    navigate('admin');
  };

  const logout = () => {
    setUser(null);
    navigate('home');
  };

  const downloadImage = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFilename = (item, idx = 0) => {
    const cleaned = (item?.sizeLabel || 'photo')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'photo';
    return `${cleaned}-quickpass-${idx + 1}.jpg`;
  };

  // --- VIEWS ---
  const Header = () => (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
            <img src="/logo.png" alt="QuickPass" className="h-9 w-auto mr-2" />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('home')} className="text-slate-600 hover:text-blue-600 font-medium">Home</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-slate-600 hover:text-blue-600 font-medium">How it Works</button>
            <button onClick={() => scrollToSection('services')} className="text-slate-600 hover:text-blue-600 font-medium">Pricing</button>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('cart')} className="relative p-2 text-slate-600 hover:text-blue-600">
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-slate-700 font-medium">
                  <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border hidden group-hover:block">
                  <button onClick={() => navigate(user.role === 'admin' ? 'admin' : 'dashboard')} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left">Dashboard</button>
                  <button onClick={logout} className="block px-4 py-2 text-sm text-red-600 hover:bg-slate-100 w-full text-left">Sign out</button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button onClick={loginAsUser} className="text-sm font-medium text-slate-600 hover:text-slate-900">Log in</button>
                <button onClick={() => navigate('home')} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700">Get Started</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const HomeView = () => (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-center lg:text-left lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Perfect Passport Photos <br />
              <span className="text-blue-400">in Seconds.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl">
              AI-powered background removal, automatic compliance checks for 100+ countries, and instant digital delivery. No lines, no hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => handleServiceSelect(SERVICES[0], 'capture', 'camera')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center shadow-lg transition-all transform hover:scale-105"
              >
                <Camera className="mr-2 h-5 w-5" /> Take Photo Now
              </button>
              <button
                onClick={() => handleServiceSelect(SERVICES[0], 'capture', 'upload', true)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center border border-slate-700 transition-all"
              >
                <Upload className="mr-2 h-5 w-5" /> Upload Image
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-slate-400">
              <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1 text-green-400" /> ICAO Compliant</span>
              <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1 text-green-400" /> Instant Download</span>
              <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1 text-green-400" /> Money-back Guarantee</span>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
            {/* Abstract visual representation of the app */}
            <div className="relative mx-auto w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 transform rotate-2 hover:rotate-0 transition-all duration-500">
              <div className="aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=500" alt="Demo" className="object-cover w-full h-full opacity-90" />
                </div>
                {/* Overlay UI elements */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg flex items-center justify-between">
                  <div className="flex items-center text-green-600 font-bold text-sm">
                    <CheckCircle className="h-4 w-4 mr-2" /> Compliant
                  </div>
                  <div className="text-xs text-slate-500">US Dept. of State</div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">2 x 2"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-slate-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Choose Your Document Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              (() => {
                const preset = SIZE_PRESETS.find((p) => p.id === (service.sizePresetId || getDefaultPresetForService(service.id))) || SIZE_PRESETS[0];
                return (
                  <div key={service.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100 flex flex-col">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{service.name}</h3>
                    <p className="text-slate-500 text-sm mb-3">{service.desc}</p>
                    <div className="mb-4">
                      <div className="text-xs font-bold text-slate-700 uppercase mb-2">{preset.label} Countries</div>
                      <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                        {preset.countries.map((country) => (
                          <span key={country} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-full border border-slate-200">
                            {getFlag(country)} {country}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 gap-2">
                      <span className="text-lg font-bold text-slate-900">${service.price}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleServiceSelect(service, 'capture', 'camera')}
                          className="text-blue-600 font-semibold hover:text-blue-800 text-sm flex items-center"
                        >
                          Take <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                        <button
                          onClick={() => handleServiceSelect(service, 'capture', 'upload', true)}
                          className="text-slate-600 font-semibold hover:text-slate-900 text-sm flex items-center"
                        >
                          Upload <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()
            ))}
          </div>
        </div>
      </section>

      {/* Pricing by Size */}
      <section id="pricing" className="py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Global Pricing by Size</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SIZE_PRESETS.map((preset) => (
              <div key={preset.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{preset.label}</h3>
                  <span className="text-xs text-slate-500">From $12.99</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{preset.description}</p>
                <div className="text-xs font-bold text-slate-700 uppercase mb-2">Countries</div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto mb-4">
                  {preset.countries.map((country) => (
                    <span key={country} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-full border border-slate-200">
                      {getFlag(country)} {country}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleServiceSelect({ ...SERVICES[0], sizePresetId: preset.id }, 'capture', 'camera')}
                  className="mt-auto inline-flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Start with {preset.label}
                </button>
                <button
                  onClick={() => handleServiceSelect({ ...SERVICES[0], sizePresetId: preset.id }, 'capture', 'upload')}
                  className="mt-2 inline-flex items-center justify-center px-4 py-3 rounded-lg bg-white text-blue-700 border border-blue-200 text-sm font-semibold hover:bg-blue-50"
                >
                  Upload for {preset.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-4 text-slate-500">Professional results in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Camera, title: '1. Snap or Upload', desc: 'Use our webcam tool or upload an existing photo from your phone.' },
              { icon: Settings, title: '2. Auto-Edit', desc: 'Our AI removes the background and crops it to official specs.' },
              { icon: Download, title: '3. Download', desc: 'Get your compliant photo instantly via email or download.' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-500 max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Login Trigger (Hidden-ish) */}
      <div className="bg-slate-900 py-4 text-center">
        <button onClick={loginAsAdmin} className="text-slate-700 text-xs hover:text-white transition-colors">Admin Portal Access</button>
      </div>
    </div>
  );
  const CaptureView = () => {
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const streamRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState('');

    const startCamera = async () => {
      if (cameraActive || stream) return;
      try {
        setCameraError('');
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
      } catch (err) {
        console.error('Camera permission issue', err);
        setCameraError('Could not access camera. Please upload a photo instead.');
        alert('Could not access camera. Please upload a photo instead.');
      }
    };

    const stopCamera = () => {
      const activeStream = streamRef.current || stream;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
      setStream(null);
      setCameraReady(false);
      setCameraActive(false);
    };

    const capturePhoto = () => {
      if (!videoRef.current || !cameraReady) {
        alert('Camera is not ready yet. Wait for the live preview.');
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCurrentPhoto(dataUrl);
      stopCamera();
      navigate('editor');
    };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!selectedService) setSelectedService(SERVICES[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentPhoto(reader.result);
        setSizePresetId((prev) => prev || getDefaultPresetForService(selectedService?.id));
        setCaptureMode('upload');
        stopCamera();
        navigate('editor');
      };
      reader.readAsDataURL(file);
    }
    // Allow selecting the same file again
    if (e.target) e.target.value = '';
  };

    useEffect(() => {
      if (stream && videoRef.current) {
        const videoEl = videoRef.current;
        const handleLoaded = () => {
          videoEl.play().catch(() => {});
          setCameraReady(true);
        };
        videoEl.srcObject = stream;
        videoEl.addEventListener('loadedmetadata', handleLoaded);
        return () => videoEl.removeEventListener('loadedmetadata', handleLoaded);
      }
      return undefined;
    }, [stream]);

    useEffect(() => {
      if (captureMode === 'camera') {
        startCamera();
      } else {
        stopCamera();
      }
      return () => stopCamera();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [captureMode]);

    const switchToCamera = () => {
      setCaptureMode('camera');
    };
    const switchToUpload = () => {
      setCaptureMode('upload');
    };

    return (
      <div className="min-h-screen bg-slate-50 pt-8 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <button onClick={() => navigate('home')} className="text-slate-500 hover:text-slate-900 flex items-center">
              {"<- Back"}
            </button>
            <h2 className="text-xl font-bold text-slate-900">
              {selectedService ? selectedService.name : 'Take Photo'}
            </h2>
            <div className="w-10"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
            {/* Guide Overlay */}
            <div className="absolute top-4 right-4 z-20 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              Keep head straight
            </div>

            {captureMode === 'camera' && cameraActive ? (
              <div className="relative bg-black aspect-[3/4] flex items-center justify-center overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                {!cameraReady && (
                  <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                    Starting camera...
                  </div>
                )}
                {/* Face Guide Overlay */}
                <div className="absolute inset-0 pointer-events-none border-[3px] border-white/30 rounded-[50%] w-[60%] h-[70%] top-[15%] left-[20%]"></div>
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
                  <button onClick={capturePhoto} className="h-16 w-16 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center hover:scale-105 transition-transform">
                    <div className="h-12 w-12 bg-red-500 rounded-full"></div>
                  </button>
                </div>
                <div className="absolute top-4 left-4 z-20">
                  <button onClick={switchToUpload} className="text-xs bg-white/80 text-slate-800 px-3 py-1 rounded-full hover:bg-white">
                    Upload instead
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-[3/4] bg-slate-100 flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-slate-300 m-4 rounded-xl">
                <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                  <Camera className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Capture or Upload</h3>
                <p className="text-slate-500 mb-8 max-w-sm">
                  We'll automatically remove the background and crop it to compliance standards.
                </p>
                <div className="flex flex-col gap-4 w-full max-w-xs">
                  <button onClick={() => { switchToCamera(); startCamera(); }} className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Camera className="mr-2 h-5 w-5" /> Open Camera
                  </button>
                  <button onClick={() => { switchToUpload(); fileInputRef.current?.click(); }} className="bg-white text-slate-700 border border-slate-300 w-full py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center">
                    <Upload className="mr-2 h-5 w-5" /> Upload File
                  </button>
                  <button onClick={switchToCamera} className="text-sm text-blue-600 hover:text-blue-800 underline">
                    Switch to live camera
                  </button>
                </div>
                {cameraError ? <p className="text-xs text-red-600 mt-4">{cameraError}</p> : null}
              </div>
            )}
          </div>

          {/* Hidden upload input stays mounted for both modes */}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

          <div className="mt-8 bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>Tip:</strong> Stand against any wall. Make sure your face is evenly lit with no shadows. Do not wear glasses or hats.
            </div>
          </div>
        </div>
      </div>
    );
  };
  const EditorView = () => {
    const countryInputRef = useRef(null);
    const updateSetting = (key, val) => {
      setEditSettings((prev) => ({ ...prev, [key]: val }));
    };
    const updateSettingLive = (key) => (e) => {
      const raw = e.target.value;
    const parsed = key === 'zoom' ? parseFloat(raw) : parseInt(raw, 10);
    updateSetting(key, parsed);
  };
  const selectedPreset = SIZE_PRESETS.find((preset) => preset.id === sizePresetId) || SIZE_PRESETS[0];
  const normalizedQuery = normalizeCountry(countryQuery);
  const matchedPresetId = normalizedQuery ? COUNTRY_PRESET_MAP.get(normalizedQuery) : null;
  const matchingPreset = matchedPresetId
    ? SIZE_PRESETS.find((preset) => preset.id === matchedPresetId)
    : null;
  const matchedCountry = normalizedQuery && matchingPreset
    ? matchingPreset.countries.find((c) => normalizeCountry(c) === normalizedQuery) || matchingPreset.countries[0]
    : null;
  const matchedFlag = matchedCountry ? getFlag(matchedCountry) : '';

  useEffect(() => {
    if (matchingPreset && matchingPreset.id !== sizePresetId) {
      setSizePresetId(matchingPreset.id);
    }
  }, [matchingPreset, sizePresetId]);

    return (
      <div className="min-h-screen bg-slate-50 pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-8">

          {/* Main Preview */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Edit Photo</h2>
            </div>
            <div
              className="bg-white rounded-2xl shadow-lg p-2 overflow-hidden relative flex items-center justify-center"
              style={{ aspectRatio: getPresetAspectRatio(sizePresetId || getDefaultPresetForService(selectedService?.id)) }}
            >
              {processing ? (
                <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center text-center p-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <h3 className="font-bold text-lg text-slate-800">Analyzing Photo...</h3>
                  <p className="text-slate-500 text-sm">Removing background & checking biometrics</p>
                </div>
              ) : null}

              {/* The Image Canvas Area */}
              <div className="relative overflow-hidden w-full h-full bg-slate-100 rounded-xl group">
                <div
                  className="w-full h-full bg-cover bg-center transition-all duration-200"
                  style={{
                    backgroundImage: `url(${currentPhoto})`,
                    transform: `translate(${editSettings.offsetX}px, ${editSettings.offsetY}px) scale(${editSettings.zoom}) rotate(${editSettings.rotate}deg)`,
                    filter: `brightness(${editSettings.brightness}%)`,
                  }}
                />

                {/* Compliance Overlay (Always on top) */}
                <div className="absolute inset-0 pointer-events-none z-10 opacity-40 border-[3px] border-green-500/50 rounded-[50%] w-[60%] h-[70%] top-[15%] left-[20%]"></div>

                {/* Grid Lines */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500/30"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-500/30"></div>
              </div>
            </div>

            {/* Compliance Status */}
            {!processing && (
              <div className={`mt-4 p-4 rounded-xl flex items-center space-x-4 ${compliancePassed ? 'bg-green-50 border border-green-100' : 'bg-red-50'}`}>
                {compliancePassed ? (
                  <>
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-800">Compliance Passed</h4>
                      <p className="text-sm text-green-700">Meets ICAO & {selectedService?.name} standards.</p>
                    </div>
                  </>
                ) : (
                  <div className="text-red-600">Needs Adjustment</div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col space-y-6 md:pt-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6">Fine Tune</h3>

              {/* Zoom */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center"><ZoomIn className="h-4 w-4 mr-2" /> Zoom</label>
                  <span className="text-xs text-slate-500">{Math.round(editSettings.zoom * 100)}%</span>
                </div>
                <input
                  type="range" min="1" max="2" step="0.1"
                  value={editSettings.zoom}
                  onChange={updateSettingLive('zoom')}
                  onInput={updateSettingLive('zoom')}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Rotate */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center"><RotateCw className="h-4 w-4 mr-2" /> Rotate</label>
                  <span className="text-xs text-slate-500">{editSettings.rotate}deg</span>
                </div>
                <input
                  type="range" min="-45" max="45" step="1"
                  value={editSettings.rotate}
                  onChange={updateSettingLive('rotate')}
                  onInput={updateSettingLive('rotate')}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Brightness */}
              <div className="mb-2">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center"><Sun className="h-4 w-4 mr-2" /> Brightness</label>
                  <span className="text-xs text-slate-500">{editSettings.brightness}%</span>
                </div>
                <input
                  type="range" min="50" max="150" step="5"
                  value={editSettings.brightness}
                  onChange={updateSettingLive('brightness')}
                  onInput={updateSettingLive('brightness')}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Horizontal shift */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">Shift X</label>
                  <span className="text-xs text-slate-500">{editSettings.offsetX}px</span>
                </div>
                <input
                  type="range" min="-200" max="200" step="1"
                  value={editSettings.offsetX}
                  onChange={updateSettingLive('offsetX')}
                  onInput={updateSettingLive('offsetX')}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Vertical shift */}
              <div className="mb-2">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">Shift Y</label>
                  <span className="text-xs text-slate-500">{editSettings.offsetY}px</span>
                </div>
                <input
                  type="range" min="-200" max="200" step="1"
                  value={editSettings.offsetY}
                  onChange={updateSettingLive('offsetY')}
                  onInput={updateSettingLive('offsetY')}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Country preset</h3>
                  <p className="text-sm text-slate-500">Pick the official passport size after you capture.</p>
                </div>
                <span className="text-[11px] text-slate-500">ICAO sizing</span>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Country (auto finds size)</label>
                <input
                  ref={countryInputRef}
                  value={countryQuery}
                  onChange={(e) => {
                    setCountryQuery(e.target.value);
                    requestAnimationFrame(() => countryInputRef.current?.focus());
                  }}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Type a country, e.g. Spain"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {countryQuery ? (
                  <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
                    <span>
                      {matchingPreset
                        ? `${matchedFlag ? `${matchedFlag} ` : ''}${countryQuery.trim()} uses ${matchingPreset.label}`
                        : 'No preset found. Pick a size below.'}
                    </span>
                    {matchingPreset && matchingPreset.id !== sizePresetId ? (
                      <button
                        onClick={() => setSizePresetId(matchingPreset.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Apply
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Size preset</label>
                <select
                  value={sizePresetId}
                  onChange={(e) => setSizePresetId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {SIZE_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label} — {preset.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 uppercase mb-2">Countries on this size</div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {selectedPreset?.countries.map((country) => (
                    <span key={country} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full border border-slate-200">
                      {getFlag(country)} {country}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Multi-size allowances:{' '}
                  {MULTISIZE_COUNTRIES.map((c) => `${getFlag(c)} ${c}`).join(', ')} (check embassy rules).
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full py-4 rounded-xl font-bold shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center"
              >
                {processing ? 'Processing...' : 'Approve & Add to Cart'}
              </button>
              <button onClick={() => goToCapture('camera')} className="text-slate-600 font-medium py-3 hover:text-slate-900">
                Retake Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const CartView = () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart</h2>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <ShoppingCart className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 mb-4">Your cart is empty</p>
              <button onClick={() => navigate('home')} className="text-blue-600 font-bold hover:underline">Start New Photo</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                    <div className="h-20 w-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                      <img src={item.photo} alt="Passport" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-500">{item.type}</p>
                      {item.sizeLabel ? (
                        <p className="text-xs text-slate-500 mt-1">Preset: {item.sizeLabel}</p>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">${item.price}</p>
                      <button
                        onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                        className="text-xs text-red-500 hover:text-red-700 mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                  <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                  <div className="flex justify-between mb-2 text-slate-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-slate-600">
                    <span>Processing Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-lg text-slate-900 mb-6">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button onClick={() => navigate('checkout')} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-md">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  const CheckoutView = () => {
    const [loading, setLoading] = useState(false);

    const handlePay = (e) => {
      e.preventDefault();
      setLoading(true);

      const newOrderId = `ORD-${Math.floor(Math.random() * 10000)}`;
      const orderItems = [...cart];
      const newOrder = {
        id: newOrderId,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        total: cart.reduce((sum, item) => sum + item.price, 0),
        items: orderItems, // Save the items (including the photos)
        service: cart[0]?.name + (cart.length > 1 ? ` + ${cart.length - 1} more` : ''),
      };

      // Simulate Payment Processing
      setTimeout(() => {
        setOrders((prev) => [newOrder, ...prev]);
        setLastOrderId(newOrderId);
        orderItems.forEach((item, idx) => {
          if (item?.photo) downloadImage(item.photo, formatFilename(item, idx));
        });
        setLoading(false);
        setCart([]); // Clear cart
        navigate('success');
      }, 2000);
    };

    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="mb-6">
            <button onClick={() => navigate('cart')} className="text-sm text-slate-500 hover:text-slate-900">{"<- Back to Cart"}</button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <CreditCard className="mr-3 h-5 w-5 text-blue-600" /> Secure Checkout
              </h2>
            </div>

            <form onSubmit={handlePay} className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Contact Info</h3>
                <input type="email" placeholder="Email Address" required className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue={user?.email || 'test@quickpass.com'} />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Payment Details</h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 flex items-center justify-between">
                  <span className="font-medium text-slate-700">Total Due</span>
                  <span className="font-bold text-xl text-slate-900">
                    ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </span>
                </div>
                <input type="text" placeholder="Card Number" required className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM / YY" required className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="12/34" />
                  <input type="text" placeholder="CVC" required className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="123" />
                </div>
              </div>

              <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center">
                {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div> : null}
                {loading ? 'Processing...' : 'Pay & Download'}
              </button>

              <p className="text-xs text-center text-slate-400 flex items-center justify-center">
                <span className="mr-1">LOCK</span> 256-bit SSL Secure Payment
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  };
  const SuccessView = () => {
    const recentOrder = orders.find((o) => o.id === lastOrderId) || orders[0];

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
          <p className="text-slate-500 mb-8">Your compliant photos are ready for download.</p>

          {recentOrder && recentOrder.items.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600 font-medium">{item.name}</span>
                {item.sizeLabel ? <span className="text-slate-500">Size: {item.sizeLabel}</span> : null}
              </div>
              <button
                onClick={() => downloadImage(item.photo, formatFilename(item, idx))}
                className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-2 rounded-lg text-sm flex items-center justify-center hover:bg-slate-50"
              >
                <Download className="h-4 w-4 mr-2" /> Download JPG
              </button>
            </div>
          ))}

          <button onClick={() => navigate('home')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
            Back to Home
          </button>
        </div>
      </div>
    );
  };
  const DashboardView = () => (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto flex items-center space-x-4">
          <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-blue-200">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
          <LayoutDashboard className="mr-2 h-5 w-5" /> Recent Orders
        </h2>
        {orders.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl text-slate-500">No orders found.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                    <td className="px-6 py-4 text-slate-600">{order.service}</td>
                    <td className="px-6 py-4 text-slate-600">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          // Download first item of order for simplicity in list view
                          if (order.items && order.items[0]) {
                            downloadImage(order.items[0].photo, formatFilename(order.items[0], 0));
                          }
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
  const AdminView = () => (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-slate-300 min-h-screen hidden lg:block p-4">
          <div className="font-bold text-white text-xl mb-8 flex items-center"><Settings className="mr-2" /> Admin Panel</div>
          <div className="space-y-2">
            <div className="bg-blue-900 text-white p-3 rounded-lg cursor-pointer">Queue</div>
            <div className="hover:bg-slate-800 p-3 rounded-lg cursor-pointer">Orders</div>
            <div className="hover:bg-slate-800 p-3 rounded-lg cursor-pointer">Templates</div>
            <div className="hover:bg-slate-800 p-3 rounded-lg cursor-pointer">Analytics</div>
          </div>
        </div>

        {/* Main Admin Content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Photo Review Queue</h1>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm font-medium">Pending: 3</div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm mb-1">Total Sales Today</div>
              <div className="text-3xl font-bold text-slate-900">$452.00</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm mb-1">Approved Photos</div>
              <div className="text-3xl font-bold text-green-600">88%</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm mb-1">Avg Process Time</div>
              <div className="text-3xl font-bold text-blue-600">1.2m</div>
            </div>
          </div>

          {/* Review Item */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start gap-6">
              <div className="h-48 w-48 bg-slate-200 rounded-lg flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" alt="Review" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #9921 - UK Passport</h3>
                    <p className="text-slate-500 text-sm">Submitted 2 mins ago by Guest</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100">Reject</button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Approve</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="block text-slate-500 text-xs">Head Size</span>
                    <span className="font-mono text-green-600">PASS (32mm)</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="block text-slate-500 text-xs">Background</span>
                    <span className="font-mono text-green-600">PASS (Grey)</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="block text-slate-500 text-xs">Expression</span>
                    <span className="font-mono text-yellow-600">WARN (Smile?)</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="block text-slate-500 text-xs">Lighting</span>
                    <span className="font-mono text-green-600">PASS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-slate-900 bg-white">
      {view !== 'admin' && <Header />}

      <main>
        {view === 'home' && <HomeView />}
        {view === 'capture' && <CaptureView />}
        {view === 'editor' && <EditorView />}
        {view === 'cart' && <CartView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'success' && <SuccessView />}
        {view === 'dashboard' && <DashboardView />}
        {view === 'admin' && <AdminView />}
      </main>

      {/* Footer */}
      {view !== 'admin' && view !== 'capture' && view !== 'editor' && (
        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center text-white font-bold text-xl mb-4">
                <img src="/logo%20white.png" alt="QuickPass" className="h-10 w-auto mr-2" />
              </div>
              <p className="text-sm">Trusted by 50,000+ travelers for compliant passport and visa photos.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleServiceSelect(SERVICES[0], 'capture', 'camera')} className="hover:text-white">US Passport Photo</button></li>
                <li><button onClick={() => handleServiceSelect(SERVICES[2], 'capture', 'camera')} className="hover:text-white">Schengen Visa</button></li>
                <li><button onClick={() => handleServiceSelect(SERVICES[1], 'capture', 'camera')} className="hover:text-white">UK Passport</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white">All Sizes & Prices</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white">How it Works</button></li>
                <li><button onClick={() => goToCapture('camera')} className="hover:text-white">Take Photo</button></li>
                <li><button onClick={() => goToCapture('upload', true)} className="hover:text-white">Upload Photo</button></li>
                <li><button onClick={() => navigate('dashboard')} className="hover:text-white">Track Order</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white" onClick={() => alert('Privacy Policy coming soon.')}>Privacy Policy</button></li>
                <li><button className="hover:text-white" onClick={() => alert('Terms of Service coming soon.')}>Terms of Service</button></li>
              </ul>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}


