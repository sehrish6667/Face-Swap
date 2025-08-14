"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import {
  Upload,
  Zap,
  Download,
  Play,
  Star,
  Users,
  Clock,
  Shield,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadedImage {
  file: File
  preview: string
}

export default function Component() {
  const [sourceImage, setSourceImage] = useState<UploadedImage | null>(null)
  const [targetImage, setTargetImage] = useState<UploadedImage | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [signInForm, setSignInForm] = useState({ email: "", password: "" })
  const [signInLoading, setSignInLoading] = useState(false)
  const [showGetStartedModal, setShowGetStartedModal] = useState(false)
  const [getStartedForm, setGetStartedForm] = useState({ name: "", email: "" })
  const [getStartedLoading, setGetStartedLoading] = useState(false)

  const sourceInputRef = useRef<HTMLInputElement>(null)
  const targetInputRef = useRef<HTMLInputElement>(null)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false) // Close mobile menu after clicking
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "Please upload a valid image file (JPG, PNG, GIF, etc.)"
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return "File size must be less than 10MB"
    }

    return null
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "source" | "target") => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(null)

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      const uploadedImage: UploadedImage = { file, preview }

      if (type === "source") {
        setSourceImage(uploadedImage)
      } else {
        setTargetImage(uploadedImage)
      }

      setSuccess(`${type === "source" ? "Source" : "Target"} image uploaded successfully!`)
    }

    reader.onerror = () => {
      setError("Failed to read the image file. Please try again.")
    }

    reader.readAsDataURL(file)
  }

  const handleFaceSwap = async () => {
    if (!sourceImage || !targetImage) {
      setError("Please upload both source and target images")
      return
    }

    setIsProcessing(true)
    setError(null)
    setSuccess(null)
    setProgress(0)

    try {
      // Simulate AI processing with progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 3000))

      clearInterval(progressInterval)
      setProgress(100)

      // In a real implementation, you would send the images to your AI service here
      // For demo purposes, we'll use a placeholder result
      setResult("/placeholder.svg?height=400&width=400")
      setSuccess("Face swap completed successfully!")
    } catch (err) {
      setError("Failed to process images. Please try again.")
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const handleDownload = () => {
    if (!result) return

    // In a real implementation, this would download the actual result image
    const link = document.createElement("a")
    link.href = result
    link.download = "magicswap-result.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setSuccess("Image downloaded successfully!")
  }

  const clearImages = () => {
    setSourceImage(null)
    setTargetImage(null)
    setResult(null)
    setError(null)
    setSuccess(null)
    if (sourceInputRef.current) sourceInputRef.current.value = ""
    if (targetInputRef.current) targetInputRef.current.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, type: "source" | "target") => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const mockEvent = {
        target: { files: [file] },
      } as React.ChangeEvent<HTMLInputElement>
      handleImageUpload(mockEvent, type)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignInLoading(true)
    setError(null)

    try {
      // Simulate sign-in process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would validate credentials here
      if (signInForm.email && signInForm.password) {
        setSuccess("Successfully signed in!")
        setShowSignInModal(false)
        setSignInForm({ email: "", password: "" })
      } else {
        setError("Please fill in all fields")
      }
    } catch (err) {
      setError("Sign in failed. Please try again.")
    } finally {
      setSignInLoading(false)
    }
  }

  const handleGetStarted = () => {
    // Scroll to the face swap interface
    const faceSwapSection = document.getElementById("face-swap-interface")
    if (faceSwapSection) {
      faceSwapSection.scrollIntoView({ behavior: "smooth" })
    }
    setSuccess("Welcome! Start by uploading your images below.")
  }

  const handleGetStartedSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setGetStartedLoading(true)
    setError(null)

    try {
      // Simulate sign-up process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (getStartedForm.name && getStartedForm.email) {
        setSuccess(`Welcome ${getStartedForm.name}! You can now start using Magicswap AI.`)
        setShowGetStartedModal(false)
        setGetStartedForm({ name: "", email: "" })

        // Scroll to face swap interface after signup
        setTimeout(() => {
          const faceSwapSection = document.getElementById("face-swap-interface")
          if (faceSwapSection) {
            faceSwapSection.scrollIntoView({ behavior: "smooth" })
          }
        }, 1000)
      } else {
        setError("Please fill in all fields")
      }
    } catch (err) {
      setError("Sign up failed. Please try again.")
    } finally {
      setGetStartedLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Magicswap AI
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                About
              </button>
              <Button variant="outline" size="sm" onClick={() => setShowSignInModal(true)}>
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600"
                onClick={() => setShowGetStartedModal(true)}
              >
                Get Started
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <nav className="flex flex-col space-y-4 pt-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-600 hover:text-purple-600 transition-colors text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-gray-600 hover:text-purple-600 transition-colors text-left"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-600 hover:text-purple-600 transition-colors text-left"
                >
                  About
                </button>
                <div className="flex flex-col space-y-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setShowSignInModal(true)}>
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                    onClick={() => setShowGetStartedModal(true)}
                  >
                    Get Started
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">🎉 Free Face Swap Tool</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Face Swap Free
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Swap faces in photos instantly with our advanced AI technology. Upload your images and get professional
            results in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10M+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>3 Seconds Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>100% Safe & Secure</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="max-w-2xl mx-auto mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="max-w-2xl mx-auto mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Face Swap Interface */}
        <div id="face-swap-interface" className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Source Image Upload */}
            <Card className="border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-purple-700">Source Face</h3>
                  <p className="text-sm text-gray-500 mb-4">Upload the face you want to use</p>
                  {sourceImage ? (
                    <div className="relative">
                      <Image
                        src={sourceImage.preview || "/placeholder.svg"}
                        alt="Source"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSourceImage(null)
                          if (sourceInputRef.current) sourceInputRef.current.value = ""
                        }}
                      >
                        ✕
                      </Button>
                      <div className="mt-2 text-xs text-gray-500">
                        {sourceImage.file.name} ({(sourceImage.file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-400 transition-colors cursor-pointer"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "source")}
                      onClick={() => sourceInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 mb-1">Click to upload or drag & drop</span>
                      <span className="text-xs text-gray-400">JPG, PNG, GIF (max 10MB)</span>
                    </div>
                  )}
                  <input
                    ref={sourceInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "source")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Process Button */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <Button
                onClick={handleFaceSwap}
                disabled={!sourceImage || !targetImage || isProcessing}
                className="w-full lg:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Swap Faces
                  </div>
                )}
              </Button>

              {isProcessing && (
                <div className="w-full max-w-xs">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">{progress}% Complete</p>
                </div>
              )}

              {(sourceImage || targetImage) && (
                <Button variant="outline" size="sm" onClick={clearImages} className="text-gray-500 hover:text-gray-700">
                  Clear All
                </Button>
              )}
            </div>

            {/* Target Image Upload */}
            <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-blue-700">Target Photo</h3>
                  <p className="text-sm text-gray-500 mb-4">Upload the photo to swap face into</p>
                  {targetImage ? (
                    <div className="relative">
                      <Image
                        src={targetImage.preview || "/placeholder.svg"}
                        alt="Target"
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setTargetImage(null)
                          if (targetInputRef.current) targetInputRef.current.value = ""
                        }}
                      >
                        ✕
                      </Button>
                      <div className="mt-2 text-xs text-gray-500">
                        {targetImage.file.name} ({(targetImage.file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 transition-colors cursor-pointer"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, "target")}
                      onClick={() => targetInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 mb-1">Click to upload or drag & drop</span>
                      <span className="text-xs text-gray-400">JPG, PNG, GIF (max 10MB)</span>
                    </div>
                  )}
                  <input
                    ref={targetInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "target")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Result */}
          {result && (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-4 text-green-700">✨ Result</h3>
                  <Image
                    src={result || "/placeholder.svg"}
                    alt="Face swap result"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover rounded-lg mb-4 shadow-lg"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1 bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download Result
                    </Button>
                    <Button variant="outline" onClick={() => setResult(null)} className="px-4">
                      ✕
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Face Swap AI?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the most advanced face swapping technology with professional results in seconds.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Get your face swap results in just 3 seconds with our optimized AI engine.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality</h3>
              <p className="text-gray-600">Professional-grade results with natural-looking face swaps every time.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Safe</h3>
              <p className="text-gray-600">Your images are processed securely and deleted automatically after use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for you. Start free and upgrade as you grow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200 hover:border-purple-300 transition-colors">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Free</h3>
                  <div className="text-3xl font-bold mb-4">
                    $0<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">Perfect for trying out our AI face swap technology</p>
                  <ul className="space-y-3 mb-6 text-left">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>5 face swaps per day</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Standard quality</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Basic support</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Get Started Free
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-purple-500 hover:border-purple-600 transition-colors relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                Most Popular
              </Badge>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Pro</h3>
                  <div className="text-3xl font-bold mb-4">
                    $9<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">For creators and professionals who need more</p>
                  <ul className="space-y-3 mb-6 text-left">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Unlimited face swaps</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>HD quality results</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>No watermarks</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Batch processing</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">Upgrade to Pro</Button>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200 hover:border-purple-300 transition-colors">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold mb-4">
                    $49<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">For teams and businesses with advanced needs</p>
                  <ul className="space-y-3 mb-6 text-left">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>API access</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>24/7 support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Team management</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About Magicswap AI</h2>
              <p className="text-xl text-gray-600">Pioneering the future of AI-powered face swapping technology</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-6">
                  At Magicswap AI, we're dedicated to making advanced AI technology accessible to everyone. Our
                  cutting-edge face swap technology combines state-of-the-art machine learning with an intuitive user
                  experience.
                </p>
                <h3 className="text-2xl font-semibold mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Industry-leading AI technology</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Privacy-first approach</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Continuous innovation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="About Magicswap AI"
                  width={400}
                  height={400}
                  className="rounded-lg shadow-lg mx-auto"
                />
              </div>
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-semibold mb-4">Trusted by Millions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600">10M+</div>
                  <div className="text-gray-600">Users Worldwide</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">50M+</div>
                  <div className="text-gray-600">Face Swaps Created</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">4.9/5</div>
                  <div className="text-gray-600">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Try Face Swap AI?</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join millions of users who trust our AI technology for their face swapping needs.
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={handleGetStarted}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Face Swapping Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Magicswap AI</span>
              </div>
              <p className="text-gray-400">The most advanced AI face swap technology for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">
                    Face Swap
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <button onClick={() => scrollToSection("pricing")} className="hover:text-white transition-colors">
                    Pricing
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors">
                    About
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Magicswap AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSignInModal(false)
                  setSignInForm({ email: "", password: "" })
                  setError(null)
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your email"
                  value={signInForm.email}
                  onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your password"
                  value={signInForm.password}
                  onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-500">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={signInLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
              >
                {signInLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
                    Sign up
                  </a>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Get Started Modal */}
      {showGetStartedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Get Started with Magicswap AI</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowGetStartedModal(false)
                  setGetStartedForm({ name: "", email: "" })
                  setError(null)
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Join thousands of users creating amazing face swaps with our AI technology.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No watermarks</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>HD quality</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleGetStartedSignup} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your full name"
                  value={getStartedForm.name}
                  onChange={(e) => setGetStartedForm({ ...getStartedForm, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email-signup"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your email"
                  value={getStartedForm.email}
                  onChange={(e) => setGetStartedForm({ ...getStartedForm, email: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                disabled={getStartedLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
              >
                {getStartedLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Free Account"
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleGetStarted}
                  className="text-purple-600 hover:text-purple-500 font-medium"
                >
                  Skip and try now →
                </Button>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setShowGetStartedModal(false)
                      setShowSignInModal(true)
                    }}
                    className="text-purple-600 hover:text-purple-500 font-medium"
                  >
                    Sign in
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
