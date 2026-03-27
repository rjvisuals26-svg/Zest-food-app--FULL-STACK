import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Easing, Image, KeyboardAvoidingView, LayoutAnimation, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

export default function App() {
  // 1. APP NAVIGATION STATES
  const [screen, setScreen] = useState('welcome'); 
  
  // 2. AUTH STATES
  const [authMode, setAuthMode] = useState('login'); 
  const [authLoading, setAuthLoading] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);

  // 3. CART, FAVORITES & SEARCH
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [zestPoints, setZestPoints] = useState(1250); 
  
  // 4. CHECKOUT STATES
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState('address'); 
  const [walletType, setWalletType] = useState(''); 
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [activeOrder, setActiveOrder] = useState(null); // NEW: Active Order Tracker

  // 5. MODAL STATES
  const [showAssistance, setShowAssistance] = useState(false);
  const [assistanceStep, setAssistanceStep] = useState('options');

  const [showResModal, setShowResModal] = useState(false);
  const [resForm, setResForm] = useState({ name: '', phone: '', guests: '' });
  const [reservation, setReservation] = useState({ status: 'none', timeLeft: 0, details: null });
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState('input'); 
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);

  const [showQRModal, setShowQRModal] = useState(false);
  const [qrStep, setQrStep] = useState('scanning'); 
  const [scannedTable, setScannedTable] = useState(null);

  // 6. AI CHAT STATES 🤖
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const chatScrollRef = useRef();
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Welcome to ZEST! ✨ I am your personal AI Concierge. What are you craving today?", sender: 'ai' }
  ]);

  // --- ANIMATIONS ---
  const splashFadeAnim = useRef(new Animated.Value(0)).current;
  const splashSlideAnim = useRef(new Animated.Value(30)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cartScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (screen === 'welcome' || screen === 'auth') {
      Animated.parallel([
        Animated.timing(splashFadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(splashSlideAnim, { toValue: 0, duration: 1000, easing: Easing.out(Easing.ease), useNativeDriver: true })
      ]).start();
    }
  }, [screen]);

  useEffect(() => {
    if (showQRModal && qrStep === 'scanning') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, { toValue: 220, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(scanLineAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
        ])
      ).start();
    }
  }, [showQRModal, qrStep]);

  // --- DATA ---
  const categories = [
    { id: 'All', name: 'All', icon: 'silverware' },
    { id: 'Burger', name: 'Burger', icon: 'hamburger' },
    { id: 'Pizza', name: 'Pizza', icon: 'pizza' },
    { id: 'Pasta', name: 'Pasta', icon: 'noodles' },
    { id: 'Drinks', name: 'Drinks', icon: 'glass-cocktail' },
    { id: 'Dessert', name: 'Dessert', icon: 'cupcake' },
  ];

  const menuData = [
    { id: 1, category: 'Drinks', name: 'Artisan Matka Chai', price: 150, image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=400' },
    { id: 2, category: 'Drinks', name: 'Saffron Karak Tea', price: 250, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400' }, 
    { id: 3, category: 'Burger', name: 'Wagyu Beef Slider', price: 850, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400' },
    { id: 4, category: 'Burger', name: 'Crispy Zinger', price: 550, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400' },
    { id: 5, category: 'Pizza', name: 'Woodfire Pepperoni', price: 1200, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400' },
    { id: 6, category: 'Pizza', name: 'Margherita Slice', price: 450, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400' },
    { id: 7, category: 'Pasta', name: 'Truffle Mushroom Pasta', price: 950, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=400' }, 
    { id: 8, category: 'Pasta', name: 'Spicy Arrabbiata', price: 800, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=400' },
    { id: 9, category: 'Dessert', name: 'Lotus Cheesecake', price: 600, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=400' },
    { id: 10, category: 'Dessert', name: 'Molten Lava Cake', price: 700, image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=400' },
  ];

  const filteredMenu = menuData.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const favoriteItems = menuData.filter(item => favorites.includes(item.id));

  const orderHistory = [
    { id: '#1094', date: 'Yesterday', total: 1450, status: 'Delivered', items: 'Wagyu Beef Slider, Lotus Cheesecake' },
    { id: '#1082', date: 'Oct 12, 2025', total: 950, status: 'Delivered', items: 'Truffle Mushroom Pasta' },
    { id: '#1041', date: 'Sep 28, 2025', total: 1200, status: 'Delivered', items: 'Woodfire Pepperoni Pizza' }
  ];

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = cart.length > 0 ? 150 : 0;
  const totalPrice = subtotal + deliveryFee;
  const rewardsEarned = Math.floor(totalPrice * 0.05);

  // --- LOGIC FUNCTIONS ---
  
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const newMsg = { id: Date.now(), text: chatInput, sender: 'user' };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsAITyping(true);
    setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);

    setTimeout(() => {
      let response = "That sounds amazing! Would you like me to recommend a perfect pairing from our menu?";
      const lowerInput = newMsg.text.toLowerCase();
      
      if (lowerInput.includes('burger') || lowerInput.includes('beef') || lowerInput.includes('hungry')) {
         response = "Our Wagyu Beef Slider is an absolute masterpiece! Should I add one to your cart? 🍔";
      } else if (lowerInput.includes('sweet') || lowerInput.includes('dessert') || lowerInput.includes('cake')) {
         response = "You have to try the Lotus Cheesecake! It is incredibly rich and a huge fan favorite. 🍰";
      } else if (lowerInput.includes('drink') || lowerInput.includes('tea')) {
         response = "Our Saffron Karak Tea is the perfect warm beverage for tonight. 🫖";
      }
      setChatMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'ai' }]);
      setIsAITyping(false);
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
  };

  const handleAuthAction = () => {
    if (authMode === 'signup' && (!authName || !authEmail || !authPassword)) {
      return Alert.alert("Missing Information", "Please fill in your name, email, and password.");
    }
    if (authMode === 'login' && (!authEmail || !authPassword)) {
      return Alert.alert("Missing Information", "Please enter your email and password.");
    }
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setScreen('home');
    }, 1500); 
  };

  const handleSaveProfile = () => {
    Alert.alert("Profile Updated", "Your changes have been saved successfully.");
    setShowEditProfile(false);
  };

  const handleCategoryChange = (catId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCategory(catId);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
    cartScaleAnim.setValue(1.3);
    Animated.spring(cartScaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const removeFromCart = (indexToRemove) => setCart(prevCart => prevCart.filter((_, index) => index !== indexToRemove));

  const toggleFavorite = (itemId) => {
    if (favorites.includes(itemId)) {
      setFavorites(favorites.filter(id => id !== itemId));
    } else {
      setFavorites([...favorites, itemId]);
    }
  };

  const handleProceedFromAddress = () => {
    if(!deliveryAddress) return Alert.alert("Address Required", "Please provide a delivery address.");
    setPaymentStep('method');
  };

  const handleCheckoutMethod = () => {
    if(!walletType) return;
    if(walletType === 'cod') executeFinalCheckout();
    else setPaymentStep('wallet_input');
  };

const executeFinalCheckout = async () => {
    if (walletType !== 'cod' && mobileNumber.length < 11) {
      return Alert.alert("Invalid Number", "Please enter a valid 11-digit mobile account number.");
    }

    setPaymentStep('processing');

try {
      const orderPayload = {
        orderId: `#${Math.floor(1000 + Math.random() * 9000)}`,
        itemsList: cart.map(item => item.name).join(', '), 
        totalBill: totalPrice,
        deliveryLocation: deliveryAddress || "Self Pickup"
      };

      await fetch('http://localhost:5050/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      console.log("Data Sent Successfully!");
      
    } catch (error) {
      console.log("Fetch Error:", error);
    }
    // ---------------------------------------

    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        setZestPoints(prev => prev + rewardsEarned); 
        setActiveOrder({
          id: `#${Math.floor(1000 + Math.random() * 9000)}`,
          items: cart.map(item => item.name).join(', '),
          total: totalPrice,
          eta: '40 MINS'
        });
        setShowPayment(false);
        setCart([]);
        setWalletType('');
        setMobileNumber('');
        setScreen('delivery'); 
      }, 1500);
    }, 2000);
  };

  useEffect(() => {
    let interval;
    if (reservation.status === 'active' && reservation.timeLeft > 0) {
      interval = setInterval(() => {
        setReservation(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(interval);
            Alert.alert("Reservation Expired", "Your 30-minute hold has expired.");
            return { status: 'expired', timeLeft: 0, details: null };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [reservation.status, reservation.timeLeft]);

  const confirmReservation = () => {
    if (!resForm.name || !resForm.phone || !resForm.guests) return Alert.alert("Missing Information", "Please complete all details.");
    setReservation({ status: 'active', timeLeft: 1800, details: resForm });
    setShowResModal(false);
    setResForm({ name: '', phone: '', guests: '' });
  };

  const handleScanQR = () => {
    setShowAssistance(false);
    setShowQRModal(true);
    setQrStep('scanning');
    setTimeout(() => {
      setScannedTable({ number: '04', type: 'VIP Balcony Booth', capacity: '4 Guests', status: 'Available & Cleaned', server: 'Ahmad Raza' });
      setQrStep('details');
    }, 2500); 
  };

  const claimScannedTable = () => {
    Alert.alert("Table Claimed!", `You are now seated at Table ${scannedTable?.number}. Feel free to place your order!`);
    setShowQRModal(false);
  };

  const handleCallRequest = (requestType) => {
    setAssistanceStep('processing');
    setTimeout(() => {
      setAssistanceStep('success');
      setTimeout(() => {
        setShowAssistance(false);
        setAssistanceStep('options');
      }, 2500);
    }, 1500);
  };

  const submitFeedback = () => {
    if (rating === 0) return Alert.alert("Required", "Please select a star rating.");
    setFeedbackStep('processing');
    setTimeout(() => {
      setFeedbackStep('success');
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackStep('input');
        setRating(0);
        setFeedbackText('');
      }, 2500);
    }, 1500);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- REUSABLE COMPONENTS ---
  const renderTopNav = (title) => (
    <View style={styles.nav}>
      <TouchableOpacity onPress={() => {
        if(['cart', 'favorites', 'profile'].includes(screen)) { setScreen('home'); }
        else { setScreen('welcome'); setCart([]); }
      }}>
        <MaterialCommunityIcons name={screen === 'home' ? "menu-open" : "arrow-left"} size={28} color="#D4AF37" />
      </TouchableOpacity>
      
      <View style={{flex: 1, alignItems: 'center'}}>
        {/* RESTORED GLOWING LOGO IN NAV */}
        <Text style={[styles.navLogo, {textShadowColor: 'rgba(212, 175, 55, 0.8)', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 10}]}>
          {title}
        </Text>
      </View>
      
      {/* RESTORED CIRCULAR BORDER ICON */}
      <TouchableOpacity onPress={() => setShowFeedback(true)} style={styles.iconBtn}>
        <MaterialCommunityIcons name="star-outline" size={20} color="#D4AF37" />
      </TouchableOpacity>
    </View>
  );

  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => setScreen('home')}>
        <MaterialCommunityIcons name={screen === 'home' ? "home" : "home-outline"} size={30} color={screen === 'home' ? "#D4AF37" : "#666"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen('favorites')}>
        <MaterialCommunityIcons name={screen === 'favorites' ? "heart" : "heart-outline"} size={28} color={screen === 'favorites' ? "#D4AF37" : "#666"} />
      </TouchableOpacity>
      
      <Animated.View style={{ transform: [{ scale: cartScaleAnim }] }}>
        <TouchableOpacity style={styles.centerCartBtn} onPress={() => setScreen('cart')}>
          <MaterialCommunityIcons name="shopping" size={28} color="#000" />
          {cart.length > 0 && (
            <View style={styles.cartBadgeAbs}><Text style={styles.cartBadgeAbsText}>{cart.length}</Text></View>
          )}
        </TouchableOpacity>
      </Animated.View>
      
      <TouchableOpacity onPress={() => setShowAssistance(true)}>
        <MaterialCommunityIcons name="bell-ring-outline" size={28} color="#666" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setScreen('profile')}>
        <MaterialCommunityIcons name={screen === 'profile' ? "account" : "account-outline"} size={28} color={screen === 'profile' ? "#D4AF37" : "#666"} />
      </TouchableOpacity>
    </View>
  );

  // ==========================================
  // RENDER SCREENS
  // ==========================================
  const renderScreen = () => {
    // 1. WELCOME SCREEN
    if (screen === 'welcome') {
      return (
        <View style={styles.splash}>
          <Animated.View style={[styles.splashBorder, { opacity: splashFadeAnim, transform: [{ translateY: splashSlideAnim }] }]}>
            {/* RESTORED DIAMOND ICON */}
            <MaterialCommunityIcons name="diamond-stone" size={50} color="#D4AF37" style={{ marginBottom: 15 }} />
            
            {/* RESTORED NEON GLOW LOGO */}
            <Text style={styles.splashTitleFancy}>ZEST</Text>
            <Text style={styles.splashSubtitle}>ARE YOU HUNGRY?</Text>
            
            <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%', marginTop: 20 }}>
              <TouchableOpacity style={styles.smartBtnFull} onPress={() => setScreen('auth')}>
                <Text style={styles.smartBtnText}>GET STARTED</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      );
    }

    // 2. AUTH SCREEN
    if (screen === 'auth') {
      return (
        <View style={styles.splash}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{width: '100%', alignItems: 'center'}}>
            <Animated.View style={[styles.authBox, { opacity: splashFadeAnim, transform: [{ translateY: splashSlideAnim }] }]}>
              
              {/* RESTORED SHIELD ICON */}
              <MaterialCommunityIcons name="shield-account-outline" size={50} color="#D4AF37" style={{ alignSelf: 'center', marginBottom: 20 }} />
              
              {/* RESTORED GLOWING WELCOME TEXT */}
              <Text style={styles.authWelcomeTitle}>
                {authMode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
              </Text>
              
              {authMode === 'signup' && (
                <TextInput style={[styles.glassInput, {marginBottom: 15}]} placeholder="Full Name" placeholderTextColor="#666" value={authName} onChangeText={setAuthName} />
              )}
              <TextInput style={[styles.glassInput, {marginBottom: 15}]} placeholder="Email or Username" placeholderTextColor="#666" keyboardType="email-address" autoCapitalize="none" value={authEmail} onChangeText={setAuthEmail} />
              <TextInput style={styles.glassInput} placeholder="Password" placeholderTextColor="#666" secureTextEntry={true} value={authPassword} onChangeText={setAuthPassword} />
              
              {/* INTERACTIVE FORGOT PASSWORD */}
              {authMode === 'login' && (
                <TouchableOpacity style={{alignSelf: 'flex-end', marginTop: 12}} onPress={() => Alert.alert("Password Recovery", "A secure reset link has been dispatched to your email address.")}>
                  <Text style={{color: '#D4AF37', fontSize: 12, letterSpacing: 0.5}}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={[styles.smartBtnFull, {marginTop: 30}]} onPress={handleAuthAction} disabled={authLoading}>
                {authLoading ? <ActivityIndicator size="small" color="#000" /> : <Text style={styles.smartBtnText}>{authMode === 'login' ? 'LOGIN TO ZEST' : 'SIGN UP & ENTER'}</Text>}
              </TouchableOpacity>

              <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 25}}>
                <Text style={{color: '#888', fontSize: 12}}>{authMode === 'login' ? "Don't have an account? " : "Already have an account? "}</Text>
                <TouchableOpacity onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                  <Text style={{color: '#D4AF37', fontSize: 12, fontWeight: 'bold'}}>{authMode === 'login' ? "Sign Up" : "Login"}</Text>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 25}}>
                 <View style={{flex: 1, height: 1, backgroundColor: '#222'}} />
                 <Text style={{color: '#666', marginHorizontal: 15, fontSize: 10, letterSpacing: 1}}>OR CONTINUE WITH</Text>
                 <View style={{flex: 1, height: 1, backgroundColor: '#222'}} />
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'center', gap: 15}}>
                 <TouchableOpacity style={styles.socialBtn}><MaterialCommunityIcons name="google" size={22} color="#FFF" /></TouchableOpacity>
                 <TouchableOpacity style={styles.socialBtn}><MaterialCommunityIcons name="apple" size={22} color="#FFF" /></TouchableOpacity>
                 <TouchableOpacity style={styles.socialBtn}><MaterialCommunityIcons name="facebook" size={22} color="#FFF" /></TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      );
    }

    // 3. DELIVERY SCREEN 
    if (screen === 'delivery') {
      return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#050505', justifyContent: 'space-between', padding: 20}}>
          <View style={{alignItems: 'center', marginTop: 80}}>
            <View style={styles.deliveryCircle}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <MaterialCommunityIcons name="moped-electric" size={100} color="#D4AF37" />
              </Animated.View>
            </View>
            <Text style={[styles.splashTitle, {fontSize: 22, marginTop: 50, letterSpacing: 4, textAlign: 'center', color: '#D4AF37'}]}>
              WE DELIVER WITHIN 40 MINUTES
            </Text>
            <Text style={[styles.subLoadingText, {marginTop: 20, paddingHorizontal: 20, lineHeight: 22, letterSpacing: 1, color: '#888'}]}>
              IF YOU DON'T GET WHAT YOU ORDERED WITHIN 40 MINUTES THEN THE FOOD WILL BE FREE OF COST.
            </Text>
          </View>

          <View style={{alignItems: 'center', marginBottom: 20, width: '100%'}}>
            <TouchableOpacity onPress={() => Alert.alert("Company Policy", "Our 40-minute guarantee applies to standard delivery zones under normal traffic conditions.")}>
              <Text style={{color: '#666', fontWeight: '500', letterSpacing: 1, marginBottom: 25, fontSize: 11, textDecorationLine: 'underline'}}>Company Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.smartBtnFull, {backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D4AF37', marginBottom: 15}]} onPress={() => Alert.alert("Calling Rider", "Connecting you to your delivery partner...")}>
              <Text style={[styles.smartBtnText, {color: '#D4AF37'}]}>CALL RIDER</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smartBtnFull} onPress={() => setScreen('home')}>
              <Text style={styles.smartBtnText}>BACK TO HOME</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    // 4. USER PROFILE SCREEN
    if (screen === 'profile') {
      return (
        <SafeAreaView style={styles.container}>
          {renderTopNav('MY PROFILE')}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.profileHeader}>
              <View style={styles.avatarBox}>
                <Text style={{fontSize: 30, color: '#000', fontWeight: 'bold'}}>{authName ? authName.charAt(0).toUpperCase() : 'Z'}</Text>
              </View>
              <View style={{marginLeft: 20, flex: 1}}>
                <Text style={styles.profileName}>{authName || 'Zest Guest'}</Text>
                <Text style={{color: '#888', fontSize: 12}}>{authEmail || 'guest@zest.com'}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowEditProfile(true)} style={{padding: 10}}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>

            <View style={styles.rewardsCard}>
              <View>
                <Text style={{color: '#000', fontSize: 10, fontWeight: 'bold', letterSpacing: 2}}>GOLD TIER</Text>
                <Text style={{color: '#000', fontSize: 24, fontWeight: '300', marginTop: 5}}>{zestPoints} PTS</Text>
              </View>
              <MaterialCommunityIcons name="medal" size={40} color="#000" />
            </View>

            {/* NEW: ACTIVE ORDER TRACKER SECTION */}
            {activeOrder && (
              <>
                <View style={styles.titleRow}><Text style={styles.sectionTitle}>ACTIVE DELIVERY</Text></View>
                <View style={styles.activeOrderCard}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                    <Text style={{color: '#D4AF37', fontWeight: 'bold', fontSize: 16}}>Order {activeOrder.id}</Text>
                    <View style={styles.etaBadge}><Text style={{color: '#000', fontSize: 10, fontWeight: 'bold'}}>ETA: {activeOrder.eta}</Text></View>
                  </View>
                  <Text style={{color: '#FFF', fontSize: 13, marginBottom: 5}}>{activeOrder.items}</Text>
                  <Text style={{color: '#888', fontSize: 12, marginBottom: 15}}>Total: Rs. {activeOrder.total}</Text>
                  
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity style={[styles.smartBtnFull, {flex: 1, marginTop: 0, marginRight: 10, paddingVertical: 12}]} onPress={() => setScreen('delivery')}>
                      <Text style={styles.smartBtnText}>TRACK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.smartBtnFull, {flex: 1, marginTop: 0, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D4AF37', paddingVertical: 12}]} onPress={() => Alert.alert("Calling Rider", "Connecting you to your delivery partner...")}>
                      <Text style={[styles.smartBtnText, {color: '#D4AF37'}]}>CALL RIDER</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            <View style={styles.titleRow}><Text style={styles.sectionTitle}>SAVED ADDRESSES</Text></View>
            <View style={styles.payCard}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.payIconBox}><MaterialCommunityIcons name="home" size={20} color="#D4AF37" /></View>
                <View>
                  <Text style={[styles.payCardText, {color: '#FFF', fontWeight: 'bold'}]}>Home</Text>
                  <Text style={{color: '#888', fontSize: 11, marginTop: 2}}>{deliveryAddress || 'No address saved yet.'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.titleRow}><Text style={styles.sectionTitle}>PAST ORDERS</Text></View>
            {orderHistory.map((order, i) => (
              <View key={i} style={styles.orderHistoryCard}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                  <Text style={{color: '#FFF', fontWeight: 'bold'}}>{order.id}</Text>
                  <Text style={{color: '#4CAF50', fontSize: 12, fontWeight: 'bold'}}>{order.status}</Text>
                </View>
                <Text style={{color: '#888', fontSize: 12, marginBottom: 5}}>{order.items}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderTopWidth: 1, borderTopColor: '#222', paddingTop: 10}}>
                  <Text style={{color: '#666', fontSize: 11}}>{order.date}</Text>
                  <Text style={{color: '#D4AF37', fontWeight: 'bold'}}>Rs. {order.total}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={[styles.smartBtnFull, {backgroundColor: 'rgba(255,50,50,0.1)', borderWidth: 1, borderColor: '#ff4d4d', marginTop: 20, marginHorizontal: 20, width: 'auto'}]} onPress={() => { setScreen('welcome'); setAuthName(''); setAuthEmail(''); }}>
              <Text style={[styles.smartBtnText, {color: '#ff4d4d'}]}>LOG OUT</Text>
            </TouchableOpacity>

          </ScrollView>
          {renderBottomNav()}
        </SafeAreaView>
      );
    }

    // 5. CART SCREEN
    if (screen === 'cart') {
      return (
        <SafeAreaView style={styles.container}>
          {renderTopNav('MY CART')}
          <ScrollView style={{paddingHorizontal: 20}} showsVerticalScrollIndicator={false}>
            {cart.length === 0 ? (
              <Text style={styles.emptyCartText}>Your cart is empty. Add some delicious items!</Text>
            ) : (
              cart.map((item, index) => (
                <View key={index} style={styles.cartFullItemCard}>
                  <View style={styles.cartItemLeft}>
                    <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                    <View style={{marginLeft: 15, flex: 1}}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>Rs. {item.price}</Text>
                    </View>
                  </View>
                  <View style={styles.cartItemRight}>
                    <TouchableOpacity onPress={() => removeFromCart(index)} style={{padding: 5}}>
                      <MaterialCommunityIcons name="trash-can-outline" size={22} color="#ff4d4d" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            {cart.length > 0 && (
              <>
                <View style={styles.aiBox}>
                  <Text style={{color: '#D4AF37', fontSize: 10, letterSpacing: 1, fontWeight: 'bold', marginBottom: 5}}>✨ AI PAIRING SUGGESTION</Text>
                  <Text style={{color: '#AAA', fontSize: 12}}>Add a fresh Mint Margarita to complete your meal?</Text>
                  <TouchableOpacity style={{alignSelf: 'flex-start', marginTop: 10, backgroundColor: 'rgba(212, 175, 55, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10}}>
                    <Text style={{color: '#D4AF37', fontSize: 10, fontWeight: 'bold'}}>+ ADD FOR RS. 250</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.promoBox}>
                  <TextInput style={styles.promoInput} placeholder="Enter Promo Code" placeholderTextColor="#666" />
                  <TouchableOpacity style={styles.promoApplyBtn}><Text style={{color: '#000', fontWeight: 'bold'}}>APPLY</Text></TouchableOpacity>
                </View>

                <View style={styles.billBox}>
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#222'}}>
                    <MaterialCommunityIcons name="account-group-outline" size={20} color="#D4AF37" style={{marginRight: 10}} />
                    <Text style={{color: '#FFF', fontSize: 12, flex: 1}}>Split bill with friends</Text>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#666" />
                  </TouchableOpacity>
                  <View style={styles.billRow}><Text style={styles.billText}>Subtotal</Text><Text style={styles.billText}>Rs. {subtotal}</Text></View>
                  <View style={styles.billRow}><Text style={styles.billText}>Delivery Charges</Text><Text style={styles.billText}>Rs. {deliveryFee}</Text></View>
                  <View style={[styles.billRow, {borderTopWidth: 1, borderTopColor: '#333', paddingTop: 10, marginTop: 10}]}>
                    <Text style={styles.billTotalText}>Total</Text><Text style={styles.billTotalText}>Rs. {totalPrice}</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                    <MaterialCommunityIcons name="star-circle" size={16} color="#D4AF37" style={{marginRight: 5}} />
                    <Text style={{color: '#D4AF37', fontSize: 10, fontWeight: '600'}}>You will earn {rewardsEarned} ZEST points</Text>
                  </View>
                </View>

                <Animated.View style={{ transform: [{ scale: pulseAnim }], marginBottom: 30 }}>
                  <TouchableOpacity style={styles.smartBtnFull} onPress={() => { setShowPayment(true); setPaymentStep('address'); }}>
                    <Text style={styles.smartBtnText}>PROCEED TO CHECKOUT</Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      );
    }

    // 6. FAVORITES SCREEN
    if (screen === 'favorites') {
      return (
        <SafeAreaView style={styles.container}>
          {renderTopNav('FAVORITES')}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {favoriteItems.length === 0 ? (
              <View style={{alignItems: 'center', marginTop: 80}}>
                <MaterialCommunityIcons name="heart-broken-outline" size={80} color="#333" />
                <Text style={[styles.emptyCartText, {marginTop: 20}]}>No favorites yet.</Text>
                <Text style={{color: '#666', marginTop: 10}}>Tap the heart on items you love!</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {favoriteItems.map((item) => (
                  <View key={item.id} style={styles.itemCard}>
                    <Image source={{ uri: item.image }} style={styles.foodImage} />
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    
                    <View style={styles.cardFooterRow}>
                      <Text style={styles.itemPrice}>Rs. {item.price}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={{ marginRight: 12 }}>
                          <MaterialCommunityIcons name="heart" size={22} color="#ff4d4d" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addCircle} onPress={() => addToCart(item)}>
                          <MaterialCommunityIcons name="plus" size={18} color="#000" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
          {renderBottomNav()}
        </SafeAreaView>
      );
    }

    // 7. DEFAULT: HOME SCREEN
    return (
      <SafeAreaView style={styles.container}>
        {renderTopNav('ZEST')}

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={22} color="#888" style={{marginLeft: 15, marginRight: 10}} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for Burger, Tea, Pasta..." 
            placeholderTextColor="#888" 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{padding: 10}}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* TODAY'S SPECIAL BANNER */}
          <View style={styles.titleRow}><Text style={styles.sectionTitle}>TODAY'S SPECIAL</Text></View>
          <TouchableOpacity style={styles.specialCard} onPress={() => addToCart(menuData[6])}>
            <Image source={{uri: menuData[6].image}} style={styles.specialImage} />
            <View style={styles.specialOverlay}>
              <Text style={styles.specialTitle}>{menuData[6].name}</Text>
              <Text style={styles.specialPrice}>Rs. {menuData[6].price}  <Text style={styles.specialDiscount}>Rs. 1200</Text></Text>
            </View>
            <View style={styles.specialBadge}><Text style={styles.specialBadgeText}>20% OFF</Text></View>
          </TouchableOpacity>

          <View style={styles.titleRow}><Text style={styles.sectionTitle}>CATEGORIES</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft: 15, marginBottom: 20}}>
            {categories.map(cat => (
              <TouchableOpacity key={cat.id} style={[styles.categoryCard, selectedCategory === cat.id && styles.categoryCardActive]} onPress={() => handleCategoryChange(cat.id)}>
                <View style={[styles.catIconContainer, selectedCategory === cat.id && {backgroundColor: '#000'}]}>
                  <MaterialCommunityIcons name={cat.icon} size={24} color={selectedCategory === cat.id ? '#D4AF37' : '#FFF'} />
                </View>
                <Text style={[styles.categoryText, selectedCategory === cat.id && {color: '#D4AF37', fontWeight: 'bold'}]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'SEARCH RESULTS' : selectedCategory === 'All' ? 'POPULAR TODAY' : `${selectedCategory.toUpperCase()} MENU`}
            </Text>
          </View>
          
          <View style={styles.grid}>
            {filteredMenu.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.foodImage} />
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                
                <View style={styles.cardFooterRow}>
                  <Text style={styles.itemPrice}>Rs. {item.price}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={{ marginRight: 12 }}>
                      <MaterialCommunityIcons 
                        name={favorites.includes(item.id) ? "heart" : "heart-outline"} 
                        size={22} 
                        color={favorites.includes(item.id) ? "#ff4d4d" : "#666"} 
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addCircle} onPress={() => addToCart(item)}>
                      <MaterialCommunityIcons name="plus" size={18} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            {filteredMenu.length === 0 && <Text style={{color: '#888', marginLeft: 15, marginTop: 20}}>No items found matching your search.</Text>}
          </View>
        </ScrollView>
        
        {/* FLOATING AI CHAT BUTTON */}
        <Animated.View style={{ position: 'absolute', bottom: 100, right: 20, transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.aiFab} onPress={() => setShowAIChat(true)}>
            <MaterialCommunityIcons name="sparkles" size={26} color="#000" />
          </TouchableOpacity>
        </Animated.View>

        {renderBottomNav()}
      </SafeAreaView>
    );
  };

  // ==========================================
  // MAIN RETURN 
  // ==========================================
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#050505' }}>
      {renderScreen()}

      {/* --- ALL SHARED MODALS --- */}

      {/* AI CHAT MODAL 🤖 */}
      <Modal visible={showAIChat} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chatModalOverlay}>
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <MaterialCommunityIcons name="sparkles" size={24} color="#D4AF37" />
              <Text style={styles.chatTitle}>ZEST AI CONCIERGE</Text>
              <TouchableOpacity onPress={() => setShowAIChat(false)} style={{padding: 5}}>
                <MaterialCommunityIcons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <ScrollView ref={chatScrollRef} style={styles.chatScroll} contentContainerStyle={{paddingVertical: 20}} showsVerticalScrollIndicator={false}>
              {chatMessages.map(msg => (
                <View key={msg.id} style={[styles.chatBubble, msg.sender === 'user' ? styles.chatBubbleUser : styles.chatBubbleAI]}>
                  <Text style={[styles.chatText, msg.sender === 'user' ? {color: '#000'} : {color: '#FFF'}]}>{msg.text}</Text>
                </View>
              ))}
              {isAITyping && (
                <View style={[styles.chatBubble, styles.chatBubbleAI, {width: 80, alignItems: 'center'}]}>
                  <ActivityIndicator size="small" color="#D4AF37" />
                </View>
              )}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput style={styles.chatInput} placeholder="Ask for recommendations..." placeholderTextColor="#666" value={chatInput} onChangeText={setChatInput} onSubmitEditing={handleSendChat} />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendChat}>
                <MaterialCommunityIcons name="send" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* CHECKOUT MODAL */}
      <Modal visible={showPayment} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.glassModal}>
            
            {paymentStep === 'address' && (
              <>
                <Text style={styles.modalTitle}>DELIVERY DETAILS</Text>
                <View style={styles.divider} />
                <Text style={styles.inputLabel}>DELIVERY ADDRESS</Text>
                <TextInput style={[styles.glassInput, {marginBottom: 15}]} placeholder="e.g. House 4, Street 10..." placeholderTextColor="#666" value={deliveryAddress} onChangeText={setDeliveryAddress} />
                <Text style={styles.inputLabel}>SPECIAL INSTRUCTIONS (OPTIONAL)</Text>
                <TextInput style={styles.glassInput} placeholder="e.g. Less spicy, call on arrival..." placeholderTextColor="#666" value={orderNotes} onChangeText={setOrderNotes} />
                <TouchableOpacity style={styles.smartBtnFull} onPress={handleProceedFromAddress}>
                  <Text style={styles.smartBtnText}>CHOOSE PAYMENT METHOD</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setShowPayment(false)}><Text style={styles.closeBtnText}>CANCEL</Text></TouchableOpacity>
              </>
            )}

            {paymentStep === 'method' && (
              <>
                <Text style={styles.modalTitle}>PAYMENT METHOD</Text>
                <View style={styles.divider} />
                <Text style={[styles.summaryText, {marginBottom: 20}]}>Total Due: <Text style={{color: '#FFF', fontWeight: 'bold'}}>Rs. {totalPrice}</Text></Text>
                
                <TouchableOpacity style={[styles.payCard, walletType === 'cod' && styles.payCardActive]} onPress={() => setWalletType('cod')}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={styles.payIconBox}><Text style={{fontSize: 18}}>💵</Text></View><Text style={[styles.payCardText, walletType === 'cod' && {color: '#FFF'}]}>Cash on Delivery</Text></View>
                  {walletType === 'cod' && <MaterialCommunityIcons name="check-circle" size={24} color="#D4AF37" />}
                </TouchableOpacity>

                <TouchableOpacity style={[styles.payCard, walletType === 'easypaisa' && styles.payCardActive]} onPress={() => setWalletType('easypaisa')}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={styles.payIconBox}><Text style={{fontSize: 18}}>🟢</Text></View><Text style={[styles.payCardText, walletType === 'easypaisa' && {color: '#FFF'}]}>EasyPaisa Account</Text></View>
                  {walletType === 'easypaisa' && <MaterialCommunityIcons name="check-circle" size={24} color="#D4AF37" />}
                </TouchableOpacity>

                <TouchableOpacity style={[styles.payCard, walletType === 'jazzcash' && styles.payCardActive]} onPress={() => setWalletType('jazzcash')}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={styles.payIconBox}><Text style={{fontSize: 18}}>🔴</Text></View><Text style={[styles.payCardText, walletType === 'jazzcash' && {color: '#FFF'}]}>JazzCash Account</Text></View>
                  {walletType === 'jazzcash' && <MaterialCommunityIcons name="check-circle" size={24} color="#D4AF37" />}
                </TouchableOpacity>

                <TouchableOpacity style={[styles.smartBtnFull, { opacity: walletType ? 1 : 0.5, marginTop: 20 }]} disabled={!walletType} onPress={handleCheckoutMethod}>
                  <Text style={styles.smartBtnText}>{walletType === 'cod' ? 'CONFIRM ORDER' : 'PROCEED TO DETAILS'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setPaymentStep('address')}><Text style={styles.closeBtnText}>BACK TO ADDRESS</Text></TouchableOpacity>
              </>
            )}

            {paymentStep === 'wallet_input' && (
              <>
                <Text style={styles.modalTitle}>{walletType === 'easypaisa' ? 'EASYPAISA' : 'JAZZCASH'}</Text>
                <View style={styles.divider} />
                <Text style={styles.inputLabel}>ENTER MOBILE NUMBER</Text>
                <TextInput style={styles.glassInput} placeholder="03XX XXXXXXX" placeholderTextColor="#666" keyboardType="numeric" value={mobileNumber} onChangeText={setMobileNumber} maxLength={11} />
                <TouchableOpacity style={styles.smartBtnFull} onPress={executeFinalCheckout}>
                  <Text style={styles.smartBtnText}>AUTHORIZE Rs. {totalPrice}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setPaymentStep('method')}><Text style={styles.closeBtnText}>BACK</Text></TouchableOpacity>
              </>
            )}
            
            {paymentStep === 'processing' && (
              <View style={styles.centerContent}>
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>Securing Order...</Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={showEditProfile} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.glassModal}>
            <Text style={styles.modalTitle}>EDIT PROFILE</Text>
            <View style={styles.divider} />
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <TextInput style={[styles.glassInput, {marginBottom: 15}]} placeholder="Your Name" placeholderTextColor="#666" value={authName} onChangeText={setAuthName} />
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <TextInput style={[styles.glassInput, {marginBottom: 15}]} placeholder="Email Address" placeholderTextColor="#666" value={authEmail} onChangeText={setAuthEmail} keyboardType="email-address" autoCapitalize="none" />
            <Text style={styles.inputLabel}>DEFAULT DELIVERY ADDRESS</Text>
            <TextInput style={styles.glassInput} placeholder="Delivery Address" placeholderTextColor="#666" value={deliveryAddress} onChangeText={setDeliveryAddress} />
            <TouchableOpacity style={styles.smartBtnFull} onPress={handleSaveProfile}><Text style={styles.smartBtnText}>SAVE CHANGES</Text></TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowEditProfile(false)}><Text style={styles.closeBtnText}>CANCEL</Text></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* QR SCANNER MODAL */}
      <Modal visible={showQRModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          {qrStep === 'scanning' && (
            <View style={styles.scannerContainer}>
              <View style={styles.scannerFrame}>
                <View style={[styles.corner, styles.tl]} />
                <View style={[styles.corner, styles.tr]} />
                <View style={[styles.corner, styles.bl]} />
                <View style={[styles.corner, styles.br]} />
                <Animated.View style={[styles.scanLaser, { transform: [{ translateY: scanLineAnim }] }]} />
              </View>
              <Text style={styles.loadingText}>Align QR code within the frame...</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowQRModal(false)}><Text style={styles.closeBtnText}>CANCEL SCAN</Text></TouchableOpacity>
            </View>
          )}
          
          {qrStep === 'details' && scannedTable && (
            <View style={styles.exactUiModal}>
              <Text style={{fontSize: 45, marginBottom: 10, textAlign: 'center'}}>📍</Text>
              <Text style={styles.exactUiTitle}>TABLE IDENTIFIED</Text>
              <View style={styles.exactUiDivider} />
              <View style={styles.exactUiBox}>
                <Text style={styles.exactUiTableNum}>TABLE {scannedTable.number}</Text>
                <View style={styles.exactUiRow}><Text style={styles.exactUiLabel}>Type:</Text><Text style={styles.exactUiValueWhite}>{scannedTable.type}</Text></View>
                <View style={styles.exactUiRow}><Text style={styles.exactUiLabel}>Capacity:</Text><Text style={styles.exactUiValueWhite}>{scannedTable.capacity}</Text></View>
                <View style={styles.exactUiRow}><Text style={styles.exactUiLabel}>Status:</Text><Text style={styles.exactUiValueGreen}>{scannedTable.status}</Text></View>
                <View style={styles.exactUiRowNoBorder}><Text style={styles.exactUiLabel}>Server:</Text><Text style={styles.exactUiValueWhite}>{scannedTable.server}</Text></View>
              </View>
              <TouchableOpacity style={styles.exactUiBtn} onPress={claimScannedTable}><Text style={styles.exactUiBtnText}>CLAIM THIS TABLE</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.exactUiBtn, {backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D4AF37', marginTop: 15}]} onPress={() => Alert.alert("Calling Staff", `Pinging ${scannedTable.server}...`)}>
                <Text style={[styles.exactUiBtnText, {color: '#D4AF37'}]}>CALL {scannedTable.server.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {/* RESERVATION MODAL */}
      <Modal visible={showResModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.glassModal}>
            <Text style={styles.modalTitle}>GUEST DETAILS</Text>
            <View style={styles.divider} />
            <TextInput style={[styles.glassInput, {marginBottom: 15}]} placeholder="Reservation Name" placeholderTextColor="#666" value={resForm.name} onChangeText={(text) => setResForm({...resForm, name: text})} />
            <TextInput style={[styles.glassInput, {marginBottom: 15}]} placeholder="03XX XXXXXXX" placeholderTextColor="#666" keyboardType="phone-pad" value={resForm.phone} onChangeText={(text) => setResForm({...resForm, phone: text})} />
            <TextInput style={styles.glassInput} placeholder="Party Size" placeholderTextColor="#666" keyboardType="numeric" maxLength={2} value={resForm.guests} onChangeText={(text) => setResForm({...resForm, guests: text})} />
            <TouchableOpacity style={styles.smartBtnFull} onPress={confirmReservation}><Text style={styles.smartBtnText}>CONFIRM RESERVATION</Text></TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowResModal(false)}><Text style={styles.closeBtnText}>CANCEL</Text></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* UNIFIED DINE-IN ASSISTANCE MODAL */}
      <Modal visible={showAssistance} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.glassModal}>
            {assistanceStep === 'options' && (
              <>
                <Text style={styles.modalTitle}>DINE-IN ASSISTANCE</Text>
                <View style={styles.divider} />
                <ScrollView style={{maxHeight: 450}} showsVerticalScrollIndicator={false}>
                  
                  <Text style={styles.assistSectionTitle}>TABLE MANAGEMENT</Text>
                  
                  {reservation.status === 'active' ? (
                    <View style={styles.activeResBox}>
                      <MaterialCommunityIcons name="clock-check-outline" size={36} color="#000" />
                      <View style={{marginLeft: 15}}>
                        <Text style={{color: '#000', fontWeight: 'bold', fontSize: 13, letterSpacing: 1}}>TABLE RESERVED</Text>
                        <Text style={{color: '#000', fontSize: 22, fontWeight: '800'}}>{formatTime(reservation.timeLeft)}</Text>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.payCard} onPress={() => { setShowAssistance(false); setShowResModal(true); }}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={styles.payIconBox}><MaterialCommunityIcons name="clock-outline" size={20} color="#D4AF37" /></View><Text style={[styles.payCardText, {color: '#FFF'}]}>Reserve a Table</Text></View>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.payCard} onPress={handleScanQR}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={styles.payIconBox}><MaterialCommunityIcons name="qrcode-scan" size={20} color="#D4AF37" /></View><Text style={[styles.payCardText, {color: '#FFF'}]}>Scan Table QR</Text></View>
                  </TouchableOpacity>

                  <Text style={styles.assistSectionTitle}>STAFF REQUESTS</Text>
                  <TouchableOpacity style={styles.payCard} onPress={() => handleCallRequest('water')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={styles.payIconBox}><Text style={{fontSize: 16}}>💧</Text></View><Text style={[styles.payCardText, {color: '#FFF'}]}>Need Water</Text></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.payCard} onPress={() => handleCallRequest('order')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={styles.payIconBox}><Text style={{fontSize: 16}}>🛎️</Text></View><Text style={[styles.payCardText, {color: '#FFF'}]}>Ready to Order</Text></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.payCard} onPress={() => handleCallRequest('bill')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={styles.payIconBox}><Text style={{fontSize: 16}}>🧾</Text></View><Text style={[styles.payCardText, {color: '#FFF'}]}>Request Bill</Text></View>
                  </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setShowAssistance(false)}><Text style={styles.closeBtnText}>CLOSE</Text></TouchableOpacity>
              </>
            )}
            {assistanceStep === 'processing' && (
              <View style={styles.centerContent}><ActivityIndicator size="large" color="#D4AF37" /><Text style={styles.loadingText}>Pinging Staff...</Text></View>
            )}
            {assistanceStep === 'success' && (
              <View style={styles.centerContent}><MaterialCommunityIcons name="check-circle-outline" size={60} color="#4CAF50" style={{marginBottom: 10}} /><Text style={styles.modalTitle}>STAFF ALERTED</Text><Text style={styles.subLoadingText}>A server is on their way to your table.</Text></View>
            )}
          </View>
        </View>
      </Modal>

      {/* FEEDBACK MODAL WITH RESTORED GLOWING STARS */}
      <Modal visible={showFeedback} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.glassModal}>
            {feedbackStep === 'input' && (
              <View style={{width: '100%', alignItems: 'center'}}>
                <Text style={styles.modalTitle}>GUEST EXPERIENCE</Text>
                <Text style={{color: '#888', fontSize: 13, marginTop: 15, marginBottom: 5}}>Tap to rate your visit to ZEST</Text>
                
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                      {/* RESTORED GLOWING SHADOWS */}
                      <Text style={[styles.starIcon, { color: star <= rating ? '#D4AF37' : '#222' }]}>★</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput style={styles.textArea} placeholder="What did you love?" placeholderTextColor="#666" multiline={true} numberOfLines={4} value={feedbackText} onChangeText={setFeedbackText} />
                <TouchableOpacity style={styles.smartBtnFull} onPress={submitFeedback}><Text style={styles.smartBtnText}>SEND FEEDBACK</Text></TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setShowFeedback(false)}><Text style={styles.closeBtnText}>CLOSE</Text></TouchableOpacity>
              </View>
            )}
            {feedbackStep === 'processing' && (
              <View style={styles.centerContent}><ActivityIndicator size="large" color="#D4AF37" /><Text style={styles.loadingText}>Sending Feedback...</Text></View>
            )}
            {feedbackStep === 'success' && (
              <View style={styles.centerContent}><MaterialCommunityIcons name="star-shooting" size={60} color="#D4AF37" style={{marginBottom: 10}} /><Text style={styles.modalTitle}>THANK YOU!</Text></View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  splash: { flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center', padding: 20 },
  splashBorder: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', padding: 40, alignItems: 'center', width: '100%', borderRadius: 24 },
  authBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)', padding: 30, width: '100%', borderRadius: 24 },
  
  // RESTORED FANCY GLOWING TYPOGRAPHY
  splashTitleFancy: { fontSize: 45, fontWeight: '200', color: '#D4AF37', letterSpacing: 12, textAlign: 'center', textShadowColor: 'rgba(212, 175, 55, 0.8)', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 15 }, 
  authWelcomeTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', letterSpacing: 4, textAlign: 'center', marginBottom: 25, textShadowColor: 'rgba(212, 175, 55, 0.6)', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 10 },
  
  splashTitle: { fontSize: 32, fontWeight: '300', color: '#FFFFFF', letterSpacing: 8, textAlign: 'center' },
  splashSubtitle: { fontSize: 10, color: '#D4AF37', letterSpacing: 6, marginBottom: 40, marginTop: 10, textAlign: 'center' },
  
  // RESTORED BUTTON SHADOW
  smartBtnFull: { backgroundColor: '#D4AF37', paddingVertical: 16, borderRadius: 30, width: '100%', alignItems: 'center', marginTop: 20, shadowColor: '#D4AF37', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.6, shadowRadius: 15, elevation: 5 },
  smartBtnText: { color: '#000', fontWeight: '800', letterSpacing: 1.5, fontSize: 11 },
  socialBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  
  nav: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, alignItems: 'center' },
  
  // RESTORED GLOWING TOP NAV LOGO
  navLogo: { fontSize: 20, fontWeight: '600', color: '#FFF', letterSpacing: 6, textShadowColor: 'rgba(212, 175, 55, 0.8)', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 10 },
  
  // RESTORED CIRCULAR BORDER FOR TOP RIGHT NAV ICON
  iconBtn: { backgroundColor: 'transparent', padding: 10, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.5)' },
  
  scrollContent: { paddingBottom: 120 },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 20, marginTop: 10, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)' },
  searchInput: { flex: 1, color: '#FFF', paddingVertical: 15, fontSize: 13, letterSpacing: 0.5 },

  specialCard: { marginHorizontal: 20, height: 160, borderRadius: 20, overflow: 'hidden', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' },
  specialImage: { width: '100%', height: '100%' },
  specialOverlay: { position: 'absolute', bottom: 0, width: '100%', padding: 15, backgroundColor: 'rgba(0,0,0,0.7)' },
  specialTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  specialPrice: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold', marginTop: 5 },
  specialDiscount: { color: '#888', textDecorationLine: 'line-through', fontSize: 12, fontWeight: 'normal' },
  specialBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: '#ff4d4d', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, overflow: 'hidden' },
  specialBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  profileHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 30 },
  avatarBox: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  profileName: { color: '#FFF', fontSize: 20, fontWeight: '600', letterSpacing: 1 },
  rewardsCard: { marginHorizontal: 20, backgroundColor: 'rgba(212, 175, 55, 0.9)', padding: 25, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#D4AF37', shadowOffset: {width: 0, height: 5}, shadowOpacity: 0.4, shadowRadius: 10, marginBottom: 30 },
  
  // NEW ACTIVE ORDER CARD STYLE
  activeOrderCard: { backgroundColor: 'rgba(212, 175, 55, 0.05)', padding: 20, borderRadius: 15, marginHorizontal: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' },
  etaBadge: { backgroundColor: '#D4AF37', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  
  orderHistoryCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 15, marginHorizontal: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },

  deliveryCircle: { width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(212, 175, 55, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(212, 175, 55, 0.3)' },

  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, marginBottom: 15, marginTop: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#888', marginLeft: 20, letterSpacing: 3 },
  categoryCard: { alignItems: 'center', marginRight: 15, padding: 10, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'transparent' },
  categoryCardActive: { borderColor: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)' },
  catIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  categoryText: { color: '#888', fontSize: 10, marginTop: 8, letterSpacing: 1, fontWeight: '500' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  itemCard: { width: '48%', backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  foodImage: { width: '100%', height: 100, borderRadius: 15, marginBottom: 15, backgroundColor: '#111' },
  itemName: { color: '#FFF', fontWeight: '500', fontSize: 13, letterSpacing: 0.5, marginBottom: 8 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold' },
  addCircle: { backgroundColor: '#D4AF37', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  emptyCartText: { color: '#666', textAlign: 'center', marginTop: 50, fontSize: 14, letterSpacing: 1 },
  cartFullItemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cartItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cartItemImage: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#111' },
  cartItemName: { color: '#FFF', fontSize: 13, fontWeight: '500', letterSpacing: 0.5 },
  cartItemPrice: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  cartItemRight: { flexDirection: 'row', alignItems: 'center' },
  
  aiBox: { backgroundColor: 'rgba(212, 175, 55, 0.05)', padding: 15, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)' },
  promoBox: { flexDirection: 'row', marginBottom: 30 },
  promoInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFF', padding: 15, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)', borderRightWidth: 0 },
  promoApplyBtn: { backgroundColor: '#D4AF37', paddingHorizontal: 20, justifyContent: 'center', borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  
  billBox: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 15, marginBottom: 20 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  billText: { color: '#AAA', fontSize: 13, letterSpacing: 0.5 },
  billTotalText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#0A0A0A', paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#222', position: 'absolute', bottom: 0, width: '100%' },
  centerCartBtn: { backgroundColor: '#D4AF37', width: 65, height: 65, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginTop: -35, borderWidth: 5, borderColor: '#050505', shadowColor: '#D4AF37', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.4, shadowRadius: 8 },
  cartBadgeAbs: { position: 'absolute', top: 0, right: 0, backgroundColor: '#ff4d4d', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000' },
  cartBadgeAbsText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  aiFab: { backgroundColor: '#D4AF37', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#D4AF37', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.5, shadowRadius: 10, borderWidth: 2, borderColor: '#FFF' },
  chatModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  chatContainer: { backgroundColor: '#111', height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, borderColor: '#D4AF37', paddingBottom: 20 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  chatTitle: { flex: 1, color: '#D4AF37', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginLeft: 10 },
  chatScroll: { flex: 1, paddingHorizontal: 20 },
  chatBubble: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 15 },
  chatBubbleAI: { backgroundColor: 'rgba(255,255,255,0.05)', alignSelf: 'flex-start', borderBottomLeftRadius: 5 },
  chatBubbleUser: { backgroundColor: '#D4AF37', alignSelf: 'flex-end', borderBottomRightRadius: 5 },
  chatText: { fontSize: 14, lineHeight: 20 },
  chatInputRow: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10 },
  chatInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFF', paddingHorizontal: 20, borderRadius: 25, height: 50, borderWidth: 1, borderColor: '#333' },
  chatSendBtn: { width: 50, height: 50, backgroundColor: '#D4AF37', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  glassModal: { backgroundColor: '#0A0A0A', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', minHeight: 400, width: '100%' },
  modalTitle: { fontSize: 16, fontWeight: '500', color: '#FFF', letterSpacing: 3, textAlign: 'center' },
  divider: { width: 40, height: 2, backgroundColor: '#D4AF37', marginVertical: 15, alignSelf: 'center', borderRadius: 2 },
  
  activeResBox: { backgroundColor: '#D4AF37', padding: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  payCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 18, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  payCardActive: { borderColor: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.05)' },
  payIconBox: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8, marginRight: 15 },
  payCardText: { color: '#AAA', fontSize: 14, fontWeight: '500', letterSpacing: 0.5 },
  assistSectionTitle: { color: '#D4AF37', fontSize: 10, letterSpacing: 2, marginBottom: 15, marginTop: 10 },
  
  inputLabel: { color: '#D4AF37', fontSize: 10, letterSpacing: 2, alignSelf: 'flex-start', marginBottom: 10, width: '100%' },
  glassInput: { width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', color: '#FFF', padding: 18, fontSize: 14, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)', letterSpacing: 1, textAlign: 'center' },
  
  centerContent: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { color: '#D4AF37', marginTop: 20, fontSize: 12, letterSpacing: 1 },
  subLoadingText: { color: '#888', fontSize: 11, textAlign: 'center', letterSpacing: 0.5, lineHeight: 18 },
  closeBtn: { marginTop: 20, padding: 15, alignItems: 'center' },
  closeBtnText: { color: '#666', fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },

  scannerContainer: { alignItems: 'center', justifyContent: 'center', height: '100%' },
  scannerFrame: { width: 250, height: 250, position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden' },
  scanLaser: { width: '100%', height: 3, backgroundColor: '#D4AF37', shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 5, position: 'absolute', top: 10 },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#D4AF37', borderWidth: 2, borderRadius: 8 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  exactUiModal: { backgroundColor: '#111', borderRadius: 15, padding: 25, width: '90%', alignItems: 'center', borderWidth: 1, borderColor: '#222', alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' },
  exactUiTitle: { fontSize: 16, fontWeight: '400', color: '#FFF', letterSpacing: 3, textAlign: 'center' },
  exactUiDivider: { width: 40, height: 2, backgroundColor: '#D4AF37', marginVertical: 20 },
  exactUiBox: { width: '100%', backgroundColor: '#0a0a0a', padding: 25, borderRadius: 8, borderWidth: 1, borderColor: '#1A1A1A', marginBottom: 25 },
  exactUiTableNum: { color: '#D4AF37', fontSize: 24, fontWeight: '300', textAlign: 'center', letterSpacing: 2, marginBottom: 25 },
  exactUiRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  exactUiRowNoBorder: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  exactUiLabel: { color: '#888', fontSize: 12, letterSpacing: 0.5 },
  exactUiValueWhite: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  exactUiValueGreen: { color: '#4CAF50', fontSize: 12, fontWeight: '600' },
  exactUiBtn: { backgroundColor: '#D4AF37', width: '100%', paddingVertical: 16, borderRadius: 4, alignItems: 'center' },
  exactUiBtnText: { color: '#000', fontSize: 11, fontWeight: '600', letterSpacing: 1 },

  starsContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 20, width: '100%' },
  
  // RESTORED GLOWING SHADOWS FOR STARS
  starIcon: { fontSize: 45, marginHorizontal: 5, textShadowColor: 'rgba(212, 175, 55, 0.8)', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 15 },
  
  textArea: { width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', color: '#FFF', padding: 20, fontSize: 13, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)', height: 100, textAlignVertical: 'top', marginBottom: 10 },
});
