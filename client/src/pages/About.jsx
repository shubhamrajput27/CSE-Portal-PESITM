import AnimatedSection from '../components/AnimatedSection'
import { Target, Eye, Award } from 'lucide-react'

const About = () => {
  const programOutcomes = [
    'Apply knowledge of mathematics, science, and engineering',
    'Design and conduct experiments, analyze and interpret data',
    'Design systems to meet desired needs within realistic constraints',
    'Function effectively on multi-disciplinary teams',
    'Identify, formulate, and solve engineering problems',
    'Understand professional and ethical responsibility',
  ]

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
                The Department of Computer Science & Engineering at PES Institute of Technology 
                and Management, Shivamogga, was established with the vision of providing quality 
                education in computing and preparing students for successful careers in the IT industry 
                and research.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our department is committed to fostering innovation, critical thinking, and problem-solving 
                skills among students. With state-of-the-art infrastructure, experienced faculty, and 
                industry collaborations, we provide a holistic learning environment that bridges the gap 
                between academic knowledge and industry requirements.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The department is affiliated to <strong>Visvesvaraya Technological University (VTU), Belagavi</strong>, 
                and offers undergraduate programs in Computer Science & Engineering.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="card bg-white text-center h-full">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-pesitm-blue rounded-full">
                    <Eye size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue mb-4">Vision</h3>
                <p className="text-gray-700">
                  To be a center of excellence in computer science education and research, 
                  producing skilled professionals who contribute to technological advancement 
                  and societal development.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="card bg-white text-center h-full">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-pesitm-blue rounded-full">
                    <Target size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue mb-4">Mission</h3>
                <p className="text-gray-700">
                  To provide quality education through innovative teaching methodologies, 
                  foster research culture, promote industry-academia collaboration, and 
                  develop ethical professionals ready for global challenges.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="card bg-white text-center h-full">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-pesitm-blue rounded-full">
                    <Award size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-pesitm-blue mb-4">Core Values</h3>
                <p className="text-gray-700">
                  Excellence in education, integrity in conduct, innovation in approach, 
                  inclusivity in practice, and commitment to continuous improvement and 
                  lifelong learning.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Program Outcomes */}
      <section className="py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-heading text-center mb-12">Program Outcomes</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {programOutcomes.map((outcome, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-pesitm-blue text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{outcome}</p>
                </div>
              </AnimatedSection>
            ))}
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
              <div className="card bg-white flex flex-col md:flex-row items-center gap-8">
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
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
