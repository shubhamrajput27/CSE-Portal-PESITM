import { useState, useEffect } from 'react'
import axios from 'axios'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { Microscope, Cpu, Database, Shield, Wifi, Brain } from 'lucide-react'

const Research = () => {
  const [research, setResearch] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResearch()
  }, [])

  const fetchResearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/research')
      if (response.data.success) {
        setResearch(response.data.data)
      } else {
        setResearch(placeholderResearch)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching research:', error)
      setResearch(placeholderResearch)
      setLoading(false)
    }
  }

  const researchAreas = [
    {
      icon: <Brain size={40} />,
      title: 'Artificial Intelligence & Machine Learning',
      description: 'Deep learning, neural networks, computer vision, and NLP research'
    },
    {
      icon: <Shield size={40} />,
      title: 'Cybersecurity',
      description: 'Network security, cryptography, ethical hacking, and threat analysis'
    },
    {
      icon: <Wifi size={40} />,
      title: 'Internet of Things (IoT)',
      description: 'Smart systems, sensor networks, and embedded systems'
    },
    {
      icon: <Database size={40} />,
      title: 'Big Data Analytics',
      description: 'Data mining, predictive analytics, and business intelligence'
    },
    {
      icon: <Cpu size={40} />,
      title: 'Cloud Computing',
      description: 'Distributed systems, virtualization, and cloud architecture'
    },
    {
      icon: <Microscope size={40} />,
      title: 'Software Engineering',
      description: 'Agile methodologies, DevOps, and software quality assurance'
    },
  ]

  const labs = [
    {
      name: 'Programming Lab',
      facilities: 'High-performance workstations with latest IDEs and compilers'
    },
    {
      name: 'Data Science Lab',
      facilities: 'Python, R, TensorFlow, and data analysis tools'
    },
    {
      name: 'Networking Lab',
      facilities: 'Cisco routers, switches, and network simulation tools'
    },
    {
      name: 'AI/ML Lab',
      facilities: 'GPU-enabled systems for deep learning and ML research'
    },
    {
      name: 'Cybersecurity Lab',
      facilities: 'Penetration testing tools and security analysis software'
    },
    {
      name: 'IoT Lab',
      facilities: 'Arduino, Raspberry Pi, sensors, and embedded systems'
    },
  ]

  const placeholderResearch = [
    {
      _id: '1',
      title: 'Smart Healthcare Monitoring using IoT',
      description: 'Development of real-time patient monitoring system using IoT sensors',
      faculty: 'Dr. Anita Desai',
      year: '2024'
    },
    {
      _id: '2',
      title: 'Intrusion Detection using Machine Learning',
      description: 'AI-based network intrusion detection and prevention system',
      faculty: 'Prof. Rajesh Kumar',
      year: '2024'
    },
    {
      _id: '3',
      title: 'Predictive Analytics for Student Performance',
      description: 'Big data analytics for predicting student academic outcomes',
      faculty: 'Dr. Meena Patel',
      year: '2023'
    },
  ]

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-pesitm-blue to-blue-900 text-white py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Research & Labs</h1>
            <p className="text-xl text-gray-200">Innovation through cutting-edge research</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-heading text-center mb-12">Research Areas</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {researchAreas.map((area, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="card hover:scale-105 transition-transform h-full flex flex-col">
                  <div className="text-pesitm-blue mb-4">{area.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-pesitm-blue h-14 overflow-hidden">{area.title}</h3>
                  <p className="text-gray-600 h-12 overflow-hidden">{area.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Facilities */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-heading text-center mb-12">Lab Facilities</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="card bg-white">
                  <h3 className="text-lg font-bold text-pesitm-blue mb-3">{lab.name}</h3>
                  <p className="text-gray-600 text-sm">{lab.facilities}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Ongoing Projects */}
      <section className="py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-heading text-center mb-12">Ongoing Research Projects</h2>
          </AnimatedSection>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {research.map((project, index) => (
                <AnimatedSection key={project._id} delay={index * 0.1}>
                  <div className="card hover:border-l-4 hover:border-pesitm-blue transition-all">
                    <h3 className="text-xl font-bold text-pesitm-blue mb-3">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="text-sm text-gray-500">
                      <p className="font-semibold">Faculty: {project.faculty}</p>
                      <p>Year: {project.year}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collaborations */}
      <section className="py-16 bg-pesitm-blue text-white">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Industry Collaborations</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              We collaborate with leading tech companies and research institutions to provide 
              real-world exposure and research opportunities to our students.
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="text-2xl font-semibold">TCS</div>
              <div className="text-2xl font-semibold">Infosys</div>
              <div className="text-2xl font-semibold">Wipro</div>
              <div className="text-2xl font-semibold">Cognizant</div>
              <div className="text-2xl font-semibold">Microsoft</div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

export default Research
