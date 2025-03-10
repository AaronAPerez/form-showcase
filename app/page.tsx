import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Home page component
export default function HomePage() {
  // Different form types showcased in the app
  const formTypes = [
    {
      title: 'Basic Contact Form',
      description: 'A simple contact form with validation and error handling.',
      href: '/forms/basic',
      color: 'bg-blue-500',
    },
    {
      title: 'Multi-Step Form',
      description: 'A multi-page form with step navigation and state management.',
      href: '/forms/multi-step',
      color: 'bg-indigo-500',
    },
    {
      title: 'Dynamic Form Builder',
      description: 'Create custom forms with different field types dynamically.',
      href: '/forms/dynamic',
      color: 'bg-purple-500',
    },
    {
      title: 'File Upload Form',
      description: 'Upload files with drag and drop and progress tracking.',
      href: '/forms/file-upload',
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero section */}
      <div className="py-12 md:py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Form Showcase</span>
          <span className="block text-indigo-600">with Next.js and TypeScript</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 sm:max-w-3xl">
          A collection of modern, accessible form patterns implemented with React, 
          TypeScript, and Next.js using server-side validation and database integration.
        </p>
        <div className="mt-10 flex justify-center">
          <div className="rounded-md shadow">
            <a
              href="https://github.com/yourusername/form-showcase"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Form showcase section */}
      <div className="py-12">
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
              className="relative rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`h-2 ${form.color}`} />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{form.title}</h3>
                <p className="mt-3 text-gray-500">{form.description}</p>
                <div className="mt-6">
                  <Link href={form.href}>
                    <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                      View Example
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-12 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Built with Modern Technologies and Best Practices
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">NextJS App Router</h3>
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
  );
}