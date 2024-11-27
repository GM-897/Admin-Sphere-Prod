// app/about/page.js
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0">
          {/* <Image
            src="/images/about-hero.jpg"
            alt="About Us"
            layout="fill"
            objectFit="cover"
            className="opacity-70"
          /> */}
        </div>
        <div className="relative max-w-7xl mx-auto py-32 px-6 sm:py-40 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            About Admin-Sphere
          </h1>
          <p className="mt-6 text-xl text-gray-700 max-w-2xl mx-auto">
            Streamlining Role-Based Access Control (RBAC) with Efficiency and Security
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Who We Are</h2>
            <p className="text-gray-600">
              Admin-Sphere-Prod is a cutting-edge administrative dashboard designed to simplify and enhance the management of users, roles, and permissions within an organization. Leveraging modern web technologies, our platform ensures that administrators can assign roles, define permissions, and oversee user statuses seamlessly and securely.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              title="User Management"
              description="Easily add, edit, and remove users while assigning appropriate roles and statuses."
              icon="👤"
            />
            <FeatureCard
              title="Role Management"
              description="Define and customize roles with specific permissions to suit your organization's needs."
              icon="🔧"
            />
            <FeatureCard
              title="Permission Control"
              description="Granular control over what each role can access and modify within the system."
              icon="🔒"
            />
            <FeatureCard
              title="Secure Authentication"
              description="Robust login system with password protection and secure session management."
              icon="🔑"
            />
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              Our mission is to provide organizations with a powerful and intuitive RBAC system that enhances security, simplifies user management, and ensures that the right individuals have the right access at the right time. We are committed to continuous innovation and excellence to meet the evolving needs of our clients.
            </p>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How to Use Admin-Sphere-Prod</h2>
            <p className="text-gray-600">
              Admin-Sphere-Prod is designed to be user-friendly and efficient. Follow the steps below to get started:
            </p>
          </div>

          {/* Usage Steps */}
          <div className="space-y-8">
            <UsageStep
              stepNumber={1}
              title="Log In"
              description="Access the dashboard by logging in with your administrator credentials. Ensure that you have the necessary permissions to manage users and roles."
            />
            <UsageStep
              stepNumber={2}
              title="Manage Users"
              description="Navigate to the Users section to view all registered users. You can add new users, edit existing user details, or delete users as needed."
            />
            <UsageStep
              stepNumber={3}
              title="Define Roles"
              description="Go to the Roles section to create new roles or modify existing ones. Assign specific permissions to each role to control access levels within the system."
            />
            <UsageStep
              stepNumber={4}
              title="Assign Roles to Users"
              description="In the Users section, assign appropriate roles to each user. This determines the permissions and access rights they have within the platform."
            />
            <UsageStep
              stepNumber={5}
              title="Monitor and Audit"
              description="Use the monitoring tools to oversee user activities and ensure compliance with your organization's security policies."
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">Need Assistance?</h3>
          <p className="text-gray-200 mb-6">
            Our support team is here to help you with any questions or issues you may encounter while using Admin-Sphere-Prod.
          </p>
          <a
            href="#"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}

// FeatureCard Component
function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// UsageStep Component
function UsageStep({ stepNumber, title, description }) {
  return (
    <div className="flex flex-col md:flex-row items-start">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white font-bold">
          {stepNumber}
        </div>
      </div>
      <div className="mt-4 md:mt-0 md:ml-6">
        <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  );
}