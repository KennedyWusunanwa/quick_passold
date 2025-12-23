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
  { id: 'us-passport', name: 'US Passport Photo', price: 14.99, type: 'Digital + Print', desc: '2x2 inches, White Background' },
  { id: 'uk-passport', name: 'UK Passport Photo', price: 12.99, type: 'Digital Code', desc: '35x45mm, Light Grey Background' },
  { id: 'eu-visa', name: 'Schengen Visa', price: 12.99, type: 'Digital', desc: '35x45mm, White Background' },
  { id: 'jp-visa', name: 'Japan Visa', price: 14.99, type: 'Digital', desc: '45x45mm, White Background' },
];

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
  const [lastOrderId, setLastOrderId] = useState(null);

  // Editor State
  const [editSettings, setEditSettings] = useState({ zoom: 1, rotate: 0, brightness: 100 });
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
      setEditSettings({ zoom: 1, rotate: 0, brightness: 100 });

      const timer = setTimeout(() => {
        setProcessing(false);
        setCompliancePassed(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // --- HELPERS ---
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
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas to original image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Fill background white (standard for passports) just in case
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Center point
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Apply transformations
        ctx.translate(cx, cy);
        ctx.rotate((editSettings.rotate * Math.PI) / 180);
        ctx.scale(editSettings.zoom, editSettings.zoom);
        ctx.translate(-cx, -cy);

        // Apply Brightness via filter
        ctx.filter = `brightness(${editSettings.brightness}%)`;

        // Draw image
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = currentPhoto;
    });
  };

  const handleAddToCart = async () => {
    if (!selectedService) return;

    // Apply the edits to the actual image data before adding to cart
    setProcessing(true);
    const processedPhoto = await generateProcessedImage();
    setProcessing(false);

    setCart([...cart, {
      ...selectedService,
      photo: processedPhoto,
      id: Date.now() + Math.random(), // unique ID for cart item
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

  // --- VIEWS ---
  const Header = () => (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
              <Camera className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">QuickPass</span>
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
                onClick={() => { setSelectedService(SERVICES[0]); navigate('capture'); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center shadow-lg transition-all transform hover:scale-105"
              >
                <Camera className="mr-2 h-5 w-5" /> Take Photo Now
              </button>
              <button
                onClick={() => { setSelectedService(SERVICES[0]); navigate('capture'); }}
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
              <div key={service.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100 flex flex-col">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">{service.desc}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <span className="text-lg font-bold text-slate-900">${service.price}</span>
                  <button
                    onClick={() => { setSelectedService(service); navigate('capture'); }}
                    className="text-blue-600 font-medium hover:text-blue-800 text-sm flex items-center"
                  >
                    Select <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
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
    const [stream, setStream] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setCameraActive(true);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        alert('Could not access camera. Please upload a photo instead.');
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setCameraActive(false);
      }
    };

    const capturePhoto = () => {
      if (!videoRef.current) return;
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
        const reader = new FileReader();
        reader.onloadend = () => {
          setCurrentPhoto(reader.result);
          navigate('editor');
        };
        reader.readAsDataURL(file);
      }
    };

    useEffect(() => () => stopCamera(), []);

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

            {cameraActive ? (
              <div className="relative bg-black aspect-[3/4] flex items-center justify-center overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                {/* Face Guide Overlay */}
                <div className="absolute inset-0 pointer-events-none border-[3px] border-white/30 rounded-[50%] w-[60%] h-[70%] top-[15%] left-[20%]"></div>
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
                  <button onClick={capturePhoto} className="h-16 w-16 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center hover:scale-105 transition-transform">
                    <div className="h-12 w-12 bg-red-500 rounded-full"></div>
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
                  <button onClick={startCamera} className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Camera className="mr-2 h-5 w-5" /> Open Camera
                  </button>
                  <button onClick={() => fileInputRef.current.click()} className="bg-white text-slate-700 border border-slate-300 w-full py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center">
                    <Upload className="mr-2 h-5 w-5" /> Upload File
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>
            )}
          </div>

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
    const updateSetting = (key, val) => {
      setEditSettings((prev) => ({ ...prev, [key]: val }));
    };

    return (
      <div className="min-h-screen bg-slate-50 pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-8">

          {/* Main Preview */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Edit Photo</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-2 overflow-hidden relative aspect-[3/4] flex items-center justify-center">
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
                    transform: `scale(${editSettings.zoom}) rotate(${editSettings.rotate}deg)`,
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
                  onChange={(e) => updateSetting('zoom', parseFloat(e.target.value))}
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
                  onChange={(e) => updateSetting('rotate', parseInt(e.target.value, 10))}
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
                  onChange={(e) => updateSetting('brightness', parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
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
              <button onClick={() => navigate('capture')} className="text-slate-600 font-medium py-3 hover:text-slate-900">
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
      const newOrder = {
        id: newOrderId,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        total: cart.reduce((sum, item) => sum + item.price, 0),
        items: [...cart], // Save the items (including the photos)
        service: cart[0]?.name + (cart.length > 1 ? ` + ${cart.length - 1} more` : ''),
      };

      // Simulate Payment Processing
      setTimeout(() => {
        setOrders((prev) => [newOrder, ...prev]);
        setLastOrderId(newOrderId);
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
                <input type="email" placeholder="Email Address" required className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue={user?.email} />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Payment Details</h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 flex items-center justify-between">
                  <span className="font-medium text-slate-700">Total Due</span>
                  <span className="font-bold text-xl text-slate-900">
                    ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </span>
                </div>
                <input type="text" placeholder="Card Number" required className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM / YY" required className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  <input type="text" placeholder="CVC" required className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
              </div>
              <button
                onClick={() => downloadImage(item.photo, `passport-photo-${idx}.jpg`)}
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
                            downloadImage(order.items[0].photo, `order-${order.id}.jpg`);
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
                <Camera className="mr-2 h-6 w-6 text-blue-500" /> QuickPass
              </div>
              <p className="text-sm">Trusted by 50,000+ travelers for compliant passport and visa photos.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>US Passport Photos</li>
                <li>Schengen Visa</li>
                <li>UK Passport</li>
                <li>Digital Codes</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>Help Center</li>
                <li>Photo Guidelines</li>
                <li>Track Order</li>
                <li>Refund Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
