import Image from "next/image";
import { DownloadCTA } from "@/components/DownloadCTA";

export default function About() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 md:pb-24 bg-primary-gradient text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About EduMate GH
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Our mission is to transform education in Ghana through innovative technology and personalized learning.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20">
            <path fill="white" d="M1200 120L0 16.48V0h1200v120z"></path>
          </svg>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                EduMate GH was born from a deep understanding of the unique challenges facing education in Ghana. Our founder, who grew up in Zongo communities, experienced firsthand the barriers to quality education that many Ghanaian students face.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                In 2023, after seeing how AI technology was transforming industries worldwide, our team of educators and technologists came together with a vision: to harness the power of artificial intelligence to create a learning companion that could provide personalized, curriculum-aligned education to every student in Ghana, regardless of their location or resources.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Today, EduMate GH is helping thousands of students and teachers across Ghana to achieve better educational outcomes through technology that understands and adapts to their unique needs.
              </p>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/8422124/pexels-photo-8422124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Ghanaian students using EduMate GH"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-edumate-purple/10 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-edumate-indigo/10 rounded-full" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              To democratize access to quality education in Ghana by providing AI-powered, personalized learning tools that adapt to each student's needs, helping them achieve their full potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Accessibility",
                description: "Make quality education accessible to all Ghanaian students, regardless of location or economic background."
              },
              {
                title: "Personalization",
                description: "Deliver personalized learning experiences that adapt to each student's pace, style, and areas of difficulty."
              },
              {
                title: "Excellence",
                description: "Uphold the highest standards of educational content, aligned with Ghana's curriculum and international best practices."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 text-center"
              >
                <div className="w-12 h-12 bg-primary-gradient rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Impact */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "20,000+", label: "Active Students" },
              { number: "500+", label: "Schools" },
              { number: "1,000+", label: "Teachers" },
              { number: "16", label: "Regions Covered" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 text-center hover:shadow-xl transition-shadow"
              >
                <p className="text-4xl font-bold bg-clip-text text-transparent bg-primary-gradient mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Educational Outcomes</h3>
              <ul className="space-y-4">
                {[
                  "Average grade improvement of 23% for students using EduMate GH regularly",
                  "85% of teachers report saving at least 5 hours per week on lesson planning",
                  "92% of students show improved engagement with learning materials",
                  "Increased enrollment in STEM subjects among female students"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-3 mt-1 bg-primary-gradient rounded-full p-0.5">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4">Community Impact</h3>
              <ul className="space-y-4">
                {[
                  "Partnerships with 50+ schools in underserved Zongo communities",
                  "Scholarship program supporting 200 high-achieving students annually",
                  "Teacher training initiatives reaching over 500 educators",
                  "Technology access programs providing tablets to rural schools"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-3 mt-1 bg-primary-gradient rounded-full p-0.5">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Kwame Ansah",
                role: "Founder & CEO",
                bio: "Former educator with 10+ years experience in Ghana's education system",
                image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              },
              {
                name: "Abena Darko",
                role: "Chief Education Officer",
                bio: "Curriculum development specialist with expertise in educational psychology",
                image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              },
              {
                name: "Kofi Mensah",
                role: "CTO",
                bio: "AI specialist with a passion for using technology to solve educational challenges",
                image: "https://images.pexels.com/photos/2406949/pexels-photo-2406949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              },
              {
                name: "Ama Boateng",
                role: "Head of Partnerships",
                bio: "Working with schools and organizations to expand EduMate GH's reach",
                image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
            ].map((member, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700"
              >
                <div className="h-48 relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-edumate-purple dark:text-edumate-indigo font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <DownloadCTA />
        </div>
      </section>
    </>
  );
}