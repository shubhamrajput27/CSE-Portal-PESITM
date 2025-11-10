import { useState } from 'react'
import AnimatedSection from '../components/AnimatedSection'
import { Target, Eye, Award, X } from 'lucide-react'

const About = () => {
  const [showHODModal, setShowHODModal] = useState(false)
  const [showVisionModal, setShowVisionModal] = useState(false)
  const [showMissionModal, setShowMissionModal] = useState(false)
  const [showPEOModal, setShowPEOModal] = useState(false)
  const [showPSOModal, setShowPSOModal] = useState(false)
  
  const programOutcomes = [
    'Apply knowledge of mathematics, science, and engineering',
    'Design and conduct experiments, analyze and interpret data',
    'Design systems to meet desired needs within realistic constraints',
    'Function effectively on multi-disciplinary teams',
    'Identify, formulate, and solve engineering problems',
    'Understand professional and ethical responsibility',
  ]
  
  const hodMessage = `Dear Students,

Welcome to the Department of Computer Science & Engineering at PESITM!

It gives me immense pleasure to lead a department that has been at the forefront of technological innovation and academic excellence since its inception in 2007. Our mission is not just to impart knowledge but to nurture future leaders who will shape the digital world.

The field of Computer Science is evolving at an unprecedented pace. From Artificial Intelligence and Machine Learning to Cybersecurity and Cloud Computing, the opportunities are boundless. Our curriculum is designed to keep pace with these advancements while building strong fundamentals that will serve you throughout your career.

I encourage each one of you to make the most of the state-of-the-art facilities, experienced faculty, and industry collaborations we offer. Participate actively in research projects, coding competitions, and technical workshops. Remember, your success is our success.

As you embark on this exciting journey, always stay curious, embrace challenges, and never stop learning. The future belongs to those who innovate and adapt.

Wishing you all the very best in your academic pursuits!

Warm regards,
Dr. Prasanna Kumar H R
Professor & Head of Department
Computer Science & Engineering`

  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-pesitm-blue to-blue-900 text-white py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About CSE Department</h1>
            <p className="text-xl text-gray-200">Excellence in Computing Education</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          <AnimatedSection>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The Department of Computer Science & Engineering was established in 2007 and aimed to fulfil 
                the demands of the software industry. The department offers high-quality technical education 
                to its students with the help of its state-of-the-art computing facilities and by keeping pace 
                with the latest technological developments.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Computer Science and Engineering course integrates principles from computer science, covering 
                programming, data structures, algorithms, computer architecture, and software development. It 
                also includes advanced topics like AI, cybersecurity, and networking, preparing students for 
                diverse careers in technology.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The students undergo in-house training, which includes advanced, skill enhancement and industrial 
                training, bridging the gap between industry and academia.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The Computer Science & Engineering program is accredited by the National Board of Accreditation (NBA) 
                for three years from 2024 to 2027.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Vision, Mission, PEO & PSO */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedSection>
              <div 
                className="card bg-white text-center h-full cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowVisionModal(true)}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-pesitm-blue rounded-full">
                    <Eye size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue mb-4">Vision</h3>
                <p className="text-gray-700 text-sm">
                  To be a leader in providing education with skilled technical knowledge imbibing professional ethics.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div 
                className="card bg-white text-center h-full cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowMissionModal(true)}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-pesitm-blue rounded-full">
                    <Target size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue mb-4">Mission</h3>
                <p className="text-gray-700 text-sm">
                  Imparting quality education and empowering students for successful careers.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div 
                className="card bg-white text-center h-full cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowPEOModal(true)}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-pesitm-blue rounded-full">
                    <Award size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue mb-4">PEO's</h3>
                <p className="text-gray-700 text-sm">
                  Program Educational Objectives defining graduate capabilities.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div 
                className="card bg-white text-center h-full cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowPSOModal(true)}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-pesitm-blue rounded-full">
                    <Award size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue mb-4">PSO's</h3>
                <p className="text-gray-700 text-sm">
                  Program Specific Outcomes for engineering graduates.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Salient Features */}
      <section className="py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-heading text-center mb-12">Salient Features</h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatedSection>
              <div className="prose max-w-none">
                <ul className="list-disc space-y-4 text-lg text-gray-700">
                  <li>
                    Equipped with advanced infrastructure and computing facilities to support practical learning, 
                    including laboratories that enhance students' practical expertise.
                  </li>
                  <li>
                    Industry Collaboration: MoUs with Haegl Technologies and Sulonya Technologies have led to 
                    the establishment of a Centre of Excellence in Data Science on campus, along with regular 
                    technical talks and workshops.
                  </li>
                  <li>
                    Regular workshops and short-term training programs (STTPs) are conducted.
                  </li>
                  <li>
                    Active interaction between students and professors enriches the educational experience.
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Department Head */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-heading text-center mb-12">Head of Department</h2>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div 
                className="card bg-white flex flex-col md:flex-row items-center gap-8 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowHODModal(true)}
              >
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  <img 
                    src="/hod.jpg" 
                    alt="Dr. Prasanna Kumar H R" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-pesitm-blue mb-2">Dr. Prasanna Kumar H R</h3>
                  <p className="text-lg text-gray-600 mb-4">Professor & Head of Department</p>
                  <p className="text-gray-700 leading-relaxed">
                    Dr. Prasanna Kumar H R brings extensive experience in computer science education and research. 
                    Under his leadership, the department has achieved significant milestones in academic 
                    excellence, research publications, and industry collaborations.
                  </p>
                  <p className="text-sm text-pesitm-blue font-semibold mt-4">Click to read message from HOD →</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* PEO Modal */}
      {showPEOModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPEOModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-pesitm-blue to-blue-900 text-white p-6 rounded-t-lg flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Program Educational Objectives (PEO's)</h2>
                <p className="text-sm text-gray-200 mt-1">Computer Science & Engineering</p>
              </div>
              <button 
                onClick={() => setShowPEOModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pesitm-blue rounded-full">
                  <Award size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue">PROGRAM EDUCATIONAL OBJECTIVES (PEO's)</h3>
              </div>
              
              <p className="text-lg text-gray-700 mb-6 font-semibold">Graduates of the programme would have</p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-pesitm-blue">
                  <div className="flex gap-4">
                    <span className="text-2xl font-bold text-pesitm-blue flex-shrink-0">PEO1:</span>
                    <p className="text-lg text-gray-700 leading-relaxed flex-1">
                      The ability to conceptualize, analyze, design and develop IT solutions of varying complexities by leveraging advances in computer technology.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-pesitm-blue">
                  <div className="flex gap-4">
                    <span className="text-2xl font-bold text-pesitm-blue flex-shrink-0">PEO2:</span>
                    <p className="text-lg text-gray-700 leading-relaxed flex-1">
                      The ability to apply standard practices and strategies in software project development and management using industry-wide bench marked frameworks to deliver a sustainable quality product.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-pesitm-blue">
                  <div className="flex gap-4">
                    <span className="text-2xl font-bold text-pesitm-blue flex-shrink-0">PEO3:</span>
                    <p className="text-lg text-gray-700 leading-relaxed flex-1">
                      The ability to work as a team player in cross-cultural environment adhering to the work ethics with a passion for entrepreneurship and a zest for higher studies.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowPEOModal(false)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PSO Modal */}
      {showPSOModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPSOModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-pesitm-blue to-blue-900 text-white p-6 rounded-t-lg flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Program Specific Outcomes (PSO's)</h2>
                <p className="text-sm text-gray-200 mt-1">Computer Science & Engineering</p>
              </div>
              <button 
                onClick={() => setShowPSOModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pesitm-blue rounded-full">
                  <Award size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue">PROGRAM SPECIFIC OUTCOMES (PSO's)</h3>
              </div>
              
              <p className="text-lg text-gray-700 mb-6 font-semibold">Engineering graduates will be able to</p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-pesitm-blue">
                  <div className="flex gap-4">
                    <span className="text-2xl font-bold text-pesitm-blue flex-shrink-0">PSO1:</span>
                    <p className="text-lg text-gray-700 leading-relaxed flex-1">
                      Interpret the fundamental concepts and methodologies of Computer Systems.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-pesitm-blue">
                  <div className="flex gap-4">
                    <span className="text-2xl font-bold text-pesitm-blue flex-shrink-0">PSO2:</span>
                    <p className="text-lg text-gray-700 leading-relaxed flex-1">
                      Apply the mathematical concepts to crack problems using suitable mathematical analysis, Data structures and Algorithms.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-pesitm-blue">
                  <div className="flex gap-4">
                    <span className="text-2xl font-bold text-pesitm-blue flex-shrink-0">PSO3:</span>
                    <p className="text-lg text-gray-700 leading-relaxed flex-1">
                      Develop ability to grasp the Software Development Life Cycle and methodologies of Software Systems. Possess competent skills and knowledge of software design process. Familiarity and practical proficiency with a broad area of programming concepts and provide new ideas and innovation towards research.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowPSOModal(false)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vision Modal */}
      {showVisionModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVisionModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-pesitm-blue to-blue-900 text-white p-6 rounded-t-lg flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Department Vision</h2>
                <p className="text-sm text-gray-200 mt-1">Computer Science & Engineering</p>
              </div>
              <button 
                onClick={() => setShowVisionModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pesitm-blue rounded-full">
                  <Eye size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue">DEPARTMENT VISION</h3>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-lg border-l-4 border-pesitm-blue">
                <p className="text-xl text-gray-700 leading-relaxed text-center">
                  To be a leader in providing education with skilled technical knowledge imbibing professional ethics to the students in the field of Computer Science and Engineering.
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowVisionModal(false)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mission Modal */}
      {showMissionModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowMissionModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-pesitm-blue to-blue-900 text-white p-6 rounded-t-lg flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Department Mission</h2>
                <p className="text-sm text-gray-200 mt-1">Computer Science & Engineering</p>
              </div>
              <button 
                onClick={() => setShowMissionModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pesitm-blue rounded-full">
                  <Target size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue">DEPARTMENT MISSION</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-pesitm-blue">
                  <div className="flex gap-4">
                    <span className="text-2xl font-bold text-pesitm-blue flex-shrink-0">M1</span>
                    <p className="text-lg text-gray-700 leading-relaxed flex-1">
                      Imparting quality education to students by ensuring a learning environment through qualified faculty and good infrastructure.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-pesitm-blue">
                  <div className="flex gap-4">
                    <span className="text-2xl font-bold text-pesitm-blue flex-shrink-0">M2</span>
                    <p className="text-lg text-gray-700 leading-relaxed flex-1">
                      Empower students to attain strong technical and ethical skills for a successful career in industry, academics, research and entrepreneurship through active engagement with all the stakeholders.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowMissionModal(false)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOD Message Modal */}
      {showHODModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowHODModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-pesitm-blue to-blue-900 text-white p-6 rounded-t-lg flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Message from HOD</h2>
                <p className="text-sm text-gray-200 mt-1">Dr. Prasanna Kumar H R</p>
              </div>
              <button 
                onClick={() => setShowHODModal(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden mx-auto md:mx-0">
                  <img 
                    src="/hod.jpg" 
                    alt="Dr. Prasanna Kumar H R" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-pesitm-blue mb-1">Dr. Prasanna Kumar H R</h3>
                  <p className="text-gray-600 mb-2">Professor & Head of Department</p>
                  <p className="text-sm text-gray-500">Computer Science & Engineering</p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {hodMessage}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowHODModal(false)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default About
