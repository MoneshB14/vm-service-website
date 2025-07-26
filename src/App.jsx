import React, { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import {
  Disc, Link2, Wrench, Activity, CircleDashed, BatteryCharging, Zap,
  Settings, Link, Wind, Droplets, Volume2, AlertCircle, Droplet, Hammer, Cpu,
  Phone, MapPin, Mail, Clock, User, Bike, Check
} from 'lucide-react'

function App() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('chassis')
  const [showModal, setShowModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [availableTimings, setAvailableTimings] = useState([])
  const [isLoadingTimings, setIsLoadingTimings] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    name: '',
    contact: '',
    vehicleModel: '',
    regNo: '',
    preferredDate: '',
    preferredTime: '',
    serviceType: ''
  })

  const showToastMessage = (message, type = 'success') => {
    toast({
      title: type === 'success' ? 'Success' : 'Error',
      description: message,
      variant: type === 'success' ? 'default' : 'destructive',
    })
  }

  const fetchAvailableTimings = async (date) => {
    if (!date) return

    setIsLoadingTimings(true)
    try {
      const response = await fetch(`http://localhost:8888/vm/api/website-booking/available-timings?date=${date}`)
      const data = await response.json()

      if (data.success) {
        setAvailableTimings(data.availableTimings)
        // Reset preferred time if it's not in available timings
        if (bookingForm.preferredTime && !data.availableTimings.includes(bookingForm.preferredTime)) {
          setBookingForm(prev => ({ ...prev, preferredTime: '' }))
        }
      } else {
        showToastMessage('Failed to fetch available timings', 'error')
      }
    } catch (error) {
      console.error('Error fetching timings:', error)
      showToastMessage('Error fetching available timings', 'error')
    } finally {
      setIsLoadingTimings(false)
    }
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      const response = await fetch('http://localhost:8888/vm/api/website-booking/book-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingForm)
      })

      const data = await response.json()

      if (data.success) {
        showToastMessage(`Booking successful! Your booking ID is ${data.bookingId}`, 'success')
        setBookingForm({
          name: '',
          contact: '',
          vehicleModel: '',
          regNo: '',
          preferredDate: '',
          preferredTime: '',
          serviceType: ''
        })
        setShowModal(false)
      } else {
        showToastMessage(data.message || 'Booking failed. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error booking service:', error)
      showToastMessage('Error booking service. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }))

    // Fetch available timings when date changes
    if (field === 'preferredDate') {
      fetchAvailableTimings(value)
    }
  }

  const chassisServices = [
    {
      name: 'Brake Shoe Replacement',
      description: 'Complete brake system maintenance and replacement',
      icon: <Disc className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '2-3 hours',
        price: '₹800 - ₹1,200',
        includes: [
          'Brake shoe inspection and replacement',
          'Brake drum cleaning and adjustment',
          'Brake cable lubrication',
          'Brake pedal adjustment',
          'Test ride and brake performance check'
        ],
        benefits: [
          'Improved braking performance',
          'Enhanced safety',
          'Extended brake system life',
          'Smooth brake operation'
        ],
        tips: 'Recommended every 10,000 km or when brake performance decreases'
      }
    },
    {
      name: 'Drive Chain Replacement',
      description: 'Professional chain replacement and adjustment',
      icon: <Link2 className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '1-2 hours',
        price: '₹600 - ₹1,000',
        includes: [
          'Chain inspection and replacement',
          'Sprocket inspection',
          'Chain tension adjustment',
          'Chain lubrication',
          'Performance testing'
        ],
        benefits: [
          'Smooth power transmission',
          'Reduced wear on sprockets',
          'Better fuel efficiency',
          'Quieter operation'
        ],
        tips: 'Replace every 15,000-20,000 km or when chain shows signs of wear'
      }
    },
    {
      name: 'Front Fork Check',
      description: 'Comprehensive front fork inspection and repair',
      icon: <Wrench className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '2-4 hours',
        price: '₹1,200 - ₹2,500',
        includes: [
          'Fork oil inspection and replacement',
          'Fork seal replacement if needed',
          'Fork spring inspection',
          'Fork alignment check',
          'Steering head bearing adjustment'
        ],
        benefits: [
          'Improved ride comfort',
          'Better handling and stability',
          'Reduced vibration',
          'Enhanced safety'
        ],
        tips: 'Service every 20,000 km or when suspension feels harsh'
      }
    },
    {
      name: 'Rear Shock Absorber Check',
      description: 'Shock absorber testing and replacement',
      icon: <Activity className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '1-2 hours',
        price: '₹800 - ₹1,500',
        includes: [
          'Shock absorber inspection',
          'Oil seal replacement if needed',
          'Spring tension adjustment',
          'Mounting bolt inspection',
          'Performance testing'
        ],
        benefits: [
          'Better rear suspension performance',
          'Improved ride quality',
          'Enhanced stability',
          'Reduced rear-end bounce'
        ],
        tips: 'Check every 15,000 km or when rear suspension feels loose'
      }
    },
    {
      name: 'Wheel Wobbling Check',
      description: 'Wheel alignment and balancing services',
      icon: <CircleDashed className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '1-1.5 hours',
        price: '₹400 - ₹800',
        includes: [
          'Wheel alignment check',
          'Wheel balancing',
          'Tire pressure adjustment',
          'Wheel bearing inspection',
          'Rim inspection for damage'
        ],
        benefits: [
          'Eliminates wheel wobbling',
          'Better handling',
          'Reduced tire wear',
          'Improved fuel efficiency'
        ],
        tips: 'Check whenever you notice wheel wobbling or uneven tire wear'
      }
    },
    {
      name: 'Starting Trouble',
      description: 'Diagnosis and repair of starting issues',
      icon: <BatteryCharging className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '1-3 hours',
        price: '₹500 - ₹1,500',
        includes: [
          'Battery voltage check',
          'Starter motor inspection',
          'Ignition system diagnosis',
          'Spark plug inspection',
          'Fuel system check'
        ],
        benefits: [
          'Reliable starting',
          'Better fuel efficiency',
          'Reduced battery drain',
          'Improved engine performance'
        ],
        tips: 'Address starting issues immediately to prevent further damage'
      }
    }
  ]

  const engineServices = [
    {
      name: 'Clutch Plates Replacement',
      description: 'Complete clutch system replacement',
      icon: <Settings className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '3-4 hours',
        price: '₹1,500 - ₹2,500',
        includes: [
          'Clutch plate inspection and replacement',
          'Clutch cable adjustment',
          'Clutch basket inspection',
          'Oil change (if needed)',
          'Clutch performance testing'
        ],
        benefits: [
          'Smooth gear shifting',
          'Better power transmission',
          'Reduced clutch slippage',
          'Improved fuel efficiency'
        ],
        tips: 'Replace when clutch feels soft or gear shifting becomes difficult'
      }
    },
    {
      name: 'Cam Chain Replacement',
      description: 'Professional cam chain replacement',
      icon: <Link className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '4-6 hours',
        price: '₹2,000 - ₹3,500',
        includes: [
          'Cam chain inspection and replacement',
          'Tensioner replacement',
          'Valve clearance adjustment',
          'Engine timing check',
          'Performance testing'
        ],
        benefits: [
          'Quieter engine operation',
          'Better engine performance',
          'Prevents engine damage',
          'Improved fuel efficiency'
        ],
        tips: 'Replace every 30,000-40,000 km or when engine becomes noisy'
      }
    },
    {
      name: 'Smoky Exhaust',
      description: 'Exhaust system diagnosis and repair',
      icon: <Wind className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '2-3 hours',
        price: '₹800 - ₹1,500',
        includes: [
          'Exhaust system inspection',
          'Catalytic converter check',
          'Air-fuel mixture adjustment',
          'Engine compression test',
          'Emission testing'
        ],
        benefits: [
          'Cleaner emissions',
          'Better engine performance',
          'Improved fuel efficiency',
          'Environmentally friendly'
        ],
        tips: 'Address smoke issues immediately to prevent engine damage'
      }
    },
    {
      name: 'Oil Leakage',
      description: 'Oil leak detection and repair',
      icon: <Droplets className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '2-4 hours',
        price: '₹600 - ₹1,200',
        includes: [
          'Oil leak detection',
          'Gasket replacement',
          'Oil seal replacement',
          'Oil level check',
          'Leak prevention measures'
        ],
        benefits: [
          'Prevents oil loss',
          'Protects engine components',
          'Maintains oil pressure',
          'Reduces environmental impact'
        ],
        tips: 'Fix oil leaks immediately to prevent engine damage'
      }
    },
    {
      name: 'Engine Noise',
      description: 'Engine noise diagnosis and repair',
      icon: <Volume2 className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '2-3 hours',
        price: '₹500 - ₹1,000',
        includes: [
          'Engine noise diagnosis',
          'Component inspection',
          'Bearing replacement if needed',
          'Engine tuning',
          'Performance testing'
        ],
        benefits: [
          'Quieter engine operation',
          'Better engine performance',
          'Prevents further damage',
          'Improved ride comfort'
        ],
        tips: 'Address unusual engine noises immediately'
      }
    }
  ]

  const otherServices = [
    {
      name: 'Oil Change (Genuine Engine Oil 4T Plus)',
      description: 'Premium engine oil change service',
      icon: <Droplet className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '30-45 minutes',
        price: '₹300 - ₹500',
        includes: [
          'Engine oil replacement',
          'Oil filter replacement',
          'Oil level check',
          'Engine flush (if needed)',
          'Performance check'
        ],
        benefits: [
          'Better engine protection',
          'Improved performance',
          'Extended engine life',
          'Better fuel efficiency'
        ],
        tips: 'Change oil every 3,000-5,000 km for optimal engine health'
      }
    },
    {
      name: 'Accident Repair',
      description: 'Complete accident damage repair',
      icon: <Hammer className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '1-7 days',
        price: '₹1,000 - ₹10,000+',
        includes: [
          'Damage assessment',
          'Body panel repair/replacement',
          'Paint matching and application',
          'Structural alignment',
          'Safety inspection'
        ],
        benefits: [
          'Restored appearance',
          'Maintained safety',
          'Preserved resale value',
          'Peace of mind'
        ],
        tips: 'Get professional assessment for all accident damage'
      }
    },
    {
      name: 'Electrical Checks',
      description: 'Comprehensive electrical system diagnosis',
      icon: <Cpu className="w-10 h-10 text-blue-600" />,
      details: {
        duration: '1-2 hours',
        price: '₹400 - ₹800',
        includes: [
          'Battery health check',
          'Charging system test',
          'Lighting system inspection',
          'Wiring harness check',
          'Electrical component testing'
        ],
        benefits: [
          'Reliable electrical system',
          'Prevents breakdowns',
          'Better safety',
          'Improved functionality'
        ],
        tips: 'Regular electrical checks prevent unexpected failures'
      }
    }
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Excellent service! My bike runs like new after the engine repair.',
      avatar: '👨‍🔧'
    },
    {
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Very professional and honest service. Highly recommended!',
      avatar: '👩‍💼'
    },
    {
      name: 'Mohan Singh',
      rating: 5,
      comment: 'Best bike service center in Thiruvallur. Fair pricing and quality work.',
      avatar: '👨‍🏭'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">VM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Venkateswara Motors</h1>
                <p className="text-sm text-slate-600">Professional Bike Service</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book Service
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Professional Bike Service Center
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Your Trusted
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Bike Service Partner
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-12 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Experience excellence in bike maintenance and repair services in Thiruvallur.
              We deliver quality, reliability, and customer satisfaction.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <Phone className="w-6 h-6 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Call us at</p>
                  <p className="font-semibold">9788021456</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <Phone className="w-6 h-6 text-blue-200" />
                <div>
                  <p className="text-sm text-blue-200">Alternative</p>
                  <p className="font-semibold">9677464451</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book Your Service
              </button>
              <button
                onClick={() => {
                  document.getElementById('services-section').scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur-sm"
              >
                View Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              Our Services
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
              Comprehensive
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Service Solutions
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              From routine maintenance to complex repairs, we provide expert bike service solutions
              tailored to your specific needs with precision and care.
            </p>
          </div>

          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2 bg-slate-100 p-2 rounded-2xl max-w-2xl mx-auto">
              {[
                { id: 'chassis', label: 'Chassis Jobs', icon: <Wrench className="w-5 h-5" /> },
                { id: 'engine', label: 'Engine Jobs', icon: <Settings className="w-5 h-5" /> },
                { id: 'other', label: 'Other Services', icon: <Hammer className="w-5 h-5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeTab === 'chassis' ? chassisServices :
              activeTab === 'engine' ? engineServices : otherServices).map((service, index) => (
                <div key={index} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-8 hover:border-blue-200 hover:-translate-y-2">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{service.description}</p>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedService(service)
                        setShowServiceModal(true)
                      }}
                      className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Learn More →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
                  About Us
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-slate-900 leading-tight">
                  Decades of
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                    Excellence
                  </span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  Venkateswara Motors has been serving the Thiruvallur community with dedication and expertise for over a decade.
                  We take pride in our commitment to providing high-quality bike service and maintenance solutions.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  Our team of skilled technicians uses genuine parts and follows manufacturer specifications to ensure
                  your bike receives the best care possible. We believe in building long-term relationships with our
                  customers through honest service, fair pricing, and exceptional workmanship.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                    <div className="text-slate-600">Years Experience</div>
                  </div>
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                    <div className="text-slate-600">Happy Customers</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white">
                  <div className="text-6xl mb-6 flex justify-center"><Bike className="w-16 h-16 text-white" /></div>
                  <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-3">
                      <Check className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm text-white" />
                      <span>Genuine Parts & Quality Service</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm text-white" />
                      <span>Experienced Technicians</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm text-white" />
                      <span>Fair Pricing & Transparency</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <Check className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm text-white" />
                      <span>Customer Satisfaction Guarantee</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
              Testimonials
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
              What Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center mb-6">
                  <div className="text-3xl mr-4"><User className="w-8 h-8 text-blue-600" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <div className="flex items-center mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-slate-600 leading-relaxed italic">
                  "{testimonial.comment}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                  Contact Us
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                  Get In
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                    Touch
                  </span>
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed mb-12">
                  Ready to give your bike the care it deserves? Contact us today for professional service and expert advice.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-slate-300">No. 151, J.N. Road, Near Head Post Office, Thiruvallur - 602 001</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone Numbers</h4>
                      <p className="text-slate-300">9788021456 / 9677464451</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-slate-300">venkateshwaramotors.trl@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Working Hours</h4>
                      <p className="text-slate-300">Mon–Sat: 9:30 a.m. to 7:00 p.m.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Quick Contact</h3>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Book Your Service Now
                </button>
                <p className="text-center text-slate-300 mt-4">
                  Get instant booking and professional service
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">VM</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Venkateswara Motors</h3>
                <p className="text-slate-400 text-sm">Professional Bike Service</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6">
              Your trusted bike service partner in Thiruvallur
            </p>
            <div className="border-t border-slate-800 pt-6">
              <p className="text-slate-500">
                © 2024 Venkateswara Motors. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Book Your Service</h2>
                <p className="text-slate-600 mt-1">Schedule your bike service appointment</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Contact Number</label>
                  <input
                    type="tel"
                    value={bookingForm.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    placeholder="Your phone number"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Vehicle Model</label>
                  <input
                    type="text"
                    value={bookingForm.vehicleModel}
                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    placeholder="e.g., Honda Activa, TVS Jupiter"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Registration Number</label>
                  <input
                    type="text"
                    value={bookingForm.regNo}
                    onChange={(e) => handleInputChange('regNo', e.target.value)}
                    placeholder="Vehicle registration number"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Preferred Date</label>
                  <input
                    type="date"
                    value={bookingForm.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Preferred Time</label>
                  <select
                    value={bookingForm.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select time</option>
                    {isLoadingTimings ? (
                      <option value="">Loading...</option>
                    ) : availableTimings.length === 0 ? (
                      <option value="">No timings available for this date.</option>
                    ) : (
                      availableTimings.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Service Type</label>
                <select
                  value={bookingForm.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select service type</option>
                  <option value="chassis">Chassis Jobs</option>
                  <option value="engine">Engine Jobs</option>
                  <option value="other">Other Services</option>
                  <option value="general">General Service</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-1'
                  } text-white`}
              >
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      {showServiceModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-blue-600">
                  {selectedService.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedService.name}</h2>
                  <p className="text-slate-600 mt-1">{selectedService.description}</p>
                </div>
              </div>
              <button
                onClick={() => setShowServiceModal(false)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Service Duration
                </h3>
                <p className="text-blue-800 font-medium">{selectedService.details.duration}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                  <span className="text-lg mr-2">₹</span>
                  Estimated Price
                </h3>
                <p className="text-green-800 font-medium">{selectedService.details.price}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  What's Included
                </h3>
                <ul className="space-y-2">
                  {selectedService.details.includes.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <span className="text-lg mr-2">✨</span>
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {selectedService.details.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center">
                  <span className="text-lg mr-2">💡</span>
                  Pro Tip
                </h3>
                <p className="text-amber-800">{selectedService.details.tips}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowServiceModal(false)
                  setShowModal(true)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book This Service Now
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  )
}

export default App
