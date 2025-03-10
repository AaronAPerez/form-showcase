import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Form Showcase - Modern Form Examples with Next.js',
  description: 'A showcase of accessible form patterns built with Next.js, React, TypeScript, and best practices',
};

// Home page component
export default function HomePage() {
  // Different form types showcased in the app
  const formTypes = [
    {
      title: 'Basic Contact Form',
      description: 'A simple contact form with validation and error handling. Demonstrates proper form validation, ARIA attributes, and accessibility best practices.',
      href: '/forms/basic',
      gradientClass: 'from-blue-500 to-blue-600',
      iconPath: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Multi-Step Form',
      description: 'A multi-page form with step navigation and state management. Features keyboard navigation between steps, focus management, and clear announcements for screen readers.',
      href: '/forms/multi-step',
      gradientClass: 'from-indigo-500 to-indigo-600',
      iconPath: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: 'Dynamic Form Builder',
      description: 'Create custom forms with different field types dynamically. Includes accessibility features for form configuration and generation of accessible form elements.',
      href: '/forms/dynamic',
      gradientClass: 'from-purple-500 to-purple-600',
      iconPath: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      title: 'File Upload Form',
      description: 'Upload files with drag and drop and progress tracking. Features keyboard accessible drag-and-drop, progress announcements, and comprehensive validation feedback.',
      href: '/forms/file-upload',
      gradientClass: 'from-pink-500 to-pink-600',
      iconPath: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-2 focus:bg-indigo-600 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-blue-50 -z-10" />

      {/* Decorative elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-blue-300 rounded-full blur-3xl opacity-20 -z-10" aria-hidden="true" />
      <div className="fixed bottom-20 left-20 w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-20 -z-10" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero section with asymmetric grid */}
        <div id="main-content" className="grid grid-cols-1 gap-8 items-center py-10">
          <div className="lg:col-span-3 space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Form Showcase</span>
              <span className="block mt-2">with Next.js & TypeScript</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              A collection of modern, accessible form patterns with a focus on user experience, accessibility, and clean design.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/AaronAPerez/form-showcase"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-medium transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
              <a
                href="#examples"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-indigo-700 border border-indigo-200 font-medium transition-all hover:bg-indigo-50 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Explore Examples
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
          {/* <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-2xl transform rotate-3 blur-sm" aria-hidden="true"></div>
              <div className="relative bg-white backdrop-blur-sm bg-white/80 border border-white/50 p-6 rounded-xl shadow-xl">
                <h3 className="font-semibold text-lg mb-4">Try it out</h3>
                {/* Mini form example 
                <form className="space-y-4" action="#" aria-label="Example form preview">
                  <div className="space-y-1">
                    <label htmlFor="preview-email" className="text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      id="preview-email"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                      placeholder="your@email.com" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="preview-message" className="text-sm font-medium text-gray-700">Message</label>
                    <textarea 
                      id="preview-message"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                      placeholder="Your message..." 
                      rows={3}
                    ></textarea>
                  </div>
                  <button 
                    type="button" 
                    className="w-full rounded-lg bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Send Message
                  </button>
                </form>
              </div> 
            </div>
          </div>*/}
        </div>

        {/* Form showcase section */}
        <div className="py-12" id="examples">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Explore Form Examples
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Choose any of the form implementations below to see it in action
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {formTypes.map((form) => (
              <div
                key={form.title}
                className="stagger-item relative rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${form.gradientClass}`} aria-hidden="true" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 transition-opacity" aria-hidden="true" />

                <div className="relative p-8">
                  <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br ${form.gradientClass} text-white`} aria-hidden="true">
                    {form.iconPath}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{form.title}</h3>
                  <p className="text-gray-600 mb-6">{form.description}</p>
                  <Link href={form.href}>
                    <span className="px-5 py-2 rounded-lg bg-white border border-gray-200 text-indigo-700 font-medium transition-all hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md inline-block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      View Example
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features section */}
        <div className="py-12 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-12 rounded-lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Built with Modern Technologies and Accessibility in Mind
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Next.js App Router</h3>
                <p className="text-gray-600">
                  Utilizing the latest Next.js App Router for optimal routing and server components.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">TypeScript</h3>
                <p className="text-gray-600">
                  Fully typed application with TypeScript for better developer experience and code quality.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Neon Serverless Postgres</h3>
                <p className="text-gray-600">
                  Database integration with Neon&apos;s serverless Postgres for scalable data storage.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Zod Validation</h3>
                <p className="text-gray-600">
                  Type-safe schema validation with Zod for both client and server form validation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">React Hook Form</h3>
                <p className="text-gray-600">
                  Performant form handling with React Hook Form for controlled inputs and validations.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">ARIA Compliant</h3>
                <p className="text-gray-600">
                  Accessible form components with proper ARIA attributes and keyboard navigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}