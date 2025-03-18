import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-primary-600 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Meal Planner</h1>
            <div className="flex space-x-4">
              <Link 
                href="/login" 
                className="bg-white py-2 px-4 rounded-md text-primary-600 font-medium hover:bg-gray-100 transition-colors w-28 text-center"
              >
                Log In
              </Link>
              <Link 
                href="/signup" 
                className="bg-primary-800 py-2 px-4 rounded-md text-white font-medium hover:bg-primary-700 transition-colors w-28 text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Smart Meal Planning, <br className="hidden sm:block" />Simplified Grocery Shopping
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Use AI to plan your meals, generate dynamic grocery lists, track pantry inventory, and optimize your shopping experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/dashboard" 
                className="bg-primary-600 py-3 px-6 rounded-md text-white font-medium hover:bg-primary-500 transition-colors text-center flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <span>Try Demo</span>
                <span className="bg-yellow-400 text-xs px-2 py-1 rounded-full text-gray-800 font-bold">No Login Required</span>
              </Link>
              <Link 
                href="/learn-more" 
                className="bg-white border border-gray-300 py-3 px-6 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center w-full sm:w-auto"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="bg-gray-200 rounded-xl p-8 h-96 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Meal planner calendar illustration</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100 py-10 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'AI-Powered Meal Planning',
                description: 'Get personalized meal suggestions based on your preferences, dietary needs, and pantry inventory.'
              },
              {
                title: 'Smart Grocery Lists',
                description: 'Automatically generate shopping lists organized by store layout for maximum efficiency.'
              },
              {
                title: 'Collaborative Family Access',
                description: 'Share meal plans and grocery lists with family members in real-time.'
              },
              {
                title: 'Pantry Inventory Tracking',
                description: 'Keep track of what you have and receive alerts for items nearing expiration.'
              },
              {
                title: 'Price Comparison',
                description: 'Find the best deals across multiple stores to save on your grocery bill.'
              },
              {
                title: 'Barcode Scanning',
                description: 'Quickly add or remove items from your inventory with simple barcode scanning.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 text-white py-10 sm:py-16">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to transform your meal planning?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8">Join thousands of families who are saving time, reducing food waste, and enjoying stress-free meal planning.</p>
          <Link 
            href="/signup" 
            className="bg-white py-3 px-8 rounded-md text-primary-700 font-medium hover:bg-gray-100 transition-colors inline-block w-full sm:w-auto"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AI Meal Planner</h3>
              <p className="text-gray-400">Simplifying meal planning and grocery shopping with the power of AI.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Meal Planning</li>
                <li>Grocery Lists</li>
                <li>Pantry Tracking</li>
                <li>Shopping Optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Blog</li>
                <li>Recipes</li>
                <li>Support</li>
                <li>API Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AI Meal Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}